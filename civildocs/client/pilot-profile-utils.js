export const PILOT_PROFILE_STORAGE_KEY = "civildocs.pilot-profile.v1";

const PROFILE_FIELDS = ["companyName", "contactName", "phone", "email", "location"];

export function normalizePilotProfile(value = {}) {
  return PROFILE_FIELDS.reduce((profile, field) => {
    profile[field] = String(value[field] || "").trim();
    return profile;
  }, {});
}

export function readPilotProfile(storage) {
  try {
    return normalizePilotProfile(JSON.parse(storage.getItem(PILOT_PROFILE_STORAGE_KEY) || "{}"));
  } catch {
    return normalizePilotProfile();
  }
}

export function savePilotProfile(storage, profile) {
  const normalized = normalizePilotProfile(profile);
  storage.setItem(PILOT_PROFILE_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function profileDefaultsForModule(moduleId, profile) {
  const normalized = normalizePilotProfile(profile);
  const shared = {
    location: normalized.location,
  };

  if (moduleId === "grade") return { ...shared, companyName: normalized.companyName };
  if (moduleId === "inspection") return { ...shared, contractor: normalized.companyName, inspector: normalized.contactName };
  if (moduleId === "bid") return { ...shared, preparedBy: normalized.companyName, contractorRepresentative: normalized.contactName };
  if (moduleId === "payment" || moduleId === "variation") return { ...shared, contractor: normalized.companyName };
  return shared;
}

export function applyPilotProfileDefaults(moduleId, formValues, profile) {
  const defaults = profileDefaultsForModule(moduleId, profile);
  return Object.fromEntries(Object.entries(defaults).map(([field, value]) => [
    field,
    String(formValues[field] || "").trim() ? formValues[field] : value,
  ]));
}

