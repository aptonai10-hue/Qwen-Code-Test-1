import { describe, expect, it } from "vitest";
import { practicalQuantityFor } from "./boq-utils.js";

describe("practicalQuantityFor", () => {
  it("uses whole minimum units for count-based materials", () => {
    expect(practicalQuantityFor({ unit: "bag", quantity: 0.01, description: "Cement" })).toBe(1);
    expect(practicalQuantityFor({ unit: "unit", quantity: 2.4, description: "Common bricks" })).toBe(2);
    expect(practicalQuantityFor({ unit: "bags", quantity: 4.6, description: "Damaged cement bags" })).toBe(5);
  });

  it("uses practical minimum increments for volume, steel, and liquids", () => {
    expect(practicalQuantityFor({ unit: "m³", quantity: 0.002 })).toBe(0.1);
    expect(practicalQuantityFor({ unit: "tonne", quantity: 0.1 })).toBe(0.5);
    expect(practicalQuantityFor({ unit: "litre", quantity: 0 })).toBe(1);
  });

  it("rounds measured linear work to a tenth of a metre", () => {
    expect(practicalQuantityFor({ unit: "m", quantity: 7.24, description: "Drain lining" })).toBe(7.2);
  });
});

