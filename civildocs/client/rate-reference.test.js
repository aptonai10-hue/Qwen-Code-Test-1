import { describe, expect, it } from "vitest";
import {
  RATE_REFERENCE_MANUAL_UPDATE_NOTE,
  RATE_REFERENCE_REVIEWED_ON,
  ZAMBIAN_MATERIAL_RATES,
  materialRateReferenceForPrompt
} from "./rate-reference.js";

describe("sourced Zambian material-rate references", () => {
  it("records a review date, manual update requirement, and source metadata for every default rate", () => {
    expect(RATE_REFERENCE_REVIEWED_ON).toBe("2026-08-16");
    expect(RATE_REFERENCE_MANUAL_UPDATE_NOTE).toMatch(/monthly/i);
    expect(Object.values(ZAMBIAN_MATERIAL_RATES).every(rate =>
      Number.isFinite(rate.priceZMW) && rate.priceZMW > 0 && Boolean(rate.source) && /^2026-/.test(rate.sourceDate)
    )).toBe(true);
  });

  it("uses the reviewed official diesel and cement references in AI prompt text", () => {
    const reference = materialRateReferenceForPrompt();
    expect(reference).toContain("Diesel: K 26.86 per litre");
    expect(reference).toContain("Cement 42.5: K 177.00 per 50 kg bag");
    expect(ZAMBIAN_MATERIAL_RATES.roofingSheet).toMatchObject({ unit: "m²", priceZMW: 270.27027 });
  });
});

