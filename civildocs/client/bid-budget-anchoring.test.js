import { describe, expect, it } from "vitest";
import fs from "node:fs";

const app = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("bid budget anchoring protection", () => {
  it("keeps the optional budget out of the active AI bid prompt while retaining client-side calculation of the disclosure", () => {
    const activeBidPrompt = app.slice(app.indexOf("const budgetIndependentBidPrompt = buildPrompt;"));

    expect(activeBidPrompt).toContain("Budget is a client-side reasonableness check only");
    expect(activeBidPrompt).toContain(".replace(/ Stated budget:");
    expect(app).toContain("data.notes = budgetShortfallNotes(data.notes, budget, data.grandTotal, currency);");
  });
});

