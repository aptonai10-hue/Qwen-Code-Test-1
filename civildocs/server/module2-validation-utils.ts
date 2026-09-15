type UnknownRecord = Record<string, unknown>;

export type Module2Assessment = {
  ok: boolean;
  lineItemCount: number;
  flashcardReviewReady: boolean;
  pdfHandoffReady: boolean;
  detail: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textFromGeminiBody(body: unknown): string | undefined {
  if (!isRecord(body) || !Array.isArray(body.candidates)) return undefined;
  const candidate = body.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) return undefined;
  const part = candidate.content.parts[0];
  return isRecord(part) && typeof part.text === "string" ? part.text : undefined;
}

export function extractModule2Payload(body: unknown): unknown {
  const text = textFromGeminiBody(body);
  if (!text) return body;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned a non-JSON Interim Payment Certificate response.");
  }
}

export function assessModule2Payload(payload: unknown): Module2Assessment {
  if (!isRecord(payload) || !Array.isArray(payload.lineItems)) {
    return { ok: false, lineItemCount: 0, flashcardReviewReady: false, pdfHandoffReady: false, detail: "The response did not include a lineItems array." };
  }

  const lineItems = payload.lineItems;
  const meaningfulItems = lineItems.filter(item => isRecord(item) && typeof item.description === "string" && item.description.trim().length > 2 && Number.isFinite(Number(item.previousValue)) && Number.isFinite(Number(item.valueThisPeriod)));
  if (lineItems.length < 3 || meaningfulItems.length < 3) {
    return {
      ok: false,
      lineItemCount: lineItems.length,
      flashcardReviewReady: false,
      pdfHandoffReady: false,
      detail: "The response needs at least three distinct valuation lines with descriptions and numeric values.",
    };
  }

  return {
    ok: true,
    lineItemCount: lineItems.length,
    flashcardReviewReady: true,
    pdfHandoffReady: true,
    detail: "A valid multi-line Interim Payment Certificate response is ready for the client flashcard and PDF flow.",
  };
}

export function buildModule2ValidationPrompt(): string {
  return `Create a realistic Interim Payment Certificate for a Kitwe drainage rehabilitation contract. Return only JSON with this schema: {"project":"...","contractNo":"...","client":"...","contractor":"...","certificateNo":"...","period":"...","contractSum":number,"retentionPercent":number,"lineItems":[{"itemNo":"01","description":"...","previousValue":number,"valueThisPeriod":number,"cumulativeValue":number}]}. Use at least three distinct valuation lines covering mobilisation, measured drainage excavation and concrete works, and reinstatement/testing. Every monetary value must be a realistic non-negative Zambian Kwacha amount with two decimal precision.`;
}

