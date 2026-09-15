import { describe, expect, it, vi } from "vitest";
import { buildGeminiOutcomeLog, createRequestId, logGeminiOutcome } from "./operational-logging";

describe("operational AI request logging", () => {
  it("keeps a safe supplied request id and rejects unsafe values", () => {
    expect(createRequestId("pilot-req_20260820")).toBe("pilot-req_20260820");
    expect(createRequestId("contains space", () => "generated-id")).toBe("generated-id");
    expect(createRequestId("<script>", () => "generated-id")).toBe("generated-id");
  });

  it("writes a structured outcome without request or response content", () => {
    const write = vi.fn();
    logGeminiOutcome(buildGeminiOutcomeLog("pilot-req_20260820", 503, 812.8, "UPSTREAM_CAPACITY"), write);
    expect(write).toHaveBeenCalledWith('{"event":"civildocs.gemini.request","requestId":"pilot-req_20260820","status":503,"durationMs":813,"code":"UPSTREAM_CAPACITY"}');
    expect(write.mock.calls[0][0]).not.toContain("prompt");
    expect(write.mock.calls[0][0]).not.toContain("upstream");
  });
});

