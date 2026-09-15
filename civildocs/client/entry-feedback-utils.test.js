import { describe, expect, it } from "vitest";
import { ENTRY_FEEDBACK_STORAGE_KEY, clearEntryFeedback, readEntryFeedback, removeEntryFeedback, saveEntryFeedback } from "./entry-feedback-utils.js";

function createStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

describe("entry-flow feedback storage", () => {
  it("saves a route, rating and optional note locally without sending it", () => {
    const storage = createStorage();
    const result = saveEntryFeedback(storage, { route: "CD-01", rating: "clear", note: "The route was easy to find." }, new Date("2026-08-21T05:20:00.000Z"));
    expect(result.saved).toBe(true);
    expect(readEntryFeedback(storage)).toEqual([{ route: "CD-01", rating: "clear", note: "The route was easy to find.", createdAt: "2026-08-21T05:20:00.000Z" }]);
    expect(storage.getItem(ENTRY_FEEDBACK_STORAGE_KEY)).toContain("CD-01");
  });

  it("rejects invalid ratings and recovers from malformed browser storage", () => {
    const storage = createStorage();
    storage.setItem(ENTRY_FEEDBACK_STORAGE_KEY, "not json");
    expect(readEntryFeedback(storage)).toEqual([]);
    expect(saveEntryFeedback(storage, { route: "CD-01", rating: "bad", note: "x" }).saved).toBe(false);
  });

  it("removes one saved entry or clears all entries without affecting unrelated local data", () => {
    const storage = createStorage();
    storage.setItem("unrelated", "keep");
    saveEntryFeedback(storage, { route: "CD-01", rating: "clear" }, new Date("2026-08-21T05:20:00.000Z"));
    saveEntryFeedback(storage, { route: "CD-02", rating: "uncertain" }, new Date("2026-08-21T05:21:00.000Z"));
    expect(removeEntryFeedback(storage, 0).entries.map(entry => entry.route)).toEqual(["CD-02"]);
    expect(removeEntryFeedback(storage, 7).removed).toBe(false);
    expect(clearEntryFeedback(storage)).toEqual([]);
    expect(readEntryFeedback(storage)).toEqual([]);
    expect(storage.getItem("unrelated")).toBe("keep");
  });
});

