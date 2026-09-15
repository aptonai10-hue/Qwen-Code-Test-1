import { describe, expect, it } from "vitest";
import { addDaysToIsoDate, contractPaymentTermDays, normalizePaymentDates } from "./payment-date-utils.js";

describe("Payment Due date normalization", () => {
  it("adds fourteen calendar days to the issue date", () => {
    expect(addDaysToIsoDate("2026-08-17", 14)).toBe("2026-08-31");
  });

  it("replaces a relative AI phrase with a calculated date from the current browser date", () => {
    const data = normalizePaymentDates(
      { dateIssued: "2024-10-25", paymentDueDate: "14 days from issue" },
      {},
      new Date("2026-08-18T12:00:00Z"),
    );
    expect(data).toMatchObject({ dateIssued: "2026-08-18", paymentDueDate: "2026-09-01" });
  });

  it("overrides both stale AI and non-form source dates with the injected current document date", () => {
    const data = normalizePaymentDates(
      { dateIssued: "2024-10-25", paymentDueDate: "2024-11-08" },
      { issueDate: "2025-01-01" },
      new Date("2026-08-18T12:00:00Z"),
    );
    expect(data).toMatchObject({ dateIssued: "2026-08-18", paymentDueDate: "2026-09-01" });
  });

  it("uses the explicit contract payment term rather than assuming fourteen days", () => {
    const data = normalizePaymentDates({}, { paymentTermDays: 28 }, new Date("2026-08-18T12:00:00Z"));
    expect(data).toMatchObject({ dateIssued: "2026-08-18", paymentTermDays: 28, paymentDueDate: "2026-09-15" });
    expect(contractPaymentTermDays("0")).toBe(14);
    expect(contractPaymentTermDays("366")).toBe(14);
  });
});

