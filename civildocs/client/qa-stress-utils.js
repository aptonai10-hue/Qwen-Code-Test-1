export const QA_STRESS_QUERY_VALUE = "full-stress";
export const QA_STRESS_SESSION_KEY = "civildocs.qa-stress-session.v1";
export const QA_STRESS_SESSION_VALUE = "authorized-2026-08-27";

export function isQaStressSession(search, storage) {
  const params = new URLSearchParams(String(search || ""));
  return params.get("civilDocsQa") === QA_STRESS_QUERY_VALUE
    && storage?.getItem?.(QA_STRESS_SESSION_KEY) === QA_STRESS_SESSION_VALUE;
}

export function qaStressAllowanceBehavior(search, storage) {
  const active = isQaStressSession(search, storage);
  return {
    active,
    enforcePilotLimit: !active,
    recordPilotUsage: !active,
    showNotice: active,
  };
}

export function shouldStartStressGeneration({ search, sessionStorage, localStorage, date }) {
  const behavior = qaStressAllowanceBehavior(search, sessionStorage);
  return !behavior.enforcePilotLimit || canStartFairUseGeneration(localStorage, date);
}

export function recordStressGeneration({ search, sessionStorage, localStorage, date }) {
  const behavior = qaStressAllowanceBehavior(search, sessionStorage);
  if (behavior.recordPilotUsage) return recordCompletedFairUseGeneration(localStorage, date);
  return { ...readFairUseUsage(localStorage, date), recorded:false, qaStressSession:true };
}

export function qaStressNoticeHidden(search, storage) {
  return !qaStressAllowanceBehavior(search, storage).showNotice;
}
import { canStartFairUseGeneration, readFairUseUsage, recordCompletedFairUseGeneration } from "./fair-use-utils.js";

