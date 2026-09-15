import { describe, expect, it } from "vitest";
import { assessModule2Payload, buildModule2ValidationPrompt, extractModule2Payload } from "./module2-validation-utils";

describe("Module 2 scheduled validation contract", () => {
  it("extracts and accepts a Gemini payload with three usable valuation lines", () => {
    const upstream = {
      candidates: [{ content: { parts: [{ text: JSON.stringify({ lineItems: [
        { description: "Mobilisation", previousValue: 10000, valueThisPeriod: 5000 },
        { description: "Excavation and concrete drains", previousValue: 25000, valueThisPeriod: 15000 },
        { description: "Reinstatement and testing", previousValue: 5000, valueThisPeriod: 8000 },
      ] }) }] } }],
    };
    expect(assessModule2Payload(extractModule2Payload(upstream))).toMatchObject({ ok: true, lineItemCount: 3, flashcardReviewReady: true, pdfHandoffReady: true });
  });

  it("rejects a response with fewer than three complete valuation lines", () => {
    expect(assessModule2Payload({ lineItems: [{ description: "Mobilisation", previousValue: 0, valueThisPeriod: 1000 }] })).toMatchObject({ ok: false, lineItemCount: 1 });
  });

  it("uses a fixed realistic multi-stage validation scenario", () => {
    expect(buildModule2ValidationPrompt()).toContain("at least three distinct valuation lines");
    expect(buildModule2ValidationPrompt()).toContain("Kitwe drainage rehabilitation");
  });
});

