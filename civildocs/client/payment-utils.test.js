import { describe, expect, it } from "vitest";
import { getPaymentCertificateDeductions, getPaymentCertificateOverrun, normalizePaymentCertificate, recalculatePaymentCertificate } from "./payment-utils.js";

describe("Interim Payment Certificate valuation normalization", () => {
  it("reconciles AI valuation lines to the user-entered current and previously certified values", () => {
    const data = normalizePaymentCertificate({
      lineItems: [
        { itemNo: "1", description: "Drainage excavation", previousValue: 20_000, valueThisPeriod: 10_000 },
        { itemNo: "2", description: "Concrete lining", previousValue: 10_000, valueThisPeriod: 30_000 },
      ],
    }, { projectName: "Test Works", previousCertified: 60_000, valueThisPeriod: 100_000, retentionPercent: 10, contractSum: 500_000 });

    expect(data.previousCertified).toBe(60_000);
    expect(data.grossValueThisPeriod).toBe(100_000);
    expect(data.cumulativeValue).toBe(160_000);
    expect(data.retentionAmount).toBe(10_000);
    expect(data.netPaymentDue).toBe(90_000);
    expect(data.lineItems.reduce((sum, item) => sum + item.valueThisPeriod, 0)).toBe(100_000);
  });

  it("creates a practical single valuation line when Gemini returns no line items", () => {
    const data = normalizePaymentCertificate({}, { workDescription: "Install culverts", previousCertified: 5_000, valueThisPeriod: 25_000, retentionPercent: 5 });

    expect(data.lineItems).toHaveLength(3);
    expect(data.lineItems.map(item => item.description)).toContain("Install culverts");
    expect(data.lineItems.reduce((sum, item) => sum + item.previousValue, 0)).toBe(5_000);
    expect(data.lineItems.reduce((sum, item) => sum + item.valueThisPeriod, 0)).toBe(25_000);
    expect(data.netPaymentDue).toBe(23_750);
  });

  it("distributes a single populated AI allocation across usable multi-line valuation cards", () => {
    const data = normalizePaymentCertificate({
      lineItems: [
        { itemNo: "01", description: "Pothole repairs", previousValue: 1_200_000, valueThisPeriod: 650_000 },
        { itemNo: "02", description: "Shoulder regrading", previousValue: 0, valueThisPeriod: 0 },
        { itemNo: "03", description: "Drain desilting", previousValue: 0, valueThisPeriod: 0 },
      ],
    }, { previousCertified: 1_200_000, valueThisPeriod: 650_000, retentionPercent: 10 });

    expect(data.lineItems.filter(item => item.previousValue > 0)).toHaveLength(3);
    expect(data.lineItems.filter(item => item.valueThisPeriod > 0)).toHaveLength(3);
    expect(data.lineItems.reduce((sum, item) => sum + item.previousValue, 0)).toBe(1_200_000);
    expect(data.lineItems.reduce((sum, item) => sum + item.valueThisPeriod, 0)).toBe(650_000);
    expect(data.lineItems[2].previousValue).toBeGreaterThan(0);
    expect(data.lineItems[2].valueThisPeriod).toBeGreaterThan(0);
    expect(new Set(data.lineItems.map(item => item.valueThisPeriod)).size).toBeGreaterThan(1);
  });

  it("flags cumulative value above the contract sum with the exact excess", () => {
    const data = normalizePaymentCertificate({ lineItems: [{ description: "Roofing", previousValue: 480_000, valueThisPeriod: 50_000 }, { description: "Finishes", previousValue: 0, valueThisPeriod: 0 }, { description: "Drainage", previousValue: 0, valueThisPeriod: 0 }] }, { contractSum: 500_000, previousCertified: 480_000, valueThisPeriod: 50_000, retentionPercent: 10 });
    expect(getPaymentCertificateOverrun(data)).toMatchObject({ contractSum: 500_000, cumulativeValue: 530_000, excess: 30_000, exceeds: true });
    expect(data.contractSumOverrun).toBe(true);
    expect(data.contractSumOverrunAmount).toBe(30_000);
  });

  it("uses submitted contract values when the AI payload omits contractSum", () => {
    expect(getPaymentCertificateOverrun({ cumulativeValue: 530_000 }, { contractSum: 500_000 })).toMatchObject({
      contractSum: 500_000,
      cumulativeValue: 530_000,
      excess: 30_000,
      exceeds: true,
    });
  });

  it("treats exactly 100% as within the contract sum and 105% as an overrun", () => {
    expect(getPaymentCertificateOverrun({ cumulativeValue: 500_000 }, { contractSum: 500_000 })).toMatchObject({
      contractSum: 500_000,
      cumulativeValue: 500_000,
      excess: 0,
      exceeds: false,
    });
    expect(getPaymentCertificateOverrun({ cumulativeValue: 525_000 }, { contractSum: 500_000 })).toMatchObject({
      contractSum: 500_000,
      cumulativeValue: 525_000,
      excess: 25_000,
      exceeds: true,
    });
  });

  it("recalculates certificate totals exactly after a flashcard edit", () => {
    const data = { lineItems: [{ itemNo: "01", description: "Earthworks", previousValue: 1_000, valueThisPeriod: 2_500 }], retentionPercent: 8 };
    recalculatePaymentCertificate(data);
    expect(data).toMatchObject({ previousCertified: 1_000, grossValueThisPeriod: 2_500, cumulativeValue: 3_500, retentionAmount: 200, netPaymentDue: 2_300 });
  });

  it("reconciles contract-specific deductions and limits retention at the stated cap", () => {
    const data = normalizePaymentCertificate({ lineItems: [{ itemNo: "01", description: "Drainage", previousValue: 100_000, valueThisPeriod: 50_000 }, { itemNo: "02", description: "Concrete", previousValue: 0, valueThisPeriod: 0 }, { itemNo: "03", description: "Testing", previousValue: 0, valueThisPeriod: 0 }] }, {
      contractSum: 500_000,
      approvedVariationValue: 40_000,
      previousCertified: 100_000,
      valueThisPeriod: 50_000,
      retentionPercent: 10,
      previousRetentionHeld: 48_000,
      retentionCap: 50_000,
      advancePaymentRecovery: 4_000,
      statutoryDeductions: 1_500,
      otherDeductions: 500,
    });
    expect(getPaymentCertificateDeductions(data)).toMatchObject({ retentionAmount: 2_000, advancePaymentRecovery: 4_000, statutoryDeductions: 1_500, otherDeductions: 500, totalDeductions: 8_000 });
    expect(data).toMatchObject({ adjustedContractSum: 540_000, retentionAmount: 2_000, totalDeductions: 8_000, netPaymentDue: 42_000 });
    expect(getPaymentCertificateOverrun(data)).toMatchObject({ originalContractSum: 500_000, approvedVariationValue: 40_000, contractSum: 540_000, exceeds: false });
  });
});

