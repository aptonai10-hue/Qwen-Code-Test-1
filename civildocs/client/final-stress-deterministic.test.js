import { describe, expect, it } from "vitest";
import { normalizePaymentCertificate } from "./payment-utils.js";
import { normalizeVariationClaim } from "./variation-utils.js";
import { normalizeGradePortfolio, totalPortfolioValue } from "./grade-utils.js";
import { normalizeEscalationClause } from "./escalation-utils.js";
import { normalizeInspectionReport } from "./inspection-utils.js";

describe("final pre-handoff deterministic adversarial contracts", () => {
  it("CD-02 distinguishes exactly-at-contract certification from over-certification", () => {
    const atBoundary = normalizePaymentCertificate({}, { contractSum: 500000, previousCertified: 480000, valueThisPeriod: 20000, retentionPercent: 0 });
    const overBoundary = normalizePaymentCertificate({}, { contractSum: 500000, previousCertified: 480000, valueThisPeriod: 50000, retentionPercent: 0 });
    expect(atBoundary).toMatchObject({ cumulativeValue: 500000, contractSumOverrun: false, contractSumOverrunAmount: 0 });
    expect(overBoundary).toMatchObject({ cumulativeValue: 530000, contractSumOverrun: true, contractSumOverrunAmount: 30000 });
  });

  it("CD-02 keeps a negative current-period correction clear and does not deduct retention from it", () => {
    const result = normalizePaymentCertificate({}, { contractSum: 1000000, previousCertified: 250000, valueThisPeriod: -15000, retentionPercent: 10 });
    expect(result).toMatchObject({ grossValueThisPeriod: -15000, cumulativeValue: 235000, retentionAmount: 0, netPaymentDue: -15000 });
  });

  it("CD-02 retains cent precision at a nine-figure contract value", () => {
    const result = normalizePaymentCertificate({}, { contractSum: 150000000.55, previousCertified: 149999000.25, valueThisPeriod: 1000.3, retentionPercent: 0 });
    expect(result).toMatchObject({ cumulativeValue: 150000000.55, contractSumOverrun: false, netPaymentDue: 1000.3 });
  });

  it("CD-03 preserves independent negative cost and EOT day impacts without phantom counterparts", () => {
    const variation = normalizeVariationClaim({}, { claimType: "Variation Order", projectName: "Drainage", costImpact: -125000.55, timeImpactDays: 0, eventDescription: "Employer credit" });
    const eot = normalizeVariationClaim({}, { claimType: "Extension of Time", projectName: "Drainage", costImpact: 0, timeImpactDays: 180, eventDescription: "Access restriction" });
    expect(variation).toMatchObject({ costImpact: -125000.55, timeImpactDays: 0 });
    expect(variation.claimItems).toHaveLength(1);
    expect(eot).toMatchObject({ costImpact: 0, timeImpactDays: 180 });
    expect(eot.claimItems).toHaveLength(1);
  });

  it("CD-04 makes Grade 2 insufficiency and complete two-project evidence explicit", () => {
    const insufficient = normalizeGradePortfolio({}, { targetGrade: "2", completedProjects: [{ projectName: "One", client: "Employer", value: 1000000, year: "2026", evidenceStatus: "Available" }] });
    const qualified = normalizeGradePortfolio({}, { targetGrade: "2", nccCategory: "Civil", completedProjects: [
      { projectName: "One", client: "Employer", value: 125000000.55, year: "2026", evidenceStatus: "Available" },
      { projectName: "Two", client: "Employer", value: 88900000, year: "2025", evidenceStatus: "Available" },
    ] });
    expect(insufficient.eligibilityWarnings.join(" ")).toContain("Only 1 qualifying project");
    expect(qualified.eligibilityWarnings.join(" ")).not.toContain("two completed projects");
    expect(totalPortfolioValue(qualified.completedProjects)).toBe(213900000.55);
  });

  it("CD-05 reproduces the verified four-material K145,317.50 reconciliation", () => {
    const result = normalizeEscalationClause({}, { thresholdPercent: 5, capPercent: 20, floorPercent: -10, materialsSchedule: [
      { material: "Cement", quantity: 850, unit: "50 kg bag", baseUnitPrice: 185, currentUnitPrice: 215 },
      { material: "Reinforcement steel", quantity: 18, unit: "tonne", baseUnitPrice: 16800, currentUnitPrice: 18900 },
      { material: "Diesel", quantity: 12500, unit: "litre", baseUnitPrice: 28.5, currentUnitPrice: 29.75 },
      { material: "Aggregate", quantity: 2400, unit: "m³", baseUnitPrice: 325, currentUnitPrice: 385 },
    ] });
    expect(result.materialsSchedule.map(item => item.lineAdjustment)).toEqual([17637.5, 22680, 0, 105000]);
    expect(result.totalPayableEscalation).toBe(145317.5);
  });

  it("CD-05 applies threshold, upward cap, downward floor, and zero quantity deterministically", () => {
    const result = normalizeEscalationClause({}, { thresholdPercent: 5, capPercent: 20, floorPercent: -10, materialsSchedule: [
      { material: "Cement", quantity: 10, baseUnitPrice: 100, currentUnitPrice: 103 },
      { material: "Steel", quantity: 10, baseUnitPrice: 100, currentUnitPrice: 150 },
      { material: "Diesel", quantity: 10, baseUnitPrice: 100, currentUnitPrice: 50 },
      { material: "Aggregate", quantity: 0, baseUnitPrice: 100, currentUnitPrice: 200 },
    ] });
    expect(result.materialsSchedule.map(item => item.lineAdjustment)).toEqual([0, 150, -50, 0]);
    expect(result.totalPayableEscalation).toBe(100);
    expect(result.professionalWarnings.join(" ")).toContain("no positive quantity");
  });

  it("CD-05 keeps a ten-line high-quantity schedule in cent-accurate aggregate totals", () => {
    const materialsSchedule = Array.from({ length: 10 }, (_, index) => ({ material: `Material ${index + 1}`, quantity: 10000 + index, baseUnitPrice: 100.11, currentUnitPrice: 125.22 }));
    const result = normalizeEscalationClause({}, { thresholdPercent: 1, capPercent: 40, floorPercent: -20, materialsSchedule });
    expect(result.materialsSchedule).toHaveLength(10);
    expect(result.totalPayableEscalation).toBeGreaterThan(0);
    expect(Number.isFinite(result.totalPayableEscalation)).toBe(true);
  });

  it("CD-06 retains 25 items with practical mixed quantities and no invented negative quantity", () => {
    const result = normalizeInspectionReport({ inspectionItems: Array.from({ length: 25 }, (_, index) => ({ area: `Area ${index + 1}`, observation: `Observation ${index + 1}`, status: index % 3 ? "Requires Attention" : "Compliant", severityIfDefect: index % 4 ? "Medium" : "Critical", affectedQuantity: index === 24 ? -1 : index + 0.6, unit: index % 2 ? "m³" : "sheets" })) });
    expect(result.inspectionItems).toHaveLength(25);
    expect(result.inspectionItems.at(-1).affectedQuantity).toBeNull();
    expect(result.inspectionItems.filter(item => item.unit === "sheets").every(item => Number.isInteger(item.affectedQuantity) || item.affectedQuantity === null)).toBe(true);
  });
});

