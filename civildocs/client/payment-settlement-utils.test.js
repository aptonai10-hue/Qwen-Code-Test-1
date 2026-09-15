import { describe, expect, it } from "vitest";
import { paymentSettlementPresentation } from "./payment-settlement-utils.js";

describe("paymentSettlementPresentation", () => {
  it("presents a negative certificate balance as a clear recovery rather than a bare negative payment", () => {
    expect(paymentSettlementPresentation(-25000)).toEqual({
      isRecovery: true,
      displayAmount: 25000,
      reviewLabel: "Amount to recover / deduct",
      breakdownLabel: "Net amount to recover / deduct",
      pdfHeading: "AMOUNT TO RECOVER / DEDUCT",
    });
  });

  it("retains the normal payment label and signed amount for a positive certificate balance", () => {
    expect(paymentSettlementPresentation(50000)).toMatchObject({
      isRecovery: false,
      displayAmount: 50000,
      reviewLabel: "Net amount for certification",
      breakdownLabel: "Net amount proposed for certification",
      pdfHeading: "NET AMOUNT PROPOSED FOR CERTIFICATION",
    });
  });
});

