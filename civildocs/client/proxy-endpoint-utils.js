export function resolveGeminiProxyEndpoint(configuredEndpoint) {
  const candidate = typeof configuredEndpoint === "string" ? configuredEndpoint.trim() : "";
  if (!candidate || /YOUR-[A-Z0-9-]+/i.test(candidate)) return "/api/gemini";

  try {
    const baseOrigin = globalThis.location?.origin || "http://localhost";
    const parsed = new URL(candidate, baseOrigin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "/api/gemini";
    return candidate;
  } catch {
    return "/api/gemini";
  }
}

