import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("CivilDocs Terms and Conditions navigation", () => {
  it("provides an accessible dedicated terms view, footer entry point, and route back to the toolkit", () => {
    expect(html).toContain('id="terms-view"');
    expect(html).toContain('aria-labelledby="terms-title"');
    expect(html).toContain('id="terms-link"');
    expect(html).toContain('id="terms-back-button"');
    expect(app).toContain('document.getElementById("terms-link").addEventListener("click",showTerms)');
    expect(app).toContain('function showTerms(){cancelActiveRequest();clearStatus();showView(termsView);}');
  });

  it("keeps the core professional-review, pilot, fair-use, privacy, and legal-review disclosures visible", () => {
    expect(html).toContain("Every output is an editable draft.");
    expect(html).toContain("evaluation pilot");
    expect(html).toContain("30 AI document generations per named user per calendar month");
    expect(html).toContain("Data Protection Act, 2021");
    expect(html).toContain("qualified Zambian lawyer");
  });
});

