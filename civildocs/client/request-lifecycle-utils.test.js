import { afterEach, describe, expect, it, vi } from "vitest";
import { CLIENT_REQUEST_TIMEOUT_MS, createStaircaseRequest, draftStorageKey, hasMeaningfulDraft, loadingStageAt } from "./request-lifecycle-utils.js";

afterEach(() => vi.useRealTimers());

describe("loading staircase", () => {
  it("uses the requested hidden, spinner, skeleton, and real elapsed-request stages", () => {
    expect(loadingStageAt(0).mode).toBe("hidden");
    expect(loadingStageAt(300).mode).toBe("spinner");
    expect(loadingStageAt(1000).mode).toBe("skeleton");
    expect(loadingStageAt(10000)).toMatchObject({ mode: "progress", progress: 52 });
    expect(loadingStageAt(35000)).toMatchObject({ mode: "progress", progress: 92 });
  });

  it("hands a deliberately slow Payment Certificate request from skeleton and progress to a terminal retry-ready timeout", async () => {
    vi.useFakeTimers();
    const stages = [];
    const outcomes = [];
    let signal;
    createStaircaseRequest({
      request: requestSignal => { signal = requestSignal; return new Promise(() => {}); },
      onStage: stage => stages.push(stage.mode),
      onOutcome: outcome => outcomes.push(outcome),
    });

    await vi.advanceTimersByTimeAsync(1000);
    expect(stages).toEqual(["hidden", "spinner", "skeleton"]);
    await vi.advanceTimersByTimeAsync(34000);
    expect(stages.at(-1)).toBe("progress");
    await vi.advanceTimersByTimeAsync(CLIENT_REQUEST_TIMEOUT_MS - 35000);
    expect(signal.aborted).toBe(true);
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].kind).toBe("timeout");
  });

  it("hands a deliberately failed Site Inspection request from skeleton to an error and cancels later progress stages", async () => {
    vi.useFakeTimers();
    const stages = [];
    const outcomes = [];
    createStaircaseRequest({
      request: () => new Promise((_, reject) => setTimeout(() => reject(new Error("network failed")), 1400)),
      onStage: stage => stages.push(stage.mode),
      onOutcome: outcome => outcomes.push(outcome),
    });

    await vi.advanceTimersByTimeAsync(1000);
    expect(stages).toEqual(["hidden", "spinner", "skeleton"]);
    await vi.advanceTimersByTimeAsync(400);
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].kind).toBe("error");
    await vi.advanceTimersByTimeAsync(12000);
    expect(stages).not.toContain("progress");
  });
});

describe("browser-local drafts", () => {
  it("uses separate stable keys for each CivilDocs module", () => {
    expect(draftStorageKey("inspection")).toBe("civildocs.draft.v1.inspection");
    expect(draftStorageKey("payment")).toBe("civildocs.draft.v1.payment");
  });

  it("retains a meaningful text edit while ignoring untouched form defaults", () => {
    expect(hasMeaningfulDraft({ currency: "ZMW", paymentTermDays: "14", observations: "" })).toBe(false);
    expect(hasMeaningfulDraft({ currency: "ZMW", observations: "Honeycombing at CH 0+450" })).toBe(true);
  });
});

