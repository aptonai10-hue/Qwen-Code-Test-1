import { describe, expect, it } from "vitest";
import {
  FAIR_USE_STORAGE_PREFIX,
  canStartFairUseGeneration,
  fairUseStatus,
  localMonthKey,
  readFairUseUsage,
  recordCompletedFairUseGeneration,
} from "./fair-use-utils.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

describe("fair-use tracking", () => {
  it("starts at zero and stores completed successful generations in the current local month", () => {
    const storage = memoryStorage();
    const date = new Date(2026, 7, 20);
    expect(localMonthKey(date)).toBe("2026-08");
    expect(readFairUseUsage(storage, date)).toMatchObject({ month: "2026-08", used: 0, limit: 30 });
    expect(recordCompletedFairUseGeneration(storage, date)).toMatchObject({ used: 1, remaining: 29, recorded: true });
    expect(storage.getItem(`${FAIR_USE_STORAGE_PREFIX}:2026-08`)).toContain('"used":1');
  });

  it("warns at 80 percent of the allowance and retains the remaining quantity", () => {
    expect(fairUseStatus({ used: 23, limit: 30 })).toMatchObject({ state: "available", remaining: 7 });
    expect(fairUseStatus({ used: 24, limit: 30 })).toMatchObject({ state: "approaching", remaining: 6 });
  });

  it("never records above the cap and prevents a further local generation start", () => {
    const storage = memoryStorage();
    const date = new Date(2026, 7, 20);
    storage.setItem(`${FAIR_USE_STORAGE_PREFIX}:2026-08`, JSON.stringify({ month: "2026-08", used: 30 }));
    expect(canStartFairUseGeneration(storage, date)).toBe(false);
    expect(recordCompletedFairUseGeneration(storage, date)).toMatchObject({ used: 30, state: "capped", recorded: false });
  });

  it("does not carry usage into the next device-local calendar month", () => {
    const storage = memoryStorage();
    storage.setItem(`${FAIR_USE_STORAGE_PREFIX}:2026-08`, JSON.stringify({ month: "2026-08", used: 18 }));
    expect(readFairUseUsage(storage, new Date(2026, 8, 1))).toMatchObject({ month: "2026-09", used: 0, limit: 30 });
  });
});

