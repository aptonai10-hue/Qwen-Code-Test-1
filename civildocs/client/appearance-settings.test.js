import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./style.css", import.meta.url), "utf8");

describe("appearance settings placement", () => {
  it("keeps the masthead free of the appearance control and puts it in a dedicated settings dialog", () => {
    expect(html).not.toContain('class="masthead-actions"');
    expect(html).toContain('id="settings-panel"');
    expect(html).toContain('id="theme-toggle" class="settings-theme-toggle"');
    expect(html).toContain('id="settings-link"');
  });

  it("opens and closes settings without changing the persisted theme contract", () => {
    expect(app).toContain("function openSettings()");
    expect(app).toContain("function closeSettings()");
    expect(app).toContain("saveTheme(window.localStorage");
    expect(css).toContain(".settings-panel__sheet");
  });
});

