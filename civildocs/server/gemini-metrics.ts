export type GeminiMetricsSnapshot = {
  startedAt: string;
  totalRequests: number;
  successfulRequests: number;
  capacityResponses: number;
  rateLimitedRequests: number;
  clientErrors: number;
  upstreamErrors: number;
  totalLatencyMs: number;
  lastRequestAt: string | null;
};

const metrics = {
  startedAt: new Date().toISOString(),
  totalRequests: 0,
  successfulRequests: 0,
  capacityResponses: 0,
  rateLimitedRequests: 0,
  clientErrors: 0,
  upstreamErrors: 0,
  totalLatencyMs: 0,
  lastRequestAt: null as string | null,
};

export function recordGeminiRequest(status: number, durationMs: number, code?: string) {
  metrics.totalRequests += 1;
  metrics.totalLatencyMs += Math.max(0, Math.round(durationMs));
  metrics.lastRequestAt = new Date().toISOString();

  if (code === "RATE_LIMITED") metrics.rateLimitedRequests += 1;
  else if (code === "UPSTREAM_CAPACITY" || status === 429 || status === 503) metrics.capacityResponses += 1;
  else if (status >= 200 && status < 300) metrics.successfulRequests += 1;
  else if (status >= 400 && status < 500) metrics.clientErrors += 1;
  else if (status >= 500) metrics.upstreamErrors += 1;

  console.info("[gemini-metrics]", JSON.stringify({ status, code: code || null, durationMs: Math.max(0, Math.round(durationMs)) }));
}

export function getGeminiMetrics(): GeminiMetricsSnapshot & { averageLatencyMs: number } {
  return {
    ...metrics,
    averageLatencyMs: metrics.totalRequests ? Math.round(metrics.totalLatencyMs / metrics.totalRequests) : 0,
  };
}

export function resetGeminiMetrics() {
  metrics.startedAt = new Date().toISOString();
  metrics.totalRequests = 0;
  metrics.successfulRequests = 0;
  metrics.capacityResponses = 0;
  metrics.rateLimitedRequests = 0;
  metrics.clientErrors = 0;
  metrics.upstreamErrors = 0;
  metrics.totalLatencyMs = 0;
  metrics.lastRequestAt = null;
}

