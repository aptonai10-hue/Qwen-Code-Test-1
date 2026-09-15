import { describe, expect, it } from "vitest";
import { validateGeneratedResponse } from "./response-validation-utils.js";

describe("AI response shape validation", () => {
  it("accepts a valid minimal payload for each module", () => {
    const payloads = {
      bid: { boqItems: [{ description: "Excavation", quantity: 1, rate: 10 }] },
      payment: { lineItems: [{ previousValue: 1, valueThisPeriod: 2 }] },
      variation: { claimItems: [{ costImpact: -1, timeImpactDays: 0 }] },
      grade: { completedProjects: [{ value: 100 }] },
      escalation: { materialsSchedule: [{ quantity: 1, baseUnitPrice: 10, currentUnitPrice: 12 }] },
      inspection: { inspectionItems: [{ affectedQuantity: null }] },
    };
    Object.entries(payloads).forEach(([type, data]) => expect(validateGeneratedResponse(type, data).ok).toBe(true));
  });

  it("rejects malformed arrays and unsafe negative physical quantities", () => {
    expect(validateGeneratedResponse("bid", { boqItems: "not-an-array" }).ok).toBe(false);
    expect(validateGeneratedResponse("bid", { boqItems: [] }).errors).toContain("boqItems must contain at least one item");
    expect(validateGeneratedResponse("bid", { boqItems: [{ description: "Cement", quantity: -0.01, rate: 10 }] }).errors).toContain("boqItems[0] has an invalid quantity");
    expect(validateGeneratedResponse("escalation", { materialsSchedule: [{ quantity: -1, baseUnitPrice: 10, currentUnitPrice: 12 }] }).ok).toBe(false);
  });

  it("rejects an oversized AI-generated item list", () => {
    const boqItems = Array.from({ length: 101 }, (_, index) => ({ description: `Item ${index}`, quantity: 1, rate: 1 }));
    expect(validateGeneratedResponse("bid", { boqItems }).errors).toContain("boqItems exceeds the safe 100-item limit");
  });

  it("allows negative monetary claim impacts because credits can be legitimate", () => {
    expect(validateGeneratedResponse("variation", { claimItems: [{ costImpact: -18500, timeImpactDays: 0 }] }).ok).toBe(true);
  });
});

