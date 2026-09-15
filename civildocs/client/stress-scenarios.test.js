import { describe, expect, it } from "vitest";
import { practicalQuantityFor } from "./boq-utils.js";
import { appendUniqueBudgetShortfallNote } from "./zppa-bid-utils.js";
import { normalizePaymentCertificate, recalculatePaymentCertificate } from "./payment-utils.js";
import { normalizeVariationClaim } from "./variation-utils.js";
import { normalizeGradePortfolio, totalPortfolioValue } from "./grade-utils.js";
import { normalizeEscalationClause } from "./escalation-utils.js";
import { normalizeInspectionReport } from "./inspection-utils.js";

const sum = (items, field) => Number(items.reduce((total, item) => total + Number(item[field] || 0), 0).toFixed(2));

describe("CivilDocs multi-scenario stress contracts", () => {
  describe("Module 1 — Bid Package Builder", () => {
    it("handles a 35-line multi-section BOQ without fractional count-based items", () => {
      const items = Array.from({ length: 35 }, (_, index) => ({
        description: index % 3 === 0 ? `Concrete blocks for section ${index + 1}` : `Drain excavation section ${index + 1}`,
        unit: index % 3 === 0 ? "blocks" : "m³",
        quantity: index % 3 === 0 ? index + 0.4 : index / 3 + 0.06,
      }));
      const normalized = items.map(practicalQuantityFor);
      expect(normalized).toHaveLength(35);
      expect(normalized.filter((_, index) => index % 3 === 0).every(Number.isInteger)).toBe(true);
      expect(normalized.filter((_, index) => index % 3 !== 0).every(value => Number((value * 10).toFixed(6)) % 1 === 0)).toBe(true);
    });

    it("normalizes mixed procurement units consistently", () => {
      expect(practicalQuantityFor({ description: "Cement", unit: "bags", quantity: 4.6 })).toBe(5);
      expect(practicalQuantityFor({ description: "River sand", unit: "m³", quantity: 1.26 })).toBe(1.3);
      expect(practicalQuantityFor({ description: "Rebar", unit: "tonne", quantity: 4.74 })).toBe(4.5);
      expect(practicalQuantityFor({ description: "Diesel", unit: "litres", quantity: 49.6 })).toBe(50);
      expect(practicalQuantityFor({ description: "Drain channel", unit: "m", quantity: 7.26 })).toBe(7.3);
      expect(practicalQuantityFor({ description: "Roof sheeting", unit: "m²", quantity: 12.26 })).toBe(12.3);
    });

    it("adds the honest budget warning only once under a constrained budget", () => {
      const once = appendUniqueBudgetShortfallNote("", 12000);
      const twice = appendUniqueBudgetShortfallNote(once, 12000);
      expect(twice).toBe(once);
      expect((twice.match(/described scope of works exceeds the stated budget/gi) || [])).toHaveLength(1);
    });
  });

  describe("Module 2 — Interim Payment Certificate", () => {
    it("reconciles a 12-line multi-page valuation to requested certificate totals", () => {
      const lineItems = Array.from({ length: 12 }, (_, index) => ({ description: `Measured work ${index + 1}`, previousValue: index + 1, valueThisPeriod: index + 2 }));
      const result = normalizePaymentCertificate({ lineItems }, { projectName: "Township roads", previousCertified: 960000, valueThisPeriod: 240000, retentionPercent: 10 });
      expect(result.lineItems).toHaveLength(12);
      expect(sum(result.lineItems, "previousValue")).toBe(960000);
      expect(sum(result.lineItems, "valueThisPeriod")).toBe(240000);
      expect(result.netPaymentDue).toBe(216000);
    });

    it("recalculates a negative recovery adjustment without losing line-item detail", () => {
      const result = recalculatePaymentCertificate({ lineItems: [
        { description: "Measured excavation", previousValue: 10000, valueThisPeriod: 15000 },
        { description: "Recovery of advance", previousValue: 0, valueThisPeriod: -2500 },
        { description: "Testing", previousValue: 0, valueThisPeriod: 4000 },
      ] }, { retentionPercent: 5 });
      expect(result.lineItems).toHaveLength(3);
      expect(result.grossValueThisPeriod).toBe(16500);
      expect(result.netPaymentDue).toBe(15675);
    });

    it("creates three reviewable lines for sparse input", () => {
      const result = normalizePaymentCertificate({}, { projectName: "Culvert", workDescription: "Clear drains", valueThisPeriod: 9000 });
      expect(result.lineItems).toHaveLength(3);
      expect(result.lineItems.every(item => item.description.length > 3)).toBe(true);
    });
  });

  describe("Module 3 — Variation and EOT Claims", () => {
    it("keeps five claims and their combined cost and time totals intact", () => {
      const claimItems = Array.from({ length: 5 }, (_, index) => ({ description: `Event ${index + 1}`, costImpact: 10 + index, timeImpactDays: index + 1 }));
      const result = normalizeVariationClaim({ claimItems }, { projectName: "Bridge works", costImpact: 500000, timeImpactDays: 35 });
      expect(result.claimItems).toHaveLength(5);
      expect(result.costImpact).toBe(500000);
      expect(result.timeImpactDays).toBe(35);
    });

    it("splits a mixed variation and time request into reviewable claim categories", () => {
      const result = normalizeVariationClaim({}, { claimType: "Both", eventDescription: "Unforeseen rock", costImpact: 125000, timeImpactDays: 18 });
      expect(result.claimItems.map(item => item.claimCategory)).toEqual(["Variation Order", "Extension of Time"]);
      expect(result.costImpact).toBe(125000);
      expect(result.timeImpactDays).toBe(18);
    });

    it("keeps incomplete instruction evidence explicit rather than fabricating it", () => {
      const result = normalizeVariationClaim({}, { projectName: "Drainage", claimType: "Extension of Time", eventDescription: "", reason: "Late access" });
      expect(result.claimItems[0].description).toBe("Contract change event");
      expect(result.causeOfVariationOrDelay).toBe("Late access");
    });
  });

  describe("Module 4 — NCC Grade Upgrade Portfolio", () => {
    it("preserves and totals a 15-project portfolio", () => {
      const completedProjects = Array.from({ length: 15 }, (_, index) => ({ projectName: `Project ${index + 1}`, client: `Client ${index + 1}`, value: 125000 * (index + 1), year: String(2012 + index) }));
      const result = normalizeGradePortfolio({}, { companyName: "Kitwe Works", currentGrade: "5", targetGrade: "3", yearsInOperation: 16, completedProjects });
      expect(result.completedProjects).toHaveLength(15);
      expect(totalPortfolioValue(result.completedProjects)).toBe(15000000);
    });

    it("retains large values without losing two-decimal precision", () => {
      const result = normalizeGradePortfolio({}, { completedProjects: [{ projectName: "Major road", client: "Employer", value: "125000000.55", year: "2025" }] });
      expect(totalPortfolioValue(result.completedProjects)).toBe(125000000.55);
    });

    it("labels missing project client evidence transparently", () => {
      const result = normalizeGradePortfolio({}, { completedProjects: [{ projectName: "Unverified project", value: 0 }] });
      expect(result.completedProjects[0]).toMatchObject({ client: "Client to be confirmed", value: 0, year: "" });
    });
  });

  describe("Module 5 — Escalation Clause Builder", () => {
    it("creates a large material schedule with numeric rate references", () => {
      const materials = ["Cement", "Reinforcement steel", "Diesel", "Building sand", "Crushed aggregate", "Common brick", "Roofing sheet", "Timber", "Cement 42.5", "Diesel fuel", "Reinforcement steel UMZ", "Roofing sheet polycarbonate"];
      const result = normalizeEscalationClause({ materialsSchedule: materials.map(material => ({ material })) }, { projectName: "Road contract", contractValue: 5000000, duration: 24, baseDate: "2026-08-01" });
      expect(result.materialsSchedule).toHaveLength(12);
      expect(result.materialsSchedule.every(item => Number.isFinite(item.baseUnitPrice))).toBe(true);
    });

    it("keeps a user-specified supplier quotation over the shared reference", () => {
      const result = normalizeEscalationClause({ materialsSchedule: [{ material: "Diesel", baseUnitPrice: "29.75", source: "Supplier quotation" }] }, { projectName: "Dam", contractValue: 1000000 });
      expect(result.materialsSchedule[0]).toMatchObject({ baseUnitPrice: 29.75, source: "Supplier quotation" });
    });

    it("handles an unknown material without inventing a reference price", () => {
      const result = normalizeEscalationClause({ materialsSchedule: [{ material: "Geotextile membrane" }] }, { projectName: "Flood works" });
      expect(result.materialsSchedule[0]).toMatchObject({ unit: "unit", baseUnitPrice: 0 });
    });
  });

  describe("Module 6 — Site Inspection and Defect Log", () => {
    it("retains a 15-item inspection register for a multi-page report", () => {
      const inspectionItems = Array.from({ length: 15 }, (_, index) => ({ area: `Workfront ${index + 1}`, observation: `Observation ${index + 1}`, status: index % 2 ? "Requires Attention" : "Compliant", severityIfDefect: "Medium", actionRequired: "Close out", dueDate: "2026-09-01" }));
      const result = normalizeInspectionReport({ inspectionItems }, { projectName: "Market paving" });
      expect(result.inspectionItems).toHaveLength(15);
      expect(result.inspectionItems.map(item => item.itemNo)).toEqual(Array.from({ length: 15 }, (_, index) => String(index + 1).padStart(2, "0")));
    });

    it("retains a 25-item inspection register for a large field review", () => {
      const inspectionItems = Array.from({ length: 25 }, (_, index) => ({ area: `Workfront ${index + 1}`, observation: `Observation ${index + 1}`, status: "Requires Attention", severityIfDefect: index % 2 ? "Medium" : "High", actionRequired: "Correct and close out", dueDate: "2026-09-01" }));
      const result = normalizeInspectionReport({ inspectionItems }, { projectName: "Kanyama sanitation works" });
      expect(result.inspectionItems).toHaveLength(25);
      expect(result.inspectionItems.at(-1).itemNo).toBe("25");
    });

    it("normalizes mixed practical defect quantities", () => {
      const result = normalizeInspectionReport({ inspectionItems: [
        { area: "Stockpile", observation: "Sand shortage", status: "Non-Compliant", severityIfDefect: "High", unit: "m³", affectedQuantity: 1.26 },
        { area: "Roof", observation: "Missing sheets", status: "Requires Attention", severityIfDefect: "Medium", unit: "sheets", affectedQuantity: 4.6 },
        { area: "Rebar", observation: "Exposed reinforcement", status: "Non-Compliant", severityIfDefect: "Critical", unit: "tonne", affectedQuantity: 2.74 },
      ] });
      expect(result.inspectionItems.map(item => item.affectedQuantity)).toEqual([1.3, 5, 2.5]);
    });

    it("repairs invalid severity and status terms without hiding the inspection item", () => {
      const result = normalizeInspectionReport({ inspectionItems: [{ area: "Drain", observation: "Incomplete", status: "Urgent", severityIfDefect: "Severe", affectedQuantity: -5 }] });
      expect(result.inspectionItems[0]).toMatchObject({ status: "Requires Attention", severityIfDefect: "Low", affectedQuantity: null });
    });
  });
});

