import { describe, expect, it } from "vitest";
import { GeminiProxyError, geminiErrorMessage } from "./gemini-error-utils.js";

describe("geminiErrorMessage", () => {
  it("explains temporary Gemini capacity or quota responses without exposing implementation details", () => {
    expect(geminiErrorMessage(new GeminiProxyError(429, "UPSTREAM_CAPACITY"))).toBe("AI is temporarily at capacity — please try again in a few minutes.");
  });

  it("explains local request throttling separately", () => {
    expect(geminiErrorMessage(new GeminiProxyError(429, "RATE_LIMITED"))).toContain("wait a minute");
  });

  it("distinguishes a configured-model 404 from temporary capacity", () => {
    expect(geminiErrorMessage(new GeminiProxyError(404, "UPSTREAM_MODEL_NOT_FOUND"))).toContain("model is temporarily unavailable");
  });

  it("explains a bounded upstream timeout without leaving the form in a permanent loading state", () => {
    expect(geminiErrorMessage(new GeminiProxyError(504, "UPSTREAM_TIMEOUT"))).toContain("taking longer than expected");
  });

  it("explains a successful-but-empty upstream reply as a retryable content issue", () => {
    expect(geminiErrorMessage(new GeminiProxyError(502, "UPSTREAM_EMPTY_RESPONSE"))).toContain("no usable content");
  });

  it("explains an incomplete AI document structure as a retryable content issue", () => {
    expect(geminiErrorMessage(new GeminiProxyError(502, "INVALID_AI_RESPONSE"))).toContain("incomplete document structure");
  });
});

