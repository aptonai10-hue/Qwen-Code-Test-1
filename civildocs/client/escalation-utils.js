import { ZAMBIAN_MATERIAL_RATES } from "./rate-reference.js";
import { moneyNumber } from "./payment-utils.js";

const referenceRates = Object.values(ZAMBIAN_MATERIAL_RATES);

function parsePrice(value) {
  if (typeof value === "number") return moneyNumber(value);
  const parsed = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? moneyNumber(parsed) : 0;
}

function parseQuantity(value) {
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function nonNegativeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function negativeNumberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed <= 0 ? parsed : 0;
}

function calculateLineAdjustment({ quantity, baseUnitPrice, currentUnitPrice, thresholdPercent, capPercent, floorPercent }) {
  const baseRate = parsePrice(baseUnitPrice);
  const currentRate = parsePrice(currentUnitPrice);
  const qty = parseQuantity(quantity);
  const threshold = Math.max(0, Number(thresholdPercent || 0)) / 100;
  const cap = Math.max(0, Number(capPercent || 0)) / 100;
  const floor = Math.min(0, Number(floorPercent || 0)) / 100;
  const upperThresholdRate = baseRate * (1 + threshold);
  const lowerThresholdRate = baseRate * (1 - threshold);
  const cappedRate = cap > 0 ? Math.min(currentRate, baseRate * (1 + cap)) : currentRate;
  const flooredRate = floor < 0 ? Math.max(currentRate, baseRate * (1 + floor)) : currentRate;
  const capApplied = qty > 0 && cap > 0 && currentRate > baseRate * (1 + cap);
  const floorApplied = qty > 0 && floor < 0 && currentRate < baseRate * (1 + floor);
  let adjustment = 0;
  let adjustmentStatus = "Within threshold; Contractor bears cost";
  if (qty > 0 && currentRate > upperThresholdRate) {
    adjustment = qty * (cappedRate - upperThresholdRate);
    adjustmentStatus = capApplied ? "Triggered; cap applied; compensation due" : "Triggered; compensation due";
  } else if (qty > 0 && currentRate < lowerThresholdRate) {
    adjustment = qty * (flooredRate - lowerThresholdRate);
    adjustmentStatus = floorApplied ? "Triggered; floor applied; Employer credit due" : "Triggered; Employer credit due";
  }
  return {
    baseAmount: moneyNumber(qty * baseRate),
    currentAmount: moneyNumber(qty * currentRate),
    rawVarianceAmount: moneyNumber(qty * (currentRate - baseRate)),
    variancePercent: baseRate > 0 ? moneyNumber(((currentRate - baseRate) / baseRate) * 100) : 0,
    lineAdjustment: moneyNumber(adjustment),
    adjustmentStatus,
  };
}

export function parseRateOverrides(value) {
  const overrides = new Map();
  String(value || "").split(/[;\n]+/).forEach(entry => {
    const match = entry.trim().match(/^(.+?)(?:\s*(?::|=)\s*|\s+)(?:K\s*)?([0-9][0-9,]*(?:\.\d+)?)/i);
    if (!match) return;
    const material = match[1].trim().toLowerCase().replace(/\s+/g, " ");
    const price = parsePrice(match[2]);
    if (material && price > 0) overrides.set(material, price);
  });
  return overrides;
}

function overrideRateForMaterial(material, overrides) {
  const normalized = String(material || "").trim().toLowerCase().replace(/\s+/g, " ");
  for (const [overrideMaterial, price] of overrides) {
    if (normalized.includes(overrideMaterial) || overrideMaterial.includes(normalized)) return price;
  }
  return 0;
}

export function referenceRateForMaterial(material) {
  const normalized = String(material || "").toLowerCase();
  return referenceRates.find(rate => normalized.includes(rate.label.toLowerCase()) || rate.label.toLowerCase().includes(normalized));
}

