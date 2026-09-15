const PLACEHOLDER_PATTERN = /\[[^\]]*\]|\b(?:tbd|lorem|insert|to be confirmed|to be completed|bidder completion required)\b/i;

export function hasBidPackagePlaceholder(value) {
  return PLACEHOLDER_PATTERN.test(String(value ?? ""));
}

export function safeBidPackageText(value, fallback) {
  const normalized = String(value ?? "").trim();
  return normalized && !hasBidPackagePlaceholder(normalized) ? normalized : fallback;
}

export function buildBidPackageContent(input = {}) {
  const projectName = safeBidPackageText(input.projectName, "the stated works");
  const employer = safeBidPackageText(input.employer, "the procuring entity");
  const tenderer = safeBidPackageText(input.tenderer, "the tenderer");
  const submissionDate = safeBidPackageText(input.submissionDate, "the Bid Data Sheet submission date");
  const procurementReference = safeBidPackageText(input.procurementReference, "the supplied procurement reference");
  const invitationForBidNo = safeBidPackageText(input.invitationForBidNo, "the supplied invitation reference");
  const bidValidity = safeBidPackageText(input.bidValidity, "the Bid Data Sheet validity period");
  const tenderPrice = safeBidPackageText(input.tenderPrice, "the priced Bill of Quantities total");
  const contractorRepresentative = safeBidPackageText(input.contractorRepresentative, "the tenderer's nominated representative");

  return {
    packageContents: [
      "1. Tender cover letter and Letter of Bid using the employer-issued form.",
      "2. Priced Bill of Quantities / Schedule of Prices.",
      "3. Technical proposal, including method statement, programme, personnel, equipment and site organisation information.",
      "4. Qualification evidence and every Bid Data Sheet attachment required for this tender.",
      "5. Bid security or Bid-Securing Declaration where the Bid Data Sheet requires it.",
      "6. Signatory authority, joint-venture material where applicable, and other mandatory tender documents.",
    ].join("\n"),
    coverLetter: `We submit the priced tender package for ${projectName} to ${employer}. The offer is based on the attached priced Bill of Quantities and the tender documents issued by ${employer}.\n\nTenderer: ${tenderer}\nSubmission date: ${submissionDate}\nProcurement reference: ${procurementReference}\nInvitation for Bids reference: ${invitationForBidNo}\nTender price: ${tenderPrice}\nBid validity: ${bidValidity}\nContractor's representative if awarded: ${contractorRepresentative}\n\nThe authorised signatory for ${tenderer} must execute the employer-issued Letter of Bid and submit all required attachments with this package.`,
    drawingsChecklist: `Use the employer-issued drawing register as the controlling reference. Before submission, confirm that the tender package includes the applicable drawings and technical information for ${projectName}:\n\n1. General arrangement / site layout information.\n2. Drainage alignment, levels and cross-section information.\n3. Culvert location, detail and bedding information.\n4. Typical U-drain reinforcement, concrete and joint detail.\n5. Traffic-management, temporary-works and reinstatement requirements where applicable.\n\nThis preparation aid does not allocate, invent or certify drawing numbers; the bidder must rely on the issued tender documents and addenda.`,
    personnel: "Provide the tenderer's nominated personnel in the employer-required format, supported by CVs, registrations and availability evidence. Include only personnel actually proposed for this tender.",
    equipment: "Provide the tenderer's available equipment schedule in the employer-required format, supported by ownership, lease or hire evidence as applicable. Include only equipment that can be committed to these works.",
    siteOrganization: "Include the proposed project organisation chart, reporting lines and responsibilities required by the Bid Data Sheet and Employer's Requirements.",
    mobilisationSchedule: "Include a mobilisation schedule consistent with the issued tender programme, the stated mobilisation period and the tenderer's actual resources.",
    constructionSchedule: "Include a construction programme that reflects the tender method, resources, work sequence and the issued completion requirements.",
    otherInformation: "Attach only the additional technical information expressly requested by the Bid Data Sheet, Employer's Requirements and issued addenda.",
    qualificationChecklist: "1. Bidder Information Sheet.\n2. Joint-venture and signatory-authority material where applicable.\n3. Historical contract-performance declaration.\n4. Current commitments / works-in-progress information.\n5. Financial capacity, turnover and resources evidence.\n6. General and specific experience evidence.\n7. Proposed personnel forms and CVs.\n8. Equipment forms.\n9. Bid security or Bid-Securing Declaration where required.\n10. Other Bid Data Sheet-mandated attachments.",
  };
}

