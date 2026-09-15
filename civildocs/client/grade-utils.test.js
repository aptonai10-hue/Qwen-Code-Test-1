import { describe, expect, it } from "vitest";
import { normalizeGradePortfolio, totalPortfolioValue } from "./grade-utils.js";

describe("NCC grade portfolio normalization", () => {
  it("keeps submitted company facts and completed projects authoritative", () => {
    const data = normalizeGradePortfolio({ executiveSummary: "AI summary" }, {
      companyName: "CopperBuild Limited", currentGrade: "Grade 4", targetGrade: "Grade 3", yearsInOperation: 7,
      completedProjects: [{ projectName: "Clinic rehabilitation", client: "Kitwe Council", value: 450000.5, year: 2025 }],
      staff: "Registered engineer", equipment: "Excavator",
    });
    expect(data).toMatchObject({ companyName: "CopperBuild Limited", currentGrade: "Grade 4", targetGrade: "Grade 3", yearsInOperation: 7 });
    expect(data.completedProjects[0]).toMatchObject({ value: 450000.5, year: "2025" });
    expect(data.recommendedSupportingDocuments).toHaveLength(1);
    expect(data.recommendedSupportingDocuments[0]).toContain("Bidder action");
  });

  it("totals project values to two-decimal-safe currency precision", () => {
    expect(totalPortfolioValue([{ value: 125000.125 }, { value: 874999.875 }])).toBe(1_000_000);
  });

  it("warns at the Grade 1/2 two-project eligibility boundary", () => {
    const data = normalizeGradePortfolio({}, {
      targetGrade: "Grade 2",
      completedProjects: [{ projectName: "Recent road", client: "Council", value: 5_000_000, year: String(new Date().getFullYear()) }],
    });
    expect(data.eligibilityWarnings.length).toBeGreaterThanOrEqual(1);
    expect(data.eligibilityWarnings.some(warning => warning.includes("two completed projects within the past five years"))).toBe(true);
    expect(data.eligibilityWarnings.some(warning => warning.includes("Evidence warning"))).toBe(true);
  });

  it("uses the current compilation date and does not preserve negative project values", () => {
    const data = normalizeGradePortfolio({ dateCompiled: "2024-10-25" }, { yearsInOperation: -4, completedProjects: [{ projectName: "Test", value: -100, year: 2025 }] });
    expect(data.dateCompiled).toBe(new Date().toISOString().slice(0, 10));
    expect(data.yearsInOperation).toBe(0);
    expect(data.completedProjects[0].value).toBe(0);
  });

  it("reconciles mixed high-value project details to the exact headline total", () => {
    const projects = [
      { projectName: "Mufulira Township Roads Rehabilitation", client: "Mufulira Municipal Council", value: 125_000_000.55, year: 2025 },
      { projectName: "Kitwe Industrial Access Road Rehabilitation", client: "Kitwe City Council", value: 88_900_000.00, year: 2024 },
    ];
    const data = normalizeGradePortfolio({}, { targetGrade: "Grade 2", completedProjects: projects });
    expect(totalPortfolioValue(data.completedProjects)).toBe(213_900_000.55);
    expect(data.completedProjects.reduce((sum, project) => sum + project.value, 0)).toBe(213_900_000.55);
  });
});

