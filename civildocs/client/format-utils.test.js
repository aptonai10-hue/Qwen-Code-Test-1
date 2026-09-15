import { describe, expect, it } from "vitest";
import { money } from "./format-utils.js";

describe("money", () => {
  it("always renders ZMW values to exactly two decimal places", () => {
    expect(money(15000)).toBe("K 15,000.00");
    expect(money(1.2)).toBe("K 1.20");
    expect(money(0)).toBe("K 0.00");
  });

  it("uses the USD label while preserving exact two-decimal formatting", () => {
    expect(money(1250, "USD")).toBe("US$ 1,250.00");
  });
});

