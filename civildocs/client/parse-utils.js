export function parseGeminiJson(raw, accept = candidate => Boolean(candidate && typeof candidate === "object" && !Array.isArray(candidate))) {
  const cleaned = String(raw || "").replace(/```json|```/gi, "").trim();
  let primaryError;
  try {
    const parsed = JSON.parse(cleaned);
    if (accept(parsed)) return parsed;
  } catch (error) {
    primaryError = error;
  }

  for (let start = cleaned.indexOf("{"); start !== -1; start = cleaned.indexOf("{", start + 1)) {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let end = start; end < cleaned.length; end += 1) {
      const character = cleaned[end];
      if (inString) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') { inString = true; continue; }
      if (character === "{") depth += 1;
      if (character === "}") depth -= 1;
      if (depth === 0) {
        try {
          const candidate = JSON.parse(cleaned.slice(start, end + 1));
          if (accept(candidate)) return candidate;
        } catch {
          // Continue scanning for the next balanced candidate.
        }
        break;
      }
    }
  }

  throw primaryError || new SyntaxError("No acceptable JSON object found");
}

