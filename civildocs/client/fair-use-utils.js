export const FOUNDING_ENGINEER_MONTHLY_LIMIT = 30;
export const FAIR_USE_WARNING_RATIO = 0.8;
export const FAIR_USE_STORAGE_PREFIX = "civildocs.fair-use.v1";

export function localMonthKey(date = new Date()) {
  const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  return `${safeDate.getFullYear()}-${String(safeDate.getMonth() + 1).padStart(2, "0")}`;
}

export function fairUseStorageKey(monthKey = localMonthKey()) {
  return `${FAIR_USE_STORAGE_PREFIX}:${monthKey}`;
}

export function normaliseUsageRecord(raw, monthKey = localMonthKey(), limit = FOUNDING_ENGINEER_MONTHLY_LIMIT) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const used = Math.max(0, Math.floor(Number(parsed?.used) || 0));
    const storedMonth = parsed?.month === monthKey ? parsed.month : monthKey;
    return { month: storedMonth, used: Math.min(used, limit), limit };
  } catch {
    return { month: monthKey, used: 0, limit };
  }
}

export function readFairUseUsage(storage, date = new Date(), limit = FOUNDING_ENGINEER_MONTHLY_LIMIT) {
  const month = localMonthKey(date);
  if (!storage?.getItem) return { month, used: 0, limit };
  return normaliseUsageRecord(storage.getItem(fairUseStorageKey(month)), month, limit);
}

export function fairUseStatus(usage) {
  const limit = Math.max(1, Number(usage?.limit) || FOUNDING_ENGINEER_MONTHLY_LIMIT);
  const used = Math.max(0, Math.min(limit, Number(usage?.used) || 0));
  const ratio = used / limit;
  if (used >= limit) return { state: "capped", used, limit, remaining: 0, ratio: 1 };
  if (ratio >= FAIR_USE_WARNING_RATIO) return { state: "approaching", used, limit, remaining: limit - used, ratio };
  return { state: "available", used, limit, remaining: limit - used, ratio };
}

export function canStartFairUseGeneration(storage, date = new Date(), limit = FOUNDING_ENGINEER_MONTHLY_LIMIT) {
  return fairUseStatus(readFairUseUsage(storage, date, limit)).state !== "capped";
}

export function recordCompletedFairUseGeneration(storage, date = new Date(), limit = FOUNDING_ENGINEER_MONTHLY_LIMIT) {
  const usage = readFairUseUsage(storage, date, limit);
  const status = fairUseStatus(usage);
  if (status.state === "capped" || !storage?.setItem) return { ...usage, ...status, recorded: false };
  const next = { month: usage.month, used: usage.used + 1, limit };
  storage.setItem(fairUseStorageKey(next.month), JSON.stringify({ month: next.month, used: next.used }));
  return { ...next, ...fairUseStatus(next), recorded: true };
}

