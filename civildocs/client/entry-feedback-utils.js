export const ENTRY_FEEDBACK_STORAGE_KEY = "civildocs.entry-flow-feedback.v1";
export const ENTRY_FEEDBACK_MAX_ENTRIES = 25;
const VALID_RATINGS = new Set(["clear", "uncertain", "confusing"]);

function normalizeEntry(value = {}) {
  const route = String(value.route || "").trim().slice(0, 40);
  const rating = VALID_RATINGS.has(value.rating) ? value.rating : "";
  const note = String(value.note || "").trim().slice(0, 500);
  const createdAt = String(value.createdAt || "").trim();
  const createdAtMs = Date.parse(createdAt);
  return { route, rating, note, createdAt: Number.isFinite(createdAtMs) ? new Date(createdAtMs).toISOString() : "" };
}

export function readEntryFeedback(storage) {
  try {
    const values = JSON.parse(storage.getItem(ENTRY_FEEDBACK_STORAGE_KEY) || "[]");
    return Array.isArray(values) ? values.map(normalizeEntry).filter(item => item.route && item.rating && item.createdAt) : [];
  } catch {
    return [];
  }
}

export function saveEntryFeedback(storage, entry, now = new Date()) {
  const normalized = normalizeEntry({ ...entry, createdAt: now.toISOString() });
  if (!normalized.route || !normalized.rating) return { saved: false, entries: readEntryFeedback(storage) };
  const entries = [...readEntryFeedback(storage), normalized].slice(-ENTRY_FEEDBACK_MAX_ENTRIES);
  storage.setItem(ENTRY_FEEDBACK_STORAGE_KEY, JSON.stringify(entries));
  return { saved: true, entries };
}

export function removeEntryFeedback(storage, index) {
  const entries = readEntryFeedback(storage);
  if (!Number.isInteger(index) || index < 0 || index >= entries.length) return { removed: false, entries };
  const nextEntries = entries.filter((_, entryIndex) => entryIndex !== index);
  if (nextEntries.length) storage.setItem(ENTRY_FEEDBACK_STORAGE_KEY, JSON.stringify(nextEntries));
  else storage.removeItem?.(ENTRY_FEEDBACK_STORAGE_KEY);
  return { removed: true, entries: nextEntries };
}

export function clearEntryFeedback(storage) {
  storage.removeItem?.(ENTRY_FEEDBACK_STORAGE_KEY);
  return [];
}

