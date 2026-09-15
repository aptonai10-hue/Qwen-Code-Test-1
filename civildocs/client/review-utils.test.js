import { describe, expect, it, vi } from "vitest";
import { clearPaymentReviewWarning } from "./review-utils.js";

describe("review lifecycle safeguards", () => {
  it("removes a payment-only overrun warning before another module renders its summary", () => {
    const warning = { remove: vi.fn() };
    const root = { getElementById: vi.fn(() => warning) };
    expect(clearPaymentReviewWarning(root)).toBe(true);
    expect(warning.remove).toHaveBeenCalledOnce();
  });

  it("does not fail when no payment warning is present", () => {
    expect(clearPaymentReviewWarning({ getElementById: () => null })).toBe(false);
  });
});

