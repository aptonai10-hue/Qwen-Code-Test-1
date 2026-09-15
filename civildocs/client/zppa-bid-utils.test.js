import { describe, expect, it } from "vitest";
import { appendUniqueBudgetShortfallNote, budgetShortfallNotes, removeUnsupportedBudgetShortfallNote, ZPPA_BIDDER_PACKAGE_CONTENTS, ZPPA_TECHNICAL_PROPOSAL_HEADINGS, tenderPriceAfterDiscount } from "./zppa-bid-utils.js";

describe("ZPPA bidder-package helpers", () => {
  it("keeps the official Small Works technical-proposal headings in the package contract", () => {
    expect(ZPPA_TECHNICAL_PROPOSAL_HEADINGS).toEqual([
      "Personnel",
      "Equipment",
      "Site Organization",
      "Method Statement",
      "Mobilisation Schedule",
      "Construction Schedule",
      "Others",
    ]);
  });

  it("includes the bidder-side forms and attachments instead of employer-issued solicitation sections", () => {
    expect(ZPPA_BIDDER_PACKAGE_CONTENTS).toEqual(expect.arrayContaining([
      expect.stringContaining("Letter of Bid"),
      expect.stringContaining("Bill of Quantities"),
      expect.stringContaining("Qualification evidence"),
    ]));
  });

  it("calculates tender price from measured works less only an explicit discount", () => {
    expect(tenderPriceAfterDiscount(125000, 5000)).toBe(120000);
    expect(tenderPriceAfterDiscount(1000, 5000)).toBe(0);
  });

  it("does not duplicate the practical-scope warning when Gemini already returned it", () => {
    const existing = "Note: the described scope of works exceeds the stated budget of 850000. A realistic minimum-viable BOQ is shown above; consider increasing budget or reducing scope.";
    expect(appendUniqueBudgetShortfallNote(existing, 850000, "ZMW")).toBe(existing);
    expect(appendUniqueBudgetShortfallNote("", 850000, "ZMW")).toContain("ZMW 850,000");
  });

  it("removes a fabricated budget-shortfall note when the optional budget is blank", () => {
    const fabricated = "Note: the described scope of works exceeds the stated budget of [budget]. A realistic minimum-viable BOQ is shown above; consider increasing budget or reducing scope.";
    expect(removeUnsupportedBudgetShortfallNote(fabricated, 0)).toBe("");
    expect(removeUnsupportedBudgetShortfallNote(fabricated, 500000)).toBe(fabricated);
  });

  it("removes the same unsupported note when the model omits its final punctuation", () => {
    const variant = "Note: the described scope of works exceeds the stated budget of [budget]. A realistic minimum-viable BOQ is shown above; consider increasing budget or reducing scope";
    expect(removeUnsupportedBudgetShortfallNote(variant, 0)).toBe("");
  });

  it("adds the scope shortfall note only when calculated tender price exceeds the non-binding budget", () => {
    const modelNote = "Note: the described scope of works exceeds the stated budget of 50000000. A realistic minimum-viable BOQ is shown above; consider increasing budget or reducing scope.";
    expect(budgetShortfallNotes(modelNote, 50_000_000, 15_879_285.5)).toBe("");
    expect(budgetShortfallNotes("", 1_500_000, 2_830_868.45)).toContain("ZMW 1,500,000");
  });
});

