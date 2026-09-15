export type GeminiOutcomeLog = {
  event: "civildocs.gemini.request";
  requestId: string;
  status: number;
  durationMs: number;
  code?: string;
};

export function createRequestId(candidate: unknown, generate = () => crypto.randomUUID()) {
  const value = typeof candidate === "string" ? candidate.trim() : "";
  return /^[a-zA-Z0-9._-]{8,80}$/.test(value) ? value : generate();
}

export function buildGeminiOutcomeLog(requestId: string, status: number, durationMs: number, code?: string): GeminiOutcomeLog {
  return {
    event: "civildocs.gemini.request",
    requestId,
    status,
    durationMs: Math.max(0, Math.round(durationMs)),
    ...(code ? { code } : {}),
  };
}

export function logGeminiOutcome(log: GeminiOutcomeLog, write: (entry: string) => void = console.info) {
  // Intentionally contains no prompt, document data, client IP, API key, or upstream response body.
  write(JSON.stringify(log));
}

