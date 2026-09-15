import { describe, expect, it } from "vitest";
import { inspectionItemCountInstruction } from "./inspection-prompt-utils.js";

describe("Site Inspection prompt item instruction", () => {
  it("preserves all 15 numbered observations instead of capping the report at eight items", () => {
    const observations = Array.from({ length: 15 }, (_, index) => `${index + 1}. Observation ${index + 1}`).join(" ");
    expect(inspectionItemCountInstruction(observations)).toContain("Create exactly 15 separate inspection items");
    expect(inspectionItemCountInstruction(observations)).toContain("Do not add, infer, invent");
  });

  it("keeps a single unnumbered field note as one item and forbids invented additions", () => {
    const instruction = inspectionItemCountInstruction("Check the front slab for curing quality.");
    expect(instruction).toContain("Create exactly 1 separate inspection item");
    expect(instruction).toContain("Do not add, infer, invent");
  });

  it("uses submitted bullet observations as the requested item count", () => {
    const instruction = inspectionItemCountInstruction("- Check drain invert\n- Verify culvert headwall\n- Record safety signage");
    expect(instruction).toContain("Create exactly 3 separate inspection items");
  });
});

