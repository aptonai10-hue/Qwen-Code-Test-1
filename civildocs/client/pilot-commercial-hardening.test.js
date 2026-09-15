import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./style.css", import.meta.url), "utf8");

describe("pilot commercial and usability hardening", () => {
  it("surfaces all three unavailable plans directly on the pilot entry screen", () => {
    expect(html).toContain('id="pilot-pricing-preview"');
    expect(html).toContain("Founding Engineer");
    expect(html).toContain("Professional");
    expect(html).toContain("Firm");
    expect((html.match(/Unavailable during pilot/g) || []).length).toBeGreaterThanOrEqual(3);
  });

  it("provides a persistent accessible appearance control", () => {
    expect(html).toContain('id="theme-toggle"');
    expect(app).toContain("saveTheme(window.localStorage");
    expect(app).toContain("document.documentElement.dataset.theme");
    expect(css).toContain('html[data-theme="dark"]');
  });

  it("uses an actionable unchecked-Terms validation state and focuses the first invalid form field", () => {
    expect(app).toContain("pilotTermsConsent.classList.add(\"is-invalid\", \"is-shaking\")");
    expect(css).toContain("@keyframes terms-consent-shake");
    expect(app).toContain("firstInvalid?.focus()");
  });

  it("keeps structured generation recovery, local drafts, and one bounded automatic retry alongside commercial UX", () => {
    expect(app).toContain("function renderStructuredFailure(error)");
    expect(app).toContain("Generation paused — your draft is safe");
    expect(app).toContain("Reason");
    expect(app).toContain("What happened");
    expect(app).toContain("Why");
    expect(app).toContain("Next action");
    expect(app).toContain("recoveryRetry.automaticAttempts < 1");
    expect(app).toContain("saveDraft();");
    expect(css).toContain(".recovery-panel__details");
  });
});

