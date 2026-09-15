import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const basePdfRender = app.slice(
  app.indexOf("function renderPdf(type,data,source)"),
  app.indexOf("const renderPdfBeforeInspectionActionRegister")
);
const inspectionPdfWrapper = app.slice(
  app.indexOf("renderPdf = function renderPdfWithInspectionActionRegister"),
  app.indexOf("buildPrompt = function(type,v)")
);

describe("inspection PDF footer lifecycle", () => {
  it("defers footer rendering for inspections until the complete document exists", () => {
    expect(basePdfRender).toContain('if(type!=="inspection")addFooters(pdf);return pdf;');
  });

  it("appends the corrective-action register before applying one final footer pass", () => {
    expect(inspectionPdfWrapper).toContain("pdf.addPage();");
    expect(inspectionPdfWrapper).toContain('pdf.text("Corrective Action Register", 15, 19);');
    expect(inspectionPdfWrapper).toContain("pdf.autoTable({");
    expect(inspectionPdfWrapper.match(/addFooters\(pdf\);/g)).toHaveLength(1);
    expect(inspectionPdfWrapper.indexOf("pdf.autoTable({")).toBeLessThan(inspectionPdfWrapper.indexOf("addFooters(pdf);"));
  });
});

