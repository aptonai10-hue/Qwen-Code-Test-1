// Both entries are stable Gemini API model identifiers. Keep the more capable
// document model first, then fail over only when a transient upstream response
// persists. This does not bypass quota; it gives a capacity-constrained free
// tier a second supported serving pool before returning a retry state.
const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"] as const;
const ATTEMPTS_PER_MODEL = 2;
const MAX_PROMPT_CHARS = 50_000;

const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

function retryDelayMs(attempt: number, baseDelayMs: number, jitterLimitMs: number) {
  const backoffMs = baseDelayMs * 2 ** attempt;
  const jitterMs = Math.floor(Math.random() * jitterLimitMs);
  return backoffMs + jitterMs;
}

export type GeminiProxyRequestOptions = {
  attemptTimeoutMs?: number;
  requestDeadlineMs?: number;
  retryBaseDelayMs?: number;
  retryJitterMs?: number;
};

async function fetchWithAttemptTimeout(
  fetchImplementation: typeof fetch,
  url: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const upstream = await fetchImplementation(url, { ...init, signal: controller.signal });
    const responseText = await upstream.text();
    return { upstream, responseText };
  } finally {
    clearTimeout(timeout);
  }
}
const SYSTEM_INSTRUCTION = "You are a professional construction and civil engineering documentation expert working in Zambia. You understand ZPPA tender requirements, NCC contractor grading, and standard Zambian construction industry practice. Respond ONLY with a valid JSON object. No markdown. No backticks. No explanation. No preamble. Just raw JSON matching the exact structure requested.";

type RateLimitRecord = { count: number; resetAt: number };
export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function createIpRateLimiter(maxRequests = 3, windowMs = 60_000) {
  const requests = new Map<string, RateLimitRecord>();

  return {
    check(ipAddress: string, now = Date.now()): RateLimitResult {
      requests.forEach((record, key) => {
        if (record.resetAt <= now) requests.delete(key);
      });

      const key = ipAddress || "unknown";
      const record = requests.get(key);
      if (!record || record.resetAt <= now) {
        requests.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (record.count >= maxRequests) {
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)) };
      }

      record.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

export function clientIpFromHeaders(headers: Record<string, string | string[] | undefined>, fallback = "unknown") {
  const forwarded = headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return forwardedValue?.split(",")[0]?.trim() || (Array.isArray(headers["x-real-ip"]) ? headers["x-real-ip"][0] : headers["x-real-ip"]) || fallback;
}

export const geminiRateLimiter = createIpRateLimiter();

export type GeminiProxyResult = {
  status: number;
  body: unknown;
};

export async function requestGeminiFromServer(
  payload: unknown,
  apiKey = process.env.GEMINI_API_KEY,
  fetchImplementation: typeof fetch = fetch,
  options: GeminiProxyRequestOptions = {},
): Promise<GeminiProxyResult> {
  const prompt = typeof (payload as { prompt?: unknown })?.prompt === "string" ? (payload as { prompt: string }).prompt.trim() : "";

  if (!prompt) {
    return { status: 400, body: { code: "PROMPT_REQUIRED", error: "A document prompt is required." } };
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return { status: 413, body: { code: "PROMPT_TOO_LARGE", error: "The document request is too large. Shorten the description or reduce the number of line items and try again." } };
  }

  if (!apiKey) {
    return { status: 500, body: { error: "Gemini service is not configured." } };
  }

  let lastStatus = 502;
  let lastBody: unknown = { error: "Unable to reach Gemini." };
  const attemptTimeoutMs = options.attemptTimeoutMs ?? 40_000;
  const requestDeadlineMs = options.requestDeadlineMs ?? 75_000;
  const retryBaseDelayMs = options.retryBaseDelayMs ?? 1_000;
  const retryJitterMs = options.retryJitterMs ?? 250;
  const deadlineAt = Date.now() + requestDeadlineMs;

  modelLoop: for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt += 1) {
      const remainingMs = deadlineAt - Date.now();
      if (remainingMs <= 0) {
        lastStatus = 504;
        lastBody = { error: "Gemini request exceeded the CivilDocs response window." };
        break modelLoop;
      }

      try {
        const { upstream, responseText } = await fetchWithAttemptTimeout(
          fetchImplementation,
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 12288, responseMimeType: "application/json" },
            }),
          },
          Math.min(attemptTimeoutMs, remainingMs),
        );

        let responseBody: unknown;
        try {
          responseBody = responseText ? JSON.parse(responseText) : {};
        } catch {
          responseBody = { error: "Gemini returned an invalid upstream response." };
        }

        if (upstream.ok) return { status: 200, body: responseBody };

        lastStatus = upstream.status || 502;
        lastBody = responseBody;
        const retryable = [429, 500, 503].includes(upstream.status);
        // A missing primary model should fail over to the stable fallback;
        // other client errors are actionable request/key errors, not retries.
        if (!retryable && upstream.status !== 404) break;
        if (upstream.status === 404) break;
      } catch (error) {
        const timedOut = error instanceof Error && error.name === "AbortError";
        lastStatus = timedOut ? 504 : 502;
        lastBody = { error: timedOut ? "Gemini request timed out." : "Unable to reach Gemini." };
        console.error("Gemini proxy request failed", { model, attempt, error });
      }

      if (attempt < ATTEMPTS_PER_MODEL - 1) {
        const delayMs = Math.min(retryDelayMs(attempt, retryBaseDelayMs, retryJitterMs), Math.max(0, deadlineAt - Date.now()));
        if (delayMs > 0) await wait(delayMs);
      }
    }
  }

  const capacityLimited = [429, 503].includes(lastStatus);
  const modelNotFound = lastStatus === 404;
  const timedOut = lastStatus === 504;
  return {
    status: lastStatus,
    body: {
      code: modelNotFound ? "UPSTREAM_MODEL_NOT_FOUND" : capacityLimited ? "UPSTREAM_CAPACITY" : timedOut ? "UPSTREAM_TIMEOUT" : "GEMINI_UPSTREAM_ERROR",
      error: modelNotFound ? "The configured Gemini models are unavailable. Please contact support." : capacityLimited ? "AI is temporarily at capacity. Please try again in a few minutes." : timedOut ? "AI is taking longer than expected. Please try again." : "Gemini request failed.",
      upstream: lastBody,
    },
  };
}

