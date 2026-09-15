import { describe, expect, it } from "vitest";
import { isQaStressSession, qaStressAllowanceBehavior, qaStressNoticeHidden, recordStressGeneration, shouldStartStressGeneration, QA_STRESS_SESSION_KEY, QA_STRESS_SESSION_VALUE } from "./qa-stress-utils.js";

function storage(entries = {}) {
  const values = { ...entries };
  return {
    getItem: key => values[key] ?? null,
    setItem: (key, value) => { values[key] = value; },
  };
}

describe("isQaStressSession", () => {
  it("enables the allowance only for the exact QA query and current browser session marker", () => {
    expect(isQaStressSession("?civilDocsQa=full-stress", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toBe(true);
  });

  it("does not alter normal pilot usage for ordinary, incomplete, or stale browser states", () => {
    expect(isQaStressSession("", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toBe(false);
    expect(isQaStressSession("?civilDocsQa=full-stress", storage())).toBe(false);
    expect(isQaStressSession("?civilDocsQa=other", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toBe(false);
  });

  it("enforces and records ordinary pilot usage unless the exact QA query and marker are both present", () => {
    expect(qaStressAllowanceBehavior("", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toMatchObject({ active:false, enforcePilotLimit:true, recordPilotUsage:true, showNotice:false });
    expect(qaStressAllowanceBehavior("?civilDocsQa=full-stress", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toMatchObject({ active:true, enforcePilotLimit:false, recordPilotUsage:false, showNotice:true });
  });

  it("blocks a capped normal session, bypasses only the guarded QA session, and does not increment QA usage", () => {
    const date = new Date("2026-08-27T12:00:00");
    const normalStorage = storage({ "civildocs.fair-use.v1:2026-08": JSON.stringify({ month:"2026-08", used:30 }) });
    const qaStorage = storage({ "civildocs.fair-use.v1:2026-08": JSON.stringify({ month:"2026-08", used:30 }) });
    const qaSession = storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE });

    expect(shouldStartStressGeneration({ search:"", sessionStorage:qaSession, localStorage:normalStorage, date })).toBe(false);
    expect(shouldStartStressGeneration({ search:"?civilDocsQa=full-stress", sessionStorage:qaSession, localStorage:qaStorage, date })).toBe(true);
    expect(recordStressGeneration({ search:"?civilDocsQa=full-stress", sessionStorage:qaSession, localStorage:qaStorage, date })).toMatchObject({ used:30, recorded:false, qaStressSession:true });
  });

  it("drives the rendered QA notice state from the same exact query-and-session condition", () => {
    const qaSession = storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE });
    expect(qaStressNoticeHidden("", qaSession)).toBe(true);
    expect(qaStressNoticeHidden("?civilDocsQa=full-stress", storage())).toBe(true);
    expect(qaStressNoticeHidden("?civilDocsQa=full-stress", qaSession)).toBe(false);
  });
});

