import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./style.css", import.meta.url), "utf8");

describe("saved-draft export controls", () => {
  it("offers accessible PDF and Word export from both the draft register and current form", () => {
    expect(html).toContain('id="draft-exports-panel"');
    expect(html).toContain('data-draft-export="pdf"');
    expect(html).toContain('data-draft-export="word"');
    expect(html).toContain('id="current-draft-export-actions"');
    expect(html).toContain("Download draft PDF");
    expect(html).toContain("Download draft Word");
  });

  it("builds downloads from browser-local draft records without routing them to the AI service", () => {
    expect(app).toContain("function readSavedDraft(moduleId)");
    expect(app).toContain("localStorage.getItem(draftStorageKey(moduleId))");
    expect(app).toContain("function exportDraft(moduleId,format)");
    expect(app).toContain("application/msword;charset=utf-8");
    expect(app).toContain("window.jspdf?.jsPDF");
    expect(app).not.toContain("fetch(GEMINI_PROXY_ENDPOINT,{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({draft" );
  });

  it("keeps export buttons touch-friendly and styled for dark mode", () => {
    expect(css).toContain(".draft-export-card__actions .secondary-button");
    expect(css).toContain(".current-draft-export-actions");
    expect(css).toContain('html[data-theme="dark"] .draft-exports-panel');
  });
});

