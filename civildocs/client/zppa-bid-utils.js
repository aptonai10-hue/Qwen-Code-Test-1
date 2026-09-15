export const ZPPA_TECHNICAL_PROPOSAL_HEADINGS = [
  "Personnel",
  "Equipment",
  "Site Organization",
  "Method Statement",
  "Mobilisation Schedule",
  "Construction Schedule",
  "Others",
];

export const ZPPA_BIDDER_PACKAGE_CONTENTS = [
  "Letter of Bid using the employer-issued Section IV form",
  "Priced Bill of Quantities or Schedule of Prices",
  "Technical Proposal",
  "Qualification evidence and Bid Data Sheet attachments",
  "Bid security or Bid-Securing Declaration when required",
  "Joint-venture, signatory-authority, and other mandatory documents when applicable",
];

export function tenderPriceAfterDiscount(subtotal, discountAmount) {
  const measuredWorks = Math.max(0, Number(subtotal) || 0);
  const discount = Math.max(0, Number(discountAmount) || 0);
  return Math.max(0, measuredWorks - discount);
}

export function appendUniqueBudgetShortfallNote(existingNotes, budget, currency = "ZMW") {
  const standardNote = `Note: the described scope of works exceeds the stated budget of ${currency} ${Number(budget).toLocaleString(undefined, { maximumFractionDigits: 2 })}. A realistic minimum-viable BOQ is shown above; consider increasing budget or reducing scope.`;
  if (String(existingNotes || "").toLowerCase().includes("described scope of works exceeds the stated budget")) return String(existingNotes);
  return existingNotes ? `${existingNotes}\n\n${standardNote}` : standardNote;
}

export function removeUnsupportedBudgetShortfallNote(existingNotes, budget) {
  if (Number(budget) > 0) return String(existingNotes || "");
  return String(existingNotes || "")
    .replace(/Note:\s*the described scope of works exceeds the stated budget[\s\S]*?consider increasing budget or reducing scope\.?/gi, "")
    .replace(/^\s+|\s+$/g, "");
}

export function budgetShortfallNotes(existingNotes, budget, tenderPrice, currency = "ZMW") {
  const notesWithoutModelBudgetWarning = removeUnsupportedBudgetShortfallNote(existingNotes, 0);
  if (Number(budget) > 0 && Number(tenderPrice) > Number(budget)) {
    return appendUniqueBudgetShortfallNote(notesWithoutModelBudgetWarning, budget, currency);
  }
  return notesWithoutModelBudgetWarning;
}

