export const THEME_STORAGE_KEY = "civildocs.theme.v1";

export function normaliseTheme(value) {
  return value === "dark" || value === "light" ? value : "";
}

export function readTheme(storage, prefersDark = false) {
  try {
    return normaliseTheme(storage.getItem(THEME_STORAGE_KEY)) || (prefersDark ? "dark" : "light");
  } catch {
    return prefersDark ? "dark" : "light";
  }
}

export function saveTheme(storage, theme) {
  const normalized = normaliseTheme(theme) || "light";
  storage.setItem(THEME_STORAGE_KEY, normalized);
  return normalized;
}

