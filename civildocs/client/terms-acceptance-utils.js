export const CURRENT_PILOT_TERMS_VERSION = "1.1";
export const PILOT_TERMS_ACCEPTANCE_STORAGE_KEY = "civildocs.pilot-terms-acceptance.v1";

function normaliseAcceptance(value = {}) {
  const termsVersion = String(value.termsVersion || "").trim();
  const acceptedAt = String(value.acceptedAt || "").trim();
  const acceptedAtMs = Date.parse(acceptedAt);
  return {
    termsVersion,
    acceptedAt: Number.isFinite(acceptedAtMs) ? new Date(acceptedAtMs).toISOString() : "",
  };
}

export function readPilotTermsAcceptance(storage, termsVersion = CURRENT_PILOT_TERMS_VERSION) {
  try {
    const acceptance = normaliseAcceptance(JSON.parse(storage.getItem(PILOT_TERMS_ACCEPTANCE_STORAGE_KEY) || "{}"));
    return { ...acceptance, isCurrent: Boolean(acceptance.acceptedAt && acceptance.termsVersion === termsVersion) };
  } catch {
    return { termsVersion: "", acceptedAt: "", isCurrent: false };
  }
}

export function recordPilotTermsAcceptance(storage, now = new Date(), termsVersion = CURRENT_PILOT_TERMS_VERSION) {
  const acceptance = normaliseAcceptance({ termsVersion, acceptedAt: now.toISOString() });
  storage.setItem(PILOT_TERMS_ACCEPTANCE_STORAGE_KEY, JSON.stringify(acceptance));
  return { ...acceptance, isCurrent: true };
}

