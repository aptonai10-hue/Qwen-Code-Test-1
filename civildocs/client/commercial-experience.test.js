import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("CivilDocs pricing and pilot commercial experience", () => {
  it("provides the pricing plans, transparent device-local tracking notice, and cap warning disclosure", () => {
    expect(html).toContain('id="pricing-view"');
    expect(html).toContain("Founding Engineer");
    expect(html).toContain("ZMW</span> 199");
    expect(html).toContain("30 proposed AI document generations per named user/month");
    expect(html).toContain("device-local pilot tracker");
    expect(html).toContain('id="fair-use-warning"');
    expect(app).toContain("canStartFairUseGeneration(window.localStorage)");
    expect(app).toContain("recordCompletedFairUseGeneration(window.localStorage)");
  });

  it("prepares feedback without silently transmitting user content and supports an optional configured contact route", () => {
    expect(html).toContain('id="pilot-feedback-form"');
    expect(html).toContain("Nothing is sent automatically.");
    expect(html).toContain('id="feedback-copy-button"');
    expect(app).toContain("supportEmail");
    expect(app).toContain("mailto:");
    expect(app).toContain("Your message is ready to copy");
    expect(readFileSync(new URL("./style.css", import.meta.url), "utf8")).toContain('#feedback-email-link[hidden] { display:none !important; }');
  });
});

