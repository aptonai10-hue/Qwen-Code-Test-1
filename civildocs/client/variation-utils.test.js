import { describe, expect, it } from "vitest";
import { normalizeVariationClaim, recalculateVariationClaim } from "./variation-utils.js";

describe("Variation and EOT claim normalization", () => {
  it("creates reviewable cost and time claims that reconcile to user-entered impacts", () => {
    const data = normalizeVariationClaim({}, { claimType: "Both", eventDescription: "Unforeseen rock excavation", costImpact: 180_000, timeImpactDays: 14, originalValue: "1200000" });
    expect(data.claimItems).toHaveLength(2);
    expect(data.costImpact).toBe(180_000);
    expect(data.timeImpactDays).toBe(14);
    expect(data.claimItems.reduce((sum, item) => sum + item.costImpact, 0)).toBe(180_000);
  });

  it("recalculates confirmed claim totals after a flashcard edit", () => {
    const data = { claimItems: [{ itemNo: "01", description: "Rock breaking", costImpact: 95_500, timeImpactDays: 5 }, { itemNo: "02", description: "Drainage redesign", costImpact: 84_500, timeImpactDays: 9 }] };
    recalculateVariationClaim(data);
    expect(data).toMatchObject({ costImpact: 180_000, timeImpactDays: 14 });
  });

  it("computes revised completion date from the original date and reconciled days", () => {
    const data = normalizeVariationClaim({}, {
      claimType: "Extension of Time",
      eventDescription: "Late access",
      originalValue: "2400000",
      originalCompletionDate: "2026-09-15",
      timeImpactDays: 21,
    });
    expect(data.originalCompletionDate).toBe("2026-09-15");
    expect(data.revisedCompletionDate).toBe("2026-10-06");
  });

  it("uses reconciled totals for both revised value and requested action", () => {
    const data = normalizeVariationClaim({}, {
      claimType: "Both",
      eventDescription: "Unforeseen rock",
      originalValue: "2400000",
      costImpact: 180000,
      timeImpactDays: 21,
    });
    expect(data.originalContractValue).toBe("2400000.00");
    expect(data.revisedContractValue).toBe("2580000.00");
    expect(data.requestedAction).toContain("ZMW 180000.00");
    expect(data.requestedAction).toContain("21 days");
  });

  it("stamps the submission date at generation time instead of trusting an AI date", () => {
    const data = normalizeVariationClaim({ dateSubmitted: "2026-08-25" }, {
      claimType: "Variation Order",
      eventDescription: "Rock excavation",
      originalValue: "2400000",
    });
    expect(data.dateSubmitted).toBe(new Date().toISOString().slice(0, 10));
    expect(data.dateSubmitted).not.toBe("2026-08-25");
  });
});

