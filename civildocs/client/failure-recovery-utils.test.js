import { describe, expect, it } from "vitest";
import { AUTOMATIC_RETRY_DELAY_MS, describeGenerationFailure, retryCountdownLabel } from "./failure-recovery-utils.js";

describe("generation failure recovery", () => {
  it("explains busy servers with preserved draft and a four-minute automatic retry", () => {
    const detail = describeGenerationFailure({ code: "UPSTREAM_CAPACITY" });
    expect(detail).toMatchObject({
      reason: "Servers are busy",
      whatHappened: "The AI did not receive a completed request, so no new document was made.",
      canAutoRetry: true,
    });
    expect(detail.nextAction).toContain("four minutes");
  });

  it("does not auto-retry a request that needs the tester to reduce its content", () => {
    expect(describeGenerationFailure({ code: "PROMPT_TOO_LARGE" }).canAutoRetry).toBe(false);
  });

  it("formats the controlled automatic-retry countdown", () => {
    expect(AUTOMATIC_RETRY_DELAY_MS).toBe(240000);
    expect(retryCountdownLabel(240000)).toBe("4:00");
    expect(retryCountdownLabel(61000)).toBe("1:01");
  });
});

