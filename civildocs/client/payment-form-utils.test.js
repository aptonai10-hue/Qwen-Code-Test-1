import { describe, expect, it } from "vitest";
import { getPaymentFormValidationErrors } from "./payment-form-utils.js";

describe("Module 2 form validation", () => {
  it("accepts contract-ready payment inputs", () => {
    expect(getPaymentFormValidationErrors({
      contractSum: 1_000_000,
      paymentTermDays: 28,
      retentionPercent: 10,
      previousCertified: 400_000,
      previousRetentionHeld: 20_000,
      retentionCap: 50_000,
      advancePaymentRecovery: 0,
      statutoryDeductions: 2_000,
      otherDeductions: 0,
    })).toEqual([]);
  });

  it("rejects invalid terms, percentages and deduction values before generation", () => {
    expect(getPaymentFormValidationErrors({
      contractSum: 0,
      paymentTermDays: 14.5,
      retentionPercent: 101,
      previousCertified: -1,
      previousRetentionHeld: 60_000,
      retentionCap: 50_000,
      advancePaymentRecovery: -5,
    })).toEqual(expect.arrayContaining([
      "Original Contract Sum must be greater than zero.",
      "Contract Payment Term must be a whole number between 1 and 365 days.",
      "Current Retention Percentage must be between 0 and 100.",
      "Previously Certified Value cannot be negative.",
      "Advance Payment Recovery cannot be negative.",
      "Retention Held Before This Certificate cannot exceed the stated Retention Cap.",
    ]));
  });
});