export function normalizeEscalationClause(data, source = {}) {
  const currency = source.currency || data.currency || "ZMW";
  const overrides = parseRateOverrides(source.rateOverrides);
  const supplied = Array.isArray(source.materialsSchedule) && source.materialsSchedule.length
    ? source.materialsSchedule
    : (Array.isArray(data.materialsSchedule) && data.materialsSchedule.length
      ? data.materialsSchedule
      : (source.materials || []).map(material => ({ material })));
  data.project = source.projectName || data.project;
  data.contractValue = moneyNumber(source.contractValue || data.contractValue);
  data.currency = currency;
  data.duration = nonNegativeNumber(source.duration ?? data.duration ?? 0);
  data.baseDate = source.baseDate || data.baseDate;
  data.currentDate = source.currentDate || new Date().toISOString().slice(0, 10);
  data.indexSource = String(source.indexSource || data.indexSource || "").trim();
  data.adjustmentFormula = String(source.adjustmentFormula || data.adjustmentFormula || "Rate difference").trim();
  data.thresholdPercent = nonNegativeNumber(source.thresholdPercent ?? data.thresholdPercent ?? 0);
  data.capPercent = nonNegativeNumber(source.capPercent ?? data.capPercent ?? 0);
  data.floorPercent = negativeNumberOrZero(source.floorPercent ?? data.floorPercent ?? 0);
  data.noticePeriodDays = nonNegativeNumber(source.noticePeriodDays ?? data.noticePeriodDays ?? 0);
  data.riskAllocation = String(source.riskAllocation || data.riskAllocation || "Subject to the signed contract").trim();
  data.professionalWarnings = [];
  if (!data.baseDate) data.professionalWarnings.push("Contract base date is missing; escalation cannot be administered reliably until the date basis is confirmed.");
  if (!data.indexSource) data.professionalWarnings.push("Index / supplier source is not supplied; verify the agreed source before applying any adjustment.");
  if (data.capPercent > 0 && data.floorPercent > data.capPercent) data.professionalWarnings.push("Cap/floor inputs are inconsistent; floor must not exceed cap.");
  data.materialsSchedule = supplied.map(item => {
    const material = String(item.material || "Material").trim();
    const rate = referenceRateForMaterial(material);
    const userOverride = overrideRateForMaterial(material, overrides);
    const normalized = {
      material,
      unit: item.unit || rate?.unit || "unit",
      quantity: parseQuantity(item.quantity),
      baseUnitPrice: userOverride || parsePrice(item.baseUnitPrice) || rate?.priceZMW || 0,
      currentUnitPrice: parsePrice(item.currentUnitPrice) || userOverride || parsePrice(item.baseUnitPrice) || rate?.priceZMW || 0,
      adjustmentMechanism: item.adjustmentMechanism || data.adjustmentFormula,
      baseDate: item.baseDate || data.baseDate,
      currentDate: item.currentDate || data.currentDate,
      indexSource: item.indexSource || data.indexSource || "Verify agreed index / supplier source",
      source: item.source || (userOverride ? "User-provided rate override" : "CivilDocs reference estimate — verify supplier quotation"),
    };
    return {
      ...normalized,
      ...calculateLineAdjustment({
        ...normalized,
        thresholdPercent: data.thresholdPercent,
        capPercent: data.capPercent,
        floorPercent: data.floorPercent,
      }),
    };
  });
  data.totalBaseAmount = moneyNumber(data.materialsSchedule.reduce((sum, item) => sum + item.baseAmount, 0));
  data.totalCurrentAmount = moneyNumber(data.materialsSchedule.reduce((sum, item) => sum + item.currentAmount, 0));
  data.totalRawVariance = moneyNumber(data.materialsSchedule.reduce((sum, item) => sum + item.rawVarianceAmount, 0));
  data.totalPayableEscalation = moneyNumber(data.materialsSchedule.reduce((sum, item) => sum + item.lineAdjustment, 0));
  if (data.materialsSchedule.some(item => item.quantity <= 0)) data.professionalWarnings.push("One or more material lines have no positive quantity; enter the quantity before relying on an escalation calculation.");
  if (data.materialsSchedule.some(item => item.currentUnitPrice <= 0)) data.professionalWarnings.push("One or more material lines have no current unit price; verify the supplier invoice or agreed index before relying on an escalation calculation.");
  return data;
}

