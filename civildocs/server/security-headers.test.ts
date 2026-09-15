import { describe, expect, it } from "vitest";
import { civilDocsSecurityHeaders, shouldExposeGeminiMetrics } from "./security-headers";

describe("CivilDocs public-response security policy", () => {
  it("sets clickjacking, content-type, feature, and script restrictions", () => {
    expect(civilDocsSecurityHeaders["X-Frame-Options"]).toBe("DENY");
    expect(civilDocsSecurityHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(civilDocsSecurityHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(civilDocsSecurityHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(civilDocsSecurityHeaders["Content-Security-Policy"]).toContain("https://cdnjs.cloudflare.com");
  });

  it("keeps operational Gemini metrics out of production responses", () => {
    expect(shouldExposeGeminiMetrics("production")).toBe(false);
    expect(shouldExposeGeminiMetrics("development")).toBe(true);
    expect(shouldExposeGeminiMetrics(undefined)).toBe(true);
  });
});

