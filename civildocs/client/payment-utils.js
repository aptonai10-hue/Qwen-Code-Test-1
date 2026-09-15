import { normalizePaymentDates } from "./payment-date-utils.js";

export function moneyNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

function nonNegativeMoney(value) {
  return Math.max(0, moneyNumber(value));
}

function allocationWeight(item, index) {
  const description = String(item.description || "").toLowerCase();
  let weight = 1;
  if (/earth|excavat|drain|road|pothole|shoulder|desilt|subgrade|backfill/.test(description)) weight = 3;
  else if (/concrete|structure|reinforc|steel|rebar|masonry/.test(description)) weight = 2.5;
  else if (/roof|finish|paint|door|window|testing|reinstat/.test(description)) weight = 1.5;
  return weight * Math.max(0.8, 1 - index * 0.05);
}

function scaleValues(items, field, target) {
  const total = items.reduce((sum, item) => sum + moneyNumber(item[field]), 0);
  if (target === 0) return items.map(item => ({ ...item, [field]: moneyNumber(item[field]) }));
  const populatedLineCount = items.filter(item => moneyNumber(item[field]) > 0).length;
  if (items.length > 1 && populatedLineCount <= 1) {
    const weights = items.map(allocationWeight);
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    let allocated = 0;
    return items.map((item, index) => {
      const amount = index === items.length - 1
        ? moneyNumber(target - allocated)
        : moneyNumber(target * weights[index] / weightTotal);
      allocated = moneyNumber(allocated + amount);
      return { ...item, [field]: amount };
    });
  }
  if (total === 0) {
    return items.map((item, index) => ({ ...item, [field]: index === 0 ? target : 0 }));
  }
  let allocated = 0;
  return items.map((item, index) => {
    const amount = index === items.length - 1 ? moneyNumber(target - allocated) : moneyNumber((moneyNumber(item[field]) / total) * target);
    allocated = moneyNumber(allocated + amount);
    return { ...item, [field]: amount };
  });
}

function valuationDescriptions(source = {}) {
  const parts = String(source.workDescription || "")
    .split(/[,;]+/)
    .map(part => part.trim().replace(/\.$/, ""))
    .filter(part => part.length > 3);
  const fallbacks = ["Preliminaries and mobilisation", "Measured works completed", "Finishing, testing and reinstatement"];
  return [...parts, ...fallbacks].filter((value, index, all) => all.indexOf(value) === index).slice(0, 6);
}

export function getPaymentCertificateDeductions(data = {}, source = {}) {
  const grossValueThisPeriod = moneyNumber(data.grossValueThisPeriod ?? source.valueThisPeriod);
  const retentionPercent = nonNegativeMoney(source.retentionPercent ?? data.retentionPercent);
  const previousRetentionHeld = nonNegativeMoney(source.previousRetentionHeld ?? data.previousRetentionHeld);
  const retentionCap = nonNegativeMoney(source.retentionCap ?? data.retentionCap);
  const calculatedRetention = moneyNumber(Math.max(0, grossValueThisPeriod) * retentionPercent / 100);
  const retentionAmount = retentionCap > 0
    ? moneyNumber(Math.min(calculatedRetention, Math.max(0, retentionCap - previousRetentionHeld)))
    : calculatedRetention;
  const advancePaymentRecovery = nonNegativeMoney(source.advancePaymentRecovery ?? data.advancePaymentRecovery);
  const statutoryDeductions = nonNegativeMoney(source.statutoryDeductions ?? data.statutoryDeductions);
  const otherDeductions = nonNegativeMoney(source.otherDeductions ?? data.otherDeductions);
  const totalDeductions = moneyNumber(retentionAmount + advancePaymentRecovery + statutoryDeductions + otherDeductions);
  return {
    retentionPercent,
    previousRetentionHeld,
    retentionCap,
    retentionAmount,
    advancePaymentRecovery,
    statutoryDeductions,
    otherDeductions,
    totalDeductions,
  };
}

