import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createIpRateLimiter, requestGeminiFromServer } from "./gemini-proxy";

describe("Gemini server proxy", () => {
  it("forwards a prompt upstream using only a server-supplied credential", async () => {
    const upstream = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "{}" }] } }] }), { status: 200 }),
    );

    const result = await requestGeminiFromServer({ prompt: "Create a BOQ." }, "server-only-key", upstream);

    expect(result.status).toBe(200);
    expect(upstream).toHaveBeenCalledOnce();
    expect(upstream.mock.calls[0][0]).toContain("key=server-only-key");
    expect(upstream.mock.calls[0][0]).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=server-only-key",
    );
    expect(JSON.parse(upstream.mock.calls[0][1].body)).toMatchObject({
      contents: [{ role: "user", parts: [{ text: "Create a BOQ." }] }],
    });
  });

  it("retries a temporary Gemini 503 response before returning success", async () => {
    const upstream = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: "Service unavailable" } }), { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "{}" }] } }] }), { status: 200 }));

    const result = await requestGeminiFromServer({ prompt: "Create a BOQ." }, "server-only-key", upstream);

    expect(result.status).toBe(200);
    expect(upstream).toHaveBeenCalledTimes(2);
  });

  it("returns a capacity-specific code after retrying an upstream 429 response", async () => {
    const upstream = vi.fn().mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({ error: { message: "Quota exhausted" } }), { status: 429 })),
    );

    const result = await requestGeminiFromServer({ prompt: "Create a BOQ." }, "server-only-key", upstream);

    expect(result.status).toBe(429);
    expect(result.body).toMatchObject({ code: "UPSTREAM_CAPACITY" });
    expect(upstream).toHaveBeenCalledTimes(4);
    expect(upstream.mock.calls[2][0]).toContain("models/gemini-3.5-flash-lite:generateContent");
  });

  it("fails over to the stable Flash-Lite model when the primary endpoint is unavailable", async () => {
    const upstream = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { status: "NOT_FOUND" } }), { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "{}" }] } }] }), { status: 200 }));

    const result = await requestGeminiFromServer({ prompt: "Create a BOQ." }, "server-only-key", upstream);

    expect(result.status).toBe(200);
    expect(upstream).toHaveBeenCalledTimes(2);
    expect(upstream.mock.calls[1][0]).toContain("models/gemini-3.5-flash-lite:generateContent");
  });

  it("returns a bounded timeout response when an upstream request never resolves", async () => {
    const upstream = vi.fn((_url: string, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          },
          { once: true },
        );
      }),
    );

    const result = await requestGeminiFromServer({ prompt: "Create a BOQ." }, "server-only-key", upstream, {
      attemptTimeoutMs: 4,
      requestDeadlineMs: 20,
      retryBaseDelayMs: 1,
      retryJitterMs: 0,
    });

    expect(result.status).toBe(504);
    expect(result.body).toMatchObject({ code: "UPSTREAM_TIMEOUT" });
    expect(upstream).toHaveBeenCalled();
  });

  it("keeps the timeout active while reading a stalled upstream response body", async () => {
    const upstream = vi.fn((_url: string, init?: RequestInit) =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () =>
          new Promise<string>((_resolve, reject) => {
            init?.signal?.addEventListener(
              "abort",
              () => {
                const error = new Error("body read aborted");
                error.name = "AbortError";
                reject(error);
              },
              { once: true },
            );
          }),
      } as Response),
    );

    const result = await requestGeminiFromServer({ prompt: "Create a BOQ." }, "server-only-key", upstream, {
      attemptTimeoutMs: 4,
      requestDeadlineMs: 20,
      retryBaseDelayMs: 1,
      retryJitterMs: 0,
    });

    expect(result.status).toBe(504);
    expect(result.body).toMatchObject({ code: "UPSTREAM_TIMEOUT" });
  });

  it("limits a single IP to three requests per rolling minute", () => {
    const limiter = createIpRateLimiter(3, 60_000);
    expect(limiter.check("203.0.113.10", 0).allowed).toBe(true);
    expect(limiter.check("203.0.113.10", 1).allowed).toBe(true);
    expect(limiter.check("203.0.113.10", 2).allowed).toBe(true);
    expect(limiter.check("203.0.113.10", 3)).toMatchObject({ allowed: false, retryAfterSeconds: 60 });
    expect(limiter.check("203.0.113.10", 60_001).allowed).toBe(true);
  });

  it("rejects an oversized prompt before making an upstream request", async () => {
    const upstream = vi.fn();
    const result = await requestGeminiFromServer({ prompt: "x".repeat(50_001) }, "server-only-key", upstream);
    expect(result.status).toBe(413);
    expect(result.body).toMatchObject({ code: "PROMPT_TOO_LARGE" });
    expect(upstream).not.toHaveBeenCalled();
  });
  it("does not leave a Gemini key declaration or direct Gemini endpoint in browser code", () => {
    const clientSource = readFileSync(new URL("../client/app.js", import.meta.url), "utf8");
    expect(clientSource).not.toMatch(/GEMINI_API_KEY/);
    expect(clientSource).not.toMatch(/generativelanguage\.googleapis\.com/);
    expect(clientSource).toContain('fetch(GEMINI_PROXY_ENDPOINT');
  });
});

