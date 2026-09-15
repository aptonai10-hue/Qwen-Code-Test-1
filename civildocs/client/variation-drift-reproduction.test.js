import { describe, expect, it } from "vitest";
import { normalizeVariationClaim } from "./variation-utils.js";

describe("CD-03 Variation Claim Allocation Repair", () => {
  const source = {
    projectName: "Test Project",
    claimType: "Both",
    eventDescription: "Test Event",
    costImpact: 75000,
    timeImpactDays: 12,
    originalValue: 1000000,
    originalCompletionDate: "2026-12-01"
  };

  it("ensures deterministic allocation for 'Both' claims by using category filters", () => {
    // Scenario 1: AI returns two items with a split cost, but correct categories
    const data1 = {
      claimItems: [
        { claimCategory: "Variation Order", description: "Item A", costImpact: 50000, timeImpactDays: 0 },
        { claimCategory: "Extension of Time", description: "Item B", costImpact: 25000, timeImpactDays: 12 }
      ]
    };
    const result1 = normalizeVariationClaim(data1, source);
    
    // Should be: Item 1 gets all cost (Variation), Item 2 gets all time (Time)
    expect(result1.claimItems[0].costImpact).toBe(75000);
    expect(result1.claimItems[0].timeImpactDays).toBe(0);
    expect(result1.claimItems[1].costImpact).toBe(0);
    expect(result1.claimItems[1].timeImpactDays).toBe(12);

    // Scenario 2: AI returns two items with all cost in one, correct categories
    const data2 = {
      claimItems: [
        { claimCategory: "Variation Order", description: "Item A", costImpact: 75000, timeImpactDays: 0 },
        { claimCategory: "Extension of Time", description: "Item B", costImpact: 0, timeImpactDays: 12 }
      ]
    };
    const result2 = normalizeVariationClaim(data2, source);
    
    // Should be identical to result1
    expect(result2.claimItems[0].costImpact).toBe(75000);
    expect(result2.claimItems[1].costImpact).toBe(0);
    expect(result2.claimItems[1].timeImpactDays).toBe(12);
    
    expect(result1.claimItems[0].costImpact).toBe(result2.claimItems[0].costImpact);
  });

  it("falls back to all items if categories don't match the 'Both' filter", () => {
    // If AI returns "Misc" for both
    const data = {
      claimItems: [
        { claimCategory: "Misc", description: "Item A", costImpact: 10, timeImpactDays: 1 },
        { claimCategory: "Misc", description: "Item B", costImpact: 20, timeImpactDays: 2 }
      ]
    };
    const result = normalizeVariationClaim(data, source);
    
    // Should split 1/3 and 2/3 based on weights
    expect(result.claimItems[0].costImpact).toBe(25000);
    expect(result.claimItems[1].costImpact).toBe(50000);
    expect(result.claimItems[0].timeImpactDays).toBe(4);
    expect(result.claimItems[1].timeImpactDays).toBe(8);
  });
});

