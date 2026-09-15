import { describe, expect, it } from "vitest";
import { resolveGeminiProxyEndpoint } from "./proxy-endpoint-utils.js";

describe("resolveGeminiProxyEndpoint", () => {
  it("uses same-origin proxy for missing or template runtime endpoints", () => {
    expect(resolveGeminiProxyEndpoint()).toBe("/api/gemini");
    expect(resolveGeminiProxyEndpoint("https://YOUR-REPLIT-APP.replit.app/api/gemini")).toBe("/api/gemini");
  });

  it("preserves a configured HTTPS backend proxy", () => {
    expect(resolveGeminiProxyEndpoint("https://civildocs-api.example.com/api/gemini"))
      .toBe("https://civildocs-api.example.com/api/gemini");
  });

  it("rejects unsafe protocols and malformed endpoint values", () => {
    expect(resolveGeminiProxyEndpoint("javascript:alert(1)")).toBe("/api/gemini");
    expect(resolveGeminiProxyEndpoint("https://[bad-host")).toBe("/api/gemini");
  });
});

