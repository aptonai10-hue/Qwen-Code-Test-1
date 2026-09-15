import { beforeEach, describe, expect, it } from "vitest";
import { getGeminiMetrics, recordGeminiRequest, resetGeminiMetrics } from "./gemini-metrics";

describe("Gemini metrics", () => {
  beforeEach(() => resetGeminiMetrics());

  it("tracks success, capacity, rate-limit, and average latency counters without request content", () => {
    recordGeminiRequest(200, 120);
    recordGeminiRequest(429, 80, "UPSTREAM_CAPACITY");
    recordGeminiRequest(429, 5, "RATE_LIMITED");

    expect(getGeminiMetrics()).toMatchObject({
      totalRequests: 3,
      successfulRequests: 1,
      capacityResponses: 1,
      rateLimitedRequests: 1,
      totalLatencyMs: 205,
      averageLatencyMs: 68,
    });
  });
});

