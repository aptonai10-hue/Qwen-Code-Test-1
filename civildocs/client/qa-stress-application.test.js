import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { canStartFairUseGeneration, fairUseStorageKey } from "./fair-use-utils.js";
import { isQaStressSession, qaStressAllowanceBehavior, QA_STRESS_SESSION_KEY, QA_STRESS_SESSION_VALUE } from "./qa-stress-utils.js";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const stressLog = readFileSync(new URL("../CivilDocs_Full_Stress_Run_Log_2026-08-27.md", import.meta.url), "utf8");

function storage(entries = {}) {
  const values = { ...entries };
  return {
    getItem: key => values[key] ?? null,
    setItem: (key, value) => { values[key] = value; },
  };
}

describe("QA stress allowance integration", () => {
  it("keeps the ordinary browser-local cap enforced when the QA query or session marker is absent", () => {
    const month = "2026-08";
    const capped = storage({ [fairUseStorageKey(month)]: JSON.stringify({ month, used: 30 }) });
    expect(canStartFairUseGeneration(capped, new Date("2026-08-27T12:00:00"))).toBe(false);
    expect(isQaStressSession("?civilDocsQa=full-stress", storage())).toBe(false);
    expect(isQaStressSession("", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toBe(false);
  });

  it("requires both exact guards before bypassing the normal cap or suppressing usage recording", () => {
    expect(app).toContain("shouldStartStressGeneration({ search:window.location.search, sessionStorage:window.sessionStorage, localStorage:window.localStorage })");
    expect(app).toContain("recordStressGeneration({ search:window.location.search, sessionStorage:window.sessionStorage, localStorage:window.localStorage })");
    expect(isQaStressSession("?civilDocsQa=full-stress", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toBe(true);
  });

  it("keeps the QA warning hidden on normal routes and identifies its browser-only scope when active", () => {
    expect(html).toContain('id="qa-stress-notice"');
    expect(html).toContain("QA stress session active in this browser only.");
    expect(stressLog).toContain("`civilDocsQa=full-stress`");
    expect(stressLog).toContain("sessionStorage");
    expect(qaStressAllowanceBehavior("", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toMatchObject({ showNotice:false, enforcePilotLimit:true, recordPilotUsage:true });
    expect(qaStressAllowanceBehavior("?civilDocsQa=full-stress", storage({ [QA_STRESS_SESSION_KEY]: QA_STRESS_SESSION_VALUE }))).toMatchObject({ showNotice:true, enforcePilotLimit:false, recordPilotUsage:false });
  });
});

