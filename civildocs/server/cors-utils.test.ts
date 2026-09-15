import { describe, expect, it } from "vitest";
import { isAllowedOrigin, parseAllowedOrigins } from "./cors-utils";

describe("Cloudflare frontend CORS allowlist", () => {
  it("parses comma-separated origins and trims whitespace", () => {
    const origins = parseAllowedOrigins(" https://civildocs.pages.dev,https://www.civildocs.example ");
    expect(origins).toEqual(new Set(["https://civildocs.pages.dev", "https://www.civildocs.example"]));
  });

  it("allows only an exact configured origin", () => {
    const origins = parseAllowedOrigins("https://civildocs.pages.dev");
    expect(isAllowedOrigin("https://civildocs.pages.dev", origins)).toBe(true);
    expect(isAllowedOrigin("https://evil.example", origins)).toBe(false);
    expect(isAllowedOrigin(undefined, origins)).toBe(false);
  });
});

