import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const draftExports = readFileSync(new URL("./draft-export-utils.js", import.meta.url), "utf8");

describe("refined keyboard access", () => {
  it("keeps the entry consent, document routes, settings, and back navigation as native controls", () => {
    expect(html).toMatch(/<input[^>]*id="pilot-terms-checkbox"[^>]*type="checkbox"/);
    expect(html).toMatch(/<button[^>]*id="test-free-button"[^>]*type="button"[^>]*disabled/);
    expect(html).not.toContain("data-access-module=");
    expect(app).toContain('data-module="${id}"');
    expect(html).toMatch(/<button[^>]*id="back-button"[^>]*type="button"/);
    expect(html).toMatch(/<button[^>]*id="settings-link"[^>]*type="button"/);
  });

  it("keeps native export actions and keyboard-dismissable dialog behavior wired after refinement", () => {
    expect(draftExports).toContain('data-draft-export="pdf"');
    expect(draftExports).toContain('data-draft-export="word"');
    expect(app).toContain("exportDraft(moduleId,button.dataset.draftExport)");
    expect(app).toContain("window.addEventListener(\"keydown\",handleDialogEscape)");
    expect(app).toContain('if(event.key!=="Escape")return;');
  });
});

