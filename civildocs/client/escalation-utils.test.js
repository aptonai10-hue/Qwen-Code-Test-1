import { describe, expect, it } from "vitest";
import { normalizeEscalationClause, referenceRateForMaterial } from "./escalation-utils.js";

describe("Escalation clause rate normalization", () => {
  it("matches common materials to the shared Zambian reference rates", () => {
    expect(referenceRateForMaterial("Diesel fuel")).toMatchObject({ unit: "litre", priceZMW: 26.86 });
    expect(referenceRateForMaterial("Cement")).toMatchObject({ unit: "50 kg bag", priceZMW: 177 });
  });

  it("keeps all schedule prices numeric and ready for exact two-decimal display", () => {
    const data = normalizeEscalationClause({ materialsSchedule: [{ material: "Diesel", baseUnitPrice: "K 26.86" }, { material: "Building sand" }] }, { projectName: "Road works", contractValue: 500000, currency: "ZMW", duration: 6, baseDate: "2026-08-01" });
    expect(data).toMatchObject({ project: "Road works", contractValue: 500000, currency: "ZMW" });
    expect(data.materialsSchedule).toEqual(expect.arrayContaining([expect.objectContaining({ material: "Diesel", unit: "litre", baseUnitPrice: 26.86, adjustmentMechanism: expect.any(String), source: expect.any(String), baseDate: "2026-08-01", currentDate: expect.any(String), indexSource: expect.any(String) }), expect.objectContaining({ material: "Building sand", unit: "m³", baseUnitPrice: 320, adjustmentMechanism: expect.any(String), source: expect.any(String), baseDate: "2026-08-01" })]));
  });

  it("gives submitted semicolon-separated material overrides precedence over AI and reference rates", () => {
    const data = normalizeEscalationClause(
      { materialsSchedule: [{ material: "Diesel", baseUnitPrice: 26.86 }, { material: "Aggregate", baseUnitPrice: 390 }] },
      { rateOverrides: "Diesel: 29.75 per litre; Aggregate: 385.00 per m3" },
    );
    expect(data.materialsSchedule).toEqual(expect.arrayContaining([
      expect.objectContaining({ material: "Diesel", baseUnitPrice: 29.75, source: "User-provided rate override" }),
      expect.objectContaining({ material: "Aggregate", baseUnitPrice: 385, source: "User-provided rate override" }),
    ]));
  });

  it("accepts plain whitespace-separated overrides from the live form format", () => {
    const data = normalizeEscalationClause(
      { materialsSchedule: [{ material: "Diesel", baseUnitPrice: 26.86 }, { material: "Aggregate", baseUnitPrice: 390 }] },
      { rateOverrides: "Diesel K29.75; Aggregate K385.00" },
    );
    expect(data.materialsSchedule).toEqual(expect.arrayContaining([
      expect.objectContaining({ material: "Diesel", baseUnitPrice: 29.75, source: "User-provided rate override" }),
      expect.objectContaining({ material: "Aggregate", baseUnitPrice: 385, source: "User-provided rate override" }),
    ]));
  });

  it("retains unmatched materials without borrowing an unrelated reference rate", () => {
    const data = normalizeEscalationClause(
      {
        materialsSchedule: [
          { material: "Diesel" },
          { material: "Aggregate" },
          { material: "Imported geotextile" },
          { material: "Cement" },
        ],
      },
      { rateOverrides: "Diesel K29.75; Aggregate K385.00" },
    );
    expect(data.materialsSchedule).toHaveLength(4);
    expect(data.materialsSchedule).toEqual(expect.arrayContaining([
      expect.objectContaining({ material: "Imported geotextile", unit: "unit", baseUnitPrice: 0, source: "CivilDocs reference estimate — verify supplier quotation" }),
    ]));
  });

  it("reconciles a realistic four-material Zambian escalation schedule with a threshold", () => {
    const data = normalizeEscalationClause(
      { materialsSchedule: [
        { material: "Cement", unit: "50 kg bag", quantity: 850, baseUnitPrice: 185, currentUnitPrice: 215, source: "Supplier invoice — verify" },
        { material: "Reinforcement steel", unit: "tonne", quantity: 18, baseUnitPrice: 16800, currentUnitPrice: 18900, source: "Supplier invoice — verify" },
        { material: "Diesel", unit: "litre", quantity: 12500, baseUnitPrice: 28.5, currentUnitPrice: 29.75, source: "Supplier invoice — verify" },
        { material: "Aggregate", unit: "m³", quantity: 2400, baseUnitPrice: 325, currentUnitPrice: 385, source: "Supplier invoice — verify" },
      ] },
      { projectName: "Lusaka East Trunk Sewer Escalation Review", contractValue: 1595900, currency: "ZMW", baseDate: "2025-01-15", currentDate: "2026-08-18", thresholdPercent: 5, capPercent: 20, floorPercent: -10 },
    );
    expect(data.totalBaseAmount).toBe(1595900);
    expect(data.totalCurrentAmount).toBe(1818825);
    expect(data.totalRawVariance).toBe(222925);
    expect(data.totalPayableEscalation).toBe(145317.5);
    expect(data.materialsSchedule).toEqual(expect.arrayContaining([
      expect.objectContaining({ material: "Cement", quantity: 850, lineAdjustment: 17637.5 }),
      expect.objectContaining({ material: "Reinforcement steel", quantity: 18, lineAdjustment: 22680 }),
      expect.objectContaining({ material: "Diesel", quantity: 12500, lineAdjustment: 0, adjustmentStatus: "Within threshold; Contractor bears cost" }),
      expect.objectContaining({ material: "Aggregate", quantity: 2400, lineAdjustment: 105000 }),
    ]));
  });

  it("uses the current assessment date and sanitizes invalid numeric controls", () => {
    const data = normalizeEscalationClause({ currentDate: "2024-10-25", thresholdPercent: NaN }, { duration: -4, thresholdPercent: "not-a-number", capPercent: "bad", floorPercent: 8, noticePeriodDays: -2 });
    expect(data.currentDate).toBe(new Date().toISOString().slice(0, 10));
    expect(data.duration).toBe(0);
    expect(data.thresholdPercent).toBe(0);
    expect(data.capPercent).toBe(0);
    expect(data.floorPercent).toBe(0);
    expect(data.noticePeriodDays).toBe(0);
  });

  it("discloses when an upward cap or downward floor controls a payable adjustment", () => {
    const data = normalizeEscalationClause(
      { materialsSchedule: [
        { material: "Cap test", quantity: 10, baseUnitPrice: 100, currentUnitPrice: 150 },
        { material: "Floor test", quantity: 10, baseUnitPrice: 100, currentUnitPrice: 50 },
        { material: "Ordinary employer credit", quantity: 10, baseUnitPrice: 100, currentUnitPrice: 90 },
      ] },
      { thresholdPercent: 5, capPercent: 20, floorPercent: -10 },
    );
    expect(data.materialsSchedule).toEqual(expect.arrayContaining([
      expect.objectContaining({ material: "Cap test", lineAdjustment: 150, adjustmentStatus: "Triggered; cap applied; compensation due" }),
      expect.objectContaining({ material: "Floor test", lineAdjustment: -50, adjustmentStatus: "Triggered; floor applied; Employer credit due" }),
      expect.objectContaining({ material: "Ordinary employer credit", lineAdjustment: -50, adjustmentStatus: "Triggered; Employer credit due" }),
    ]));
  });
});

