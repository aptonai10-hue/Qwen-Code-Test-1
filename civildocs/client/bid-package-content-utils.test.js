import { buildBidPackageContent, hasBidPackagePlaceholder, safeBidPackageText } from "./bid-package-content-utils.js";
import { describe, expect, it } from "vitest";

describe("bid package content", () => {
  const completeInput = {
    projectName: "Chimwemwe Emergency Drainage Works",
    employer: "Kitwe City Council",
    tenderer: "CivilDocs Test Contractor",
    submissionDate: "2026-08-31",
    procurementReference: "KCC/WORKS/2026/017",
    invitationForBidNo: "IFB/KCC/2026/017",
    bidValidity: "90 days",
    tenderPrice: "K 1,275,300.00",
    contractorRepresentative: "Project Director",
  };

  it("supplies a complete tender cover letter and a non-fictional drawings checklist", () => {
    const content = buildBidPackageContent(completeInput);

    expect(content.coverLetter).toContain("We submit the priced tender package");
    expect(content.drawingsChecklist).toContain("Use the employer-issued drawing register");
    expect(content.drawingsChecklist).toContain("does not allocate, invent or certify drawing numbers");
  });

  it("removes visible placeholders from deterministic bid-package sections", () => {
    const content = buildBidPackageContent({ ...completeInput, submissionDate: "[insert date]", contractorRepresentative: "TBD" });
    const renderedText = Object.values(content).join("\n");

    expect(hasBidPackagePlaceholder(renderedText)).toBe(false);
    expect(renderedText).not.toMatch(/\[\s*\]/);
    expect(safeBidPackageText("[insert date]", "the Bid Data Sheet submission date")).toBe("the Bid Data Sheet submission date");
  });
});

