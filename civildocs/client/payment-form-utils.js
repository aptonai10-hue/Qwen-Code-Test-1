function finiteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getPaymentFormValidationErrors(values = {}) {
  const errors = [];
  const contractSum = finiteNumber(values.contractSum);
  const paymentTermDays = finiteNumber(values.paymentTermDays);
  const retentionPercent = finiteNumber(values.retentionPercent);

  if (!(contractSum > 0)) errors.push("Original Contract Sum must be greater than zero.");
  if (!Number.isInteger(paymentTermDays) || paymentTermDays < 1 || paymentTermDays > 365) {
    errors.push("Contract Payment Term must be a whole number between 1 and 365 days.");
  }
  if (retentionPercent === null || retentionPercent < 0 || retentionPercent > 100) {
    errors.push("Current Retention Percentage must be between 0 and 100.");
  }

  const nonNegativeLabels = {
    previousCertified: "Previously Certified Value",
    previousRetentionHeld: "Retention Held Before This Certificate",
    retentionCap: "Retention Cap",
    advancePaymentRecovery: "Advance Payment Recovery",
    statutoryDeductions: "Statutory Deductions",
    otherDeductions: "Other Contract Deductions",
  };
  Object.entries(nonNegativeLabels).forEach(([field, label]) => {
    const value = finiteNumber(values[field]);
    if (value !== null && value < 0) errors.push(`${label} cannot be negative.`);
  });

  const held = finiteNumber(values.previousRetentionHeld);
  const cap = finiteNumber(values.retentionCap);
  if (held !== null && cap !== null && cap > 0 && held > cap) {
    errors.push("Retention Held Before This Certificate cannot exceed the stated Retention Cap.");
  }
  return errors;
}

