import { describe, expect, it } from "vitest";
import { paymentCertificationCompletionInstruction } from "./payment-certification-utils.js";

describe("paymentCertificationCompletionInstruction", () => {
  it("requires the certifier to complete the document without making unsupported verification claims", () => {
    const instruction = paymentCertificationCompletionInstruction();

    expect(instruction).toContain("authorised certifier");
    expect(instruction).toContain("Authorised certification signature");
    expect(instruction).toContain("This draft does not confirm");
    expect(instruction).not.toMatch(/have been verified/i);
  });

  it("distinguishes contractor statement, certification and employer authorisation roles", () => {
    const instruction = paymentCertificationCompletionInstruction({ contractorStatementReference: "CPS-14", certifierName: "Eng. M. Phiri" });

    expect(instruction).toContain("CPS-14");
    expect(instruction).toContain("Eng. M. Phiri");
    expect(instruction).toContain("Employer payment authorisation");
  });
});

