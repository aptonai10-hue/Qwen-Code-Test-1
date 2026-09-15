export class GeminiProxyError extends Error {
  constructor(status, code) {
    super(`Gemini request failed (${status})`);
    this.status = status;
    this.code = code;
  }
}

export function geminiErrorMessage(error) {
  if (error instanceof SyntaxError) return "Gemini returned an unexpected response. Please try again.";
  if (error?.code === "UPSTREAM_CAPACITY") return "AI is temporarily at capacity — please try again in a few minutes.";
  if (error?.code === "UPSTREAM_MODEL_NOT_FOUND") return "The AI model is temporarily unavailable. Please contact the CivilDocs administrator.";
  if (error?.code === "UPSTREAM_TIMEOUT") return "AI is taking longer than expected — please try again.";
  if (error?.code === "UPSTREAM_EMPTY_RESPONSE") return "AI returned no usable content. Please retry the same document.";
  if (error?.code === "INVALID_AI_RESPONSE") return "AI returned an incomplete document structure. Your draft is preserved; please retry.";
  if (error?.code === "PROMPT_TOO_LARGE") return "This request is too large for one generation. Shorten the scope description or reduce the number of line items, then retry.";
  if (error?.code === "RATE_LIMITED") return "You have made several AI requests recently. Please wait a minute before trying again.";
  return "Gemini generation failed. Please check your connection and try again.";
}

