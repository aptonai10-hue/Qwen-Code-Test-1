import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, readTheme, saveTheme } from "./theme-utils.js";

function createStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

describe("theme preference", () => {
  it("uses a saved explicit preference over the system preference", () => {
    const storage = createStorage();
    saveTheme(storage, "light");
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readTheme(storage, true)).toBe("light");
  });

  it("uses the system preference only when no valid saved choice exists", () => {
    const storage = createStorage();
    expect(readTheme(storage, true)).toBe("dark");
    storage.setItem(THEME_STORAGE_KEY, "unsupported");
    expect(readTheme(storage, false)).toBe("light");
  });
});

