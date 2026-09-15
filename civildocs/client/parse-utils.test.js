import { describe, expect, it } from "vitest";
import { parseGeminiJson } from "./parse-utils.js";

describe("Gemini JSON extraction", () => {
  it("accepts fenced JSON after surrounding prose", () => {
    expect(parseGeminiJson("Here is the draft:\n```json\n{\"ok\":true}\n```" )).toEqual({ ok: true });
  });

  it("skips an earlier object when the module validator rejects it", () => {
    const parsed = parseGeminiJson("Note {\"wrong\":true} then {\"boqItems\":[{\"description\":\"Excavation\",\"quantity\":1,\"rate\":10}]}" , candidate => Array.isArray(candidate?.boqItems));
    expect(parsed.boqItems).toHaveLength(1);
  });

  it("throws for non-JSON content", () => {
    expect(() => parseGeminiJson("No document was generated")).toThrow(SyntaxError);
  });
});

