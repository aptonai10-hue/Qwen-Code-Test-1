const CACHE_KEY_PREFIX = "civildocs.repeat-cache.v1";
const MAX_CACHE_AGE_MS = 6 * 60 * 60 * 1000;

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = stableValue(value[key]);
      return result;
    }, {});
  }
  return value;
}

export function repeatInputKey(values) {
  return JSON.stringify(stableValue(values || {}));
}

function cacheKey(moduleId) {
  return `${CACHE_KEY_PREFIX}.${String(moduleId || "unknown")}`;
}

export function readRepeatCache(moduleId, values, storage = globalThis.localStorage) {
  try {
    const entry = JSON.parse(storage.getItem(cacheKey(moduleId)) || "null");
    if (!entry || entry.key !== repeatInputKey(values) || Date.now() - Number(entry.savedAt || 0) > MAX_CACHE_AGE_MS) return null;
    return structuredClone(entry.data);
  } catch {
    return null;
  }
}

export function writeRepeatCache(moduleId, values, data, storage = globalThis.localStorage) {
  try {
    storage.setItem(cacheKey(moduleId), JSON.stringify({ key: repeatInputKey(values), savedAt: Date.now(), data }));
  } catch {
    // Storage can be disabled or full; generation remains fully functional.
  }
}

export function clearRepeatCache(moduleId, storage = globalThis.localStorage) {
  try { storage.removeItem(cacheKey(moduleId)); } catch {}
}

export function readBidRepeatCache(values, storage = globalThis.localStorage) {
  return readRepeatCache("bid", values, storage);
}

export function writeBidRepeatCache(values, data, storage = globalThis.localStorage) {
  writeRepeatCache("bid", values, data, storage);
}

export function clearBidRepeatCache(storage = globalThis.localStorage) {
  clearRepeatCache("bid", storage);
}

