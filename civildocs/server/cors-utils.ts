export function parseAllowedOrigins(value: string | undefined): Set<string> {
  return new Set((value || "").split(",").map(origin => origin.trim()).filter(Boolean));
}

export function isAllowedOrigin(origin: string | undefined, allowedOrigins: Set<string>): boolean {
  return Boolean(origin && allowedOrigins.has(origin));
}

