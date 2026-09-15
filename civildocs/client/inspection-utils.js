import { practicalQuantityFor } from "./boq-utils.js";

const statuses = new Set(["Compliant", "Non-Compliant", "Requires Attention", "Not Applicable"]);
const severities = new Set(["Low", "Medium", "High", "Critical"]);
const responsibleParties = new Set(["Contractor", "Employer", "Engineer", "Subcontractor", "To be assigned"]);
const closeoutStatuses = new Set(["Open", "In Progress", "Closed", "Verified"]);

const SOURCE_QUANTITY_PATTERN = /\b(\d+(?:\.\d+)?)\s*(mm|cm|m2|m²|m3|m³|m|metres?|meters?|tonnes?|tons?|kg|bags?|litres?|liters?|units?|items?|locations?|joints?|workers?|pieces?|loads?)(?![a-zA-Z])/i;

function submittedObservationForIndex(observations, index) {
  const raw = String(observations || "").trim();
  if (!raw) return "";
  const entries = raw.split(/\r?\n/).map(entry => entry.trim()).filter(Boolean);
  return entries[index] || raw;
}

function sourceQuantityForIndex(observations, index) {
  const submittedObservation = submittedObservationForIndex(observations, index);
  const match = submittedObservation.match(SOURCE_QUANTITY_PATTERN);
  return match ? { quantity: Number(match[1]), unit: match[2] } : null;
}

function optionalQuantity(item, permitQuantity = true) {
  if (!permitQuantity) return null;
  const value = Number(item.affectedQuantity);
  if (!Number.isFinite(value) || value <= 0) return null;
  return practicalQuantityFor({ description: item.observation || item.area || "inspection item", unit: item.unit || "item", quantity: value });
}

export function normalizeInspectionReport(data, source = {}) {
  data.project = source.projectName || data.project;
  data.location = source.location || data.location;
  data.inspector = source.inspector || data.inspector;
  data.contractor = source.contractor || data.contractor;
  data.date = source.inspectionDate || data.date;
  data.weather = source.weather || data.weather;
  data.professionalWarnings = [];
  data.inspectionItems = (data.inspectionItems || []).map((item, index) => {
    const submittedObservation = submittedObservationForIndex(source.observations, index);
    const sourceQuantity = sourceQuantityForIndex(source.observations, index);
    const hasSubmittedObservation = Boolean(submittedObservation);
    return {
    ...item,
    itemNo: item.itemNo || String(index + 1).padStart(2, "0"),
    area: String(item.area || `Inspection area ${index + 1}`).trim(),
    observation: String(item.observation || "Observation to be confirmed").trim(),
    status: statuses.has(item.status) ? item.status : "Requires Attention",
    severityIfDefect: severities.has(item.severityIfDefect) ? item.severityIfDefect : "Low",
    actionRequired: String(item.actionRequired || "Confirm corrective action").trim(),
    dueDate: String(item.dueDate || "To be agreed").trim(),
    drawingSpecRef: String(item.drawingSpecRef || "Not supplied").trim(),
    evidenceReference: String(item.evidenceReference || "Not supplied").trim(),
    responsibleParty: responsibleParties.has(item.responsibleParty) && item.responsibleParty !== "To be assigned"
      ? item.responsibleParty
      : (source.contractor ? "Contractor" : "To be assigned"),
    targetCloseoutDate: String(item.targetCloseoutDate || item.dueDate || "To be agreed").trim(),
    closeoutStatus: closeoutStatuses.has(item.closeoutStatus) ? item.closeoutStatus : "Open",
    closeoutDate: String(item.closeoutDate || "Not closed").trim(),
    verificationBy: String(item.verificationBy || "Not verified").trim(),
    unit: hasSubmittedObservation ? (sourceQuantity?.unit || "") : (item.unit ? String(item.unit).trim() : ""),
    affectedQuantity: sourceQuantity ? sourceQuantity.quantity : optionalQuantity(item, !hasSubmittedObservation),
  };
  });
  data.inspectionItems.forEach(item => {
    if ((item.severityIfDefect === "Critical" || item.severityIfDefect === "High") && (item.dueDate === "To be agreed" || item.targetCloseoutDate === "To be agreed")) data.professionalWarnings.push(`High-priority item ${item.itemNo} has no target close-out date; assign a responsible party and due date before issue.`);
    if (item.closeoutStatus === "Verified" && item.verificationBy === "Not verified") data.professionalWarnings.push(`Item ${item.itemNo} is marked Verified but has no verifier; correct the status or provide the verifier.`);
  });
  return data;
}

