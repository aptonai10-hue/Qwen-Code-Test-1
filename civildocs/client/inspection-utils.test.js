import { describe, expect, it } from "vitest";
import { normalizeInspectionReport } from "./inspection-utils.js";

describe("Site inspection normalization", () => {
  it("preserves inspection facts and rounds affected quantities to practical procurement increments", () => {
    const data = normalizeInspectionReport({ inspectionItems: [
      { itemNo: "1", area: "Drain", observation: "Voids in concrete lining", status: "Non-Compliant", severityIfDefect: "High", actionRequired: "Repair", dueDate: "2026-08-20", affectedQuantity: 1.26, unit: "m³" },
      { itemNo: "2", area: "Store", observation: "Damaged cement bags", status: "Requires Attention", severityIfDefect: "Medium", actionRequired: "Replace", dueDate: "2026-08-20", affectedQuantity: 4.6, unit: "bags" },
    ] }, { projectName: "Drainage works", location: "Kitwe", inspector: "Engineer", contractor: "Civils Ltd", inspectionDate: "2026-08-15", weather: "Clear" });
    expect(data).toMatchObject({ project: "Drainage works", location: "Kitwe", inspector: "Engineer" });
    expect(data.inspectionItems[0].affectedQuantity).toBe(1.3);
    expect(data.inspectionItems[1].affectedQuantity).toBe(5);
  });

  it("keeps no quantity blank when it is not relevant to an observation", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{ area: "Gate", observation: "Signage missing", status: "Compliant", severityIfDefect: "Low" }] });
    expect(data.inspectionItems[0].affectedQuantity).toBeNull();
  });

  it("removes an AI-invented quantity and unit when the submitted source note did not contain a measurement", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{
      area: "QA Store",
      observation: "Loose bolt.",
      status: "Requires Attention",
      severityIfDefect: "Low",
      affectedQuantity: 1,
      unit: "unit",
    }] }, { observations: "Loose bolt." });

    expect(data.inspectionItems[0]).toMatchObject({ affectedQuantity: null, unit: "" });
  });

  it("retains a measured quantity when the submitted source note explicitly provides it", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{
      area: "CH 0+960",
      observation: "Fuel spill staining affects 1.5 m².",
      affectedQuantity: 1.5,
      unit: "m²",
    }] }, { observations: "1. CH 0+960 fuel spill staining affects 1.5 m² beside the plant area." });

    expect(data.inspectionItems[0]).toMatchObject({ affectedQuantity: 1.5, unit: "m²" });
  });

  it("retains a submitted linear-metre quantity instead of treating it as absent", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{
      area: "CH 1+075",
      observation: "Exposed cable lies in water across 2 m.",
      affectedQuantity: 2,
      unit: "m",
    }] }, { observations: "1. CH 1+075 exposed electrical cable lies in water across 2 m; isolate immediately." });

    expect(data.inspectionItems[0]).toMatchObject({ affectedQuantity: 2, unit: "m" });
  });

  it("uses the submitted source unit rather than an AI-pluralised substitute", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{
      area: "CH 1+025",
      observation: "Loose handrail bolt.",
      affectedQuantity: 1,
      unit: "units",
    }] }, { observations: "1. CH 1+025 access-stair handrail has one loose bolt; tighten 1 unit." });

    expect(data.inspectionItems[0]).toMatchObject({ affectedQuantity: 1, unit: "unit" });
  });

  it("preserves an explicit continuous source quantity instead of applying BOQ procurement rounding", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{
      area: "CH 2+110",
      observation: "Bent reinforcement on wet ground.",
      affectedQuantity: 1,
      unit: "tonnes",
    }] }, { observations: "1. CH 2+110: The stock register records 0.8 tonnes of bent 16 mm reinforcement left directly on wet ground." });

    expect(data.inspectionItems[0]).toMatchObject({ affectedQuantity: 0.8, unit: "tonnes" });
  });

  it("preserves valid severity colors and falls back safely for invalid severity input", () => {
    const data = normalizeInspectionReport({ inspectionItems: [
      { area: "Earthworks", severityIfDefect: "Low", affectedQuantity: 2.04, unit: "m³" },
      { area: "Drainage", severityIfDefect: "Medium", affectedQuantity: 2.26, unit: "m³" },
      { area: "Concrete", severityIfDefect: "High", affectedQuantity: 6.4, unit: "bags" },
      { area: "Safety", severityIfDefect: "Critical", affectedQuantity: 0.62, unit: "tonne" },
      { area: "Finishes", severityIfDefect: "Severe", affectedQuantity: 3.14, unit: "m²" },
    ] });
    expect(data.inspectionItems.map(item => item.severityIfDefect)).toEqual(["Low", "Medium", "High", "Critical", "Low"]);
    expect(data.inspectionItems.map(item => item.affectedQuantity)).toEqual([2, 2.3, 6, 0.5, 3.1]);
  });

  it("assigns an unresolved inspection defect to the named contractor and preserves its corrective action", () => {
    const data = normalizeInspectionReport({ inspectionItems: [{
      area: "CH 0+450",
      observation: "Honeycombing on column",
      status: "Non-Compliant",
      severityIfDefect: "High",
      responsibleParty: "To be assigned",
      actionRequired: "Submit and execute an engineer-approved repair method.",
      dueDate: "2026-06-17",
      evidenceReference: "IMG-CH0450-01",
    }] }, { contractor: "CivilDocs Test Contractor" });

    expect(data.inspectionItems[0]).toMatchObject({
      responsibleParty: "Contractor",
      actionRequired: "Submit and execute an engineer-approved repair method.",
      dueDate: "2026-06-17",
      evidenceReference: "IMG-CH0450-01",
    });
  });
});

