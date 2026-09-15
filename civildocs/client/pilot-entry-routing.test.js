import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("Terms-gated pilot entry", () => {
  it("keeps the public entry focused on the disabled free-access action rather than module routes", () => {
    expect(html).toContain('id="test-free-button"');
    expect(html).toContain('type="button" disabled>Use for free</button>');
    expect(html).not.toContain("data-access-module=");
    expect(html).toContain("Sign in with Google");
    expect(html).toContain("Unavailable during pilot");
  });

  it("requires the current Terms acceptance before free entry or document workspace access", () => {
    expect(app).toContain("function startFreePilot()");
    expect(app).toContain("readPilotTermsAcceptance(window.localStorage).isCurrent");
    expect(app).toContain("recordPilotTermsAcceptance(window.localStorage)");
    expect(app).toContain('sessionStorage.setItem(PILOT_ACCESS_KEY,"open")');
    expect(app).toContain('function showHome(){const acceptance=readPilotTermsAcceptance(window.localStorage)');
    expect(app).toContain('function showForm(id){if(sessionStorage.getItem(PILOT_ACCESS_KEY)!=="open"||!readPilotTermsAcceptance(window.localStorage).isCurrent)');
  });
});

