import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("mandatory pilot Terms acceptance interface", () => {
  it("keeps an explicit Terms acceptance control before free pilot entry", () => {
    expect(html).toContain('id="pilot-terms-checkbox"');
    expect(html).toContain('id="test-free-button"');
    expect(html).toContain('id="access-terms-link"');
    expect(html).toContain("Version 1.1");
  });

  it("records a versioned acceptance before unlocking the pilot workspace", () => {
    expect(app).toContain("recordPilotTermsAcceptance(window.localStorage)");
    expect(app).toContain("readPilotTermsAcceptance(window.localStorage).isCurrent");
    expect(app).toContain("pilotTermsCheckbox.checked");
    expect(app).toContain("function startFreePilot()");
    expect(app).toContain('sessionStorage.setItem(PILOT_ACCESS_KEY,"open")');
  });
});

