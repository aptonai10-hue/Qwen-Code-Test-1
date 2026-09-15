import { describe, expect, it } from "vitest";
import { CURRENT_PILOT_TERMS_VERSION, PILOT_TERMS_ACCEPTANCE_STORAGE_KEY, readPilotTermsAcceptance, recordPilotTermsAcceptance } from "./terms-acceptance-utils.js";

function createStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

describe("pilot Terms acceptance", () => {
  it("records the current version with an ISO timestamp", () => {
    const storage = createStorage();
    const acceptance = recordPilotTermsAcceptance(storage, new Date("2026-08-20T08:30:00.000Z"));
    expect(acceptance).toEqual({ termsVersion: CURRENT_PILOT_TERMS_VERSION, acceptedAt: "2026-08-20T08:30:00.000Z", isCurrent: true });
    expect(JSON.parse(storage.getItem(PILOT_TERMS_ACCEPTANCE_STORAGE_KEY))).toMatchObject({ termsVersion: CURRENT_PILOT_TERMS_VERSION });
  });

  it("treats a prior Terms version as stale", () => {
    const storage = createStorage();
    storage.setItem(PILOT_TERMS_ACCEPTANCE_STORAGE_KEY, JSON.stringify({ termsVersion: "1.0", acceptedAt: "2026-08-20T08:30:00.000Z" }));
    expect(readPilotTermsAcceptance(storage)).toMatchObject({ termsVersion: "1.0", isCurrent: false });
  });

  it("fails safely for malformed records or invalid timestamps", () => {
    const storage = createStorage();
    storage.setItem(PILOT_TERMS_ACCEPTANCE_STORAGE_KEY, "not json");
    expect(readPilotTermsAcceptance(storage)).toEqual({ termsVersion: "", acceptedAt: "", isCurrent: false });
    storage.setItem(PILOT_TERMS_ACCEPTANCE_STORAGE_KEY, JSON.stringify({ termsVersion: CURRENT_PILOT_TERMS_VERSION, acceptedAt: "not-a-date" }));
    expect(readPilotTermsAcceptance(storage).isCurrent).toBe(false);
  });
});