export function getPaymentCertificateOverrun(data = {}, source = {}) {
  const originalContractSum = moneyNumber(source.contractSum ?? data.originalContractSum ?? data.contractSum);
  const approvedVariationValue = moneyNumber(source.approvedVariationValue ?? data.approvedVariationValue);
  const adjustedContractSum = moneyNumber(originalContractSum + approvedVariationValue);
  const contractSum = adjustedContractSum > 0 ? adjustedContractSum : originalContractSum;
  const cumulativeValue = moneyNumber(data.cumulativeValue);
  const excess = moneyNumber(cumulativeValue - contractSum);
  return { originalContractSum, approvedVariationValue, adjustedContractSum: contractSum, contractSum, cumulativeValue, excess, exceeds: contractSum > 0 && excess > 0 };
}

export function recalculatePaymentCertificate(data, source = {}, options = {}) {
  const lineItems = (data.lineItems || []).map((item, index) => {
    const previousValue = moneyNumber(item.previousValue);
    const valueThisPeriod = moneyNumber(item.valueThisPeriod);
    return {
      ...item,
      itemNo: item.itemNo || String(index + 1).padStart(2, "0"),
      description: String(item.description || `Work item ${index + 1}`).trim(),
      previousValue,
      valueThisPeriod,
      cumulativeValue: moneyNumber(previousValue + valueThisPeriod),
    };
  });
  const grossValueThisPeriod = moneyNumber(lineItems.reduce((sum, item) => sum + item.valueThisPeriod, 0));
  const previousCertified = moneyNumber(lineItems.reduce((sum, item) => sum + item.previousValue, 0));
  const deductions = getPaymentCertificateDeductions({ ...data, grossValueThisPeriod }, source);
  const originalContractSum = moneyNumber(source.contractSum ?? data.originalContractSum ?? data.contractSum);
  const approvedVariationValue = moneyNumber(source.approvedVariationValue ?? data.approvedVariationValue);
  data.contractSum = originalContractSum;
  data.originalContractSum = originalContractSum;
  data.approvedVariationValue = approvedVariationValue;
  data.adjustedContractSum = moneyNumber(originalContractSum + approvedVariationValue);
  data.lineItems = lineItems;
  data.previousCertified = previousCertified;
  data.grossValueThisPeriod = grossValueThisPeriod;
  data.cumulativeValue = moneyNumber(previousCertified + grossValueThisPeriod);
  Object.assign(data, deductions);
  data.netPaymentDue = moneyNumber(grossValueThisPeriod - deductions.totalDeductions);
  const overrun = getPaymentCertificateOverrun(data, source);
  data.contractSumOverrun = overrun.exceeds;
  data.contractSumOverrunAmount = overrun.excess;
  normalizePaymentDates(data, source, options.now);
  return data;
}

export function normalizePaymentCertificate(data, source = {}, options = {}) {
  const requestedCurrent = moneyNumber(source.valueThisPeriod);
  const requestedPrevious = moneyNumber(source.previousCertified);
  const rawItems = Array.isArray(data.lineItems) && data.lineItems.length >= 3
    ? data.lineItems
    : valuationDescriptions(source).slice(0, 3).map((description, index) => ({ itemNo: String(index + 1).padStart(2, "0"), description, previousValue: 0, valueThisPeriod: 0 }));
  let lineItems = rawItems.map((item, index) => ({
    ...item,
    itemNo: item.itemNo || String(index + 1).padStart(2, "0"),
    description: String(item.description || `Work item ${index + 1}`).trim(),
    previousValue: moneyNumber(item.previousValue),
    valueThisPeriod: moneyNumber(item.valueThisPeriod),
  }));
  lineItems = scaleValues(lineItems, "previousValue", requestedPrevious);
  lineItems = scaleValues(lineItems, "valueThisPeriod", requestedCurrent);
  data.project = source.projectName || data.project;
  data.contractNo = source.contractNumber || data.contractNo;
  data.client = source.client || data.client;
  data.contractor = source.contractor || data.contractor;
  data.certifierName = source.certifierName || data.certifierName;
  data.contractorStatementReference = source.contractorStatementReference || data.contractorStatementReference;
  data.supportingRecords = source.supportingRecords || data.supportingRecords;
  data.certificateNo = source.certificateNumber || data.certificateNo;
  data.period = source.period || data.period;
  data.contractSum = moneyNumber(source.contractSum ?? data.contractSum);
  data.workDescription = source.workDescription || data.workDescription;
  return recalculatePaymentCertificate({ ...data, lineItems }, source, options);
}

