import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("browser-local feedback manager", () => {
  it("exposes feedback management through Settings with local-only disclosure", () => {
    expect(html).toContain('id="feedback-manager-open-button"');
    expect(html).toContain('id="feedback-manager-panel"');
    expect(html).toContain("Feedback saved on this device.");
    expect(html).toContain('id="feedback-manager-clear"');
  });

  it("renders saved feedback and supports individual or all-entry removal", () => {
    expect(app).toContain("function openFeedbackManager()");
    expect(app).toContain("removeEntryFeedback(window.localStorage");
    expect(app).toContain("clearEntryFeedback(window.localStorage)");
  });

  it("supports Escape dismissal for the settings and feedback dialogs", () => {
    expect(app).toContain('window.addEventListener("keydown",handleDialogEscape)');
    expect(app).toContain('function handleDialogEscape(event)');
    expect(app).toContain('if(event.key!=="Escape")return;');
    expect(app).toContain("closeFeedbackManager()");
    expect(app).toContain("closeSettings()");
  });
});

