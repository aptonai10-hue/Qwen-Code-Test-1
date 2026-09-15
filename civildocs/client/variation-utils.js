import { moneyNumber } from "./payment-utils.js";
import { addDaysToIsoDate, isIsoDate } from "./payment-date-utils.js";

function distribute(items, field, total, categoryFilter = null) {
  const target = moneyNumber(total);
  if (!items.length) return items;
  if (target === 0) return items.map(item => ({ ...item, [field]: 0 }));

  // If a category filter is provided (e.g. for "Both" claims), only distribute to matching items.
  const eligibleItems = categoryFilter 
    ? items.filter(item => String(item.claimCategory).toLowerCase().includes(categoryFilter.toLowerCase()))
    : items;
  
  const effectiveItems = eligibleItems.length > 0 ? eligibleItems : items;
  const weightTotal = effectiveItems.reduce((sum, item) => sum + Math.max(0, moneyNumber(item[field])), 0);
  
  let allocated = 0;
  const result = items.map(item => ({ ...item, [field]: 0 }));
  
  effectiveItems.forEach((item, index) => {
    const originalIndex = items.indexOf(item);
    const value = index === effectiveItems.length - 1 
      ? moneyNumber(target - allocated) 
      : moneyNumber(weightTotal > 0 ? (moneyNumber(item[field]) / weightTotal * target) : (target / effectiveItems.length));
    allocated = moneyNumber(allocated + value);
    result[originalIndex][field] = value;
  });
  
  return result;
}

function defaultClaimItems(source) {
  const type = String(source.claimType || "Variation Order");
  const description = String(source.eventDescription || "Contract change event").trim();
  if (type === "Both") return [
    { itemNo: "01", claimCategory: "Variation Order", description, costImpact: 1, timeImpactDays: 0 },
    { itemNo: "02", claimCategory: "Extension of Time", description, costImpact: 0, timeImpactDays: 1 },
  ];
  return [{ itemNo: "01", claimCategory: type, description, costImpact: 1, timeImpactDays: 1 }];
}

function requestedActionFor(data) {
  const cost = moneyNumber(data.costImpact);
  const days = moneyNumber(data.timeImpactDays);
  const actions = [];
  if (cost > 0) actions.push(`assess the cost impact of ZMW ${cost.toFixed(2)}`);
  if (days > 0) actions.push(`assess the extension of time of ${days} day${days === 1 ? "" : "s"}`);
  if (!actions.length) actions.push("assess the submitted claim particulars");
  return `The Engineer is requested to ${actions.join(" and ")}, subject to the contract, records, and supporting evidence.`;
}

export function recalculateVariationClaim(data, source = {}) {
  const items = (data.claimItems || []).map((item, index) => ({
    ...item,
    itemNo: item.itemNo || String(index + 1).padStart(2, "0"),
    claimCategory: item.claimCategory || source.claimType || "Variation Order",
    description: String(item.description || source.eventDescription || `Claim item ${index + 1}`).trim(),
    costImpact: moneyNumber(item.costImpact),
    timeImpactDays: moneyNumber(item.timeImpactDays),
  }));
  const costImpact = moneyNumber(items.reduce((sum, item) => sum + item.costImpact, 0));
  const timeImpactDays = moneyNumber(items.reduce((sum, item) => sum + item.timeImpactDays, 0));
  data.claimItems = items;
  data.costImpact = costImpact;
  data.timeImpactDays = timeImpactDays;
  const originalDate = data.originalCompletionDate || source.originalCompletionDate || "";
  data.originalCompletionDate = isIsoDate(originalDate) ? originalDate : "";
  data.revisedCompletionDate = data.originalCompletionDate ? addDaysToIsoDate(data.originalCompletionDate, data.timeImpactDays) : "";
  const originalValue = moneyNumber(data.originalContractValue || source.originalValue);
  data.originalContractValue = originalValue.toFixed(2);
  data.revisedContractValue = (originalValue + costImpact).toFixed(2);
  data.requestedAction = requestedActionFor(data);
  return data;
}

export function normalizeVariationClaim(data, source = {}) {
  const requestedCost = moneyNumber(source.costImpact);
  const requestedDays = moneyNumber(source.timeImpactDays);
  const rawItems = Array.isArray(data.claimItems) && data.claimItems.length
    ? data.claimItems
    : defaultClaimItems(source);
  let claimItems = rawItems.map((item, index) => ({
    ...item,
    itemNo: item.itemNo || String(index + 1).padStart(2, "0"),
    claimCategory: item.claimCategory || source.claimType || "Variation Order",
    description: String(item.description || source.eventDescription || `Claim item ${index + 1}`).trim(),
    costImpact: moneyNumber(item.costImpact),
    timeImpactDays: moneyNumber(item.timeImpactDays),
  }));
  const isBoth = String(source.claimType || data.claimType) === "Both";
  claimItems = distribute(claimItems, "costImpact", requestedCost, isBoth ? "Variation" : null);
  claimItems = distribute(claimItems, "timeImpactDays", requestedDays, isBoth ? "Time" : null);
  data.project = source.projectName || data.project;
  data.contractNo = source.contractNumber || data.contractNo;
  data.client = source.client || data.client;
  data.contractor = source.contractor || data.contractor;
  data.claimType = source.claimType || data.claimType;
  data.noticeDate = source.noticeDate || data.noticeDate || "";
  data.instructionReference = String(source.instructionReference || data.instructionReference || "").trim();
  data.approvalStatus = source.approvalStatus || data.approvalStatus || "Unknown";
  data.affectedMilestone = String(source.affectedMilestone || data.affectedMilestone || "").trim();
  data.supportingRecords = String(source.supportingRecords || data.supportingRecords || "").trim();
  const originalValueNumber = moneyNumber(source.originalValue || data.originalContractValue);
  const reconciledCostImpact = moneyNumber(claimItems.reduce((sum, item) => sum + item.costImpact, 0));
  const variationPercent = originalValueNumber > 0 ? moneyNumber(reconciledCostImpact / originalValueNumber * 100) : 0;
  data.variationPercent = variationPercent;
  data.professionalWarnings = [];
  if (reconciledCostImpact !== 0 && !data.instructionReference) data.professionalWarnings.push("No instruction or notice reference supplied; verify the written contract event record.");
  if (reconciledCostImpact !== 0 && !["Approved", "Implemented"].includes(data.approvalStatus)) data.professionalWarnings.push(`Variation status is ${data.approvalStatus || "Unknown"}; do not treat the amount as approved contract value.`);
  if (variationPercent > 25) data.professionalWarnings.push(`Variation impact is ${variationPercent.toFixed(2)}% of the original contract value; verify all approval and procurement thresholds before issue.`);
  // Submission date is a document-generation timestamp, not an AI-authored field.
  // Prevent stale or hallucinated model dates from appearing in the final PDF.
  data.dateSubmitted = new Date().toISOString().slice(0, 10);
  data.originalContractValue = String(source.originalValue || data.originalContractValue || "0");
  data.originalCompletionDate = source.originalCompletionDate || data.originalCompletionDate;
  data.description = source.eventDescription || data.description;
  data.causeOfVariationOrDelay = source.reason || data.causeOfVariationOrDelay;
  data.claimItems = claimItems;
  return recalculateVariationClaim(data, source);
}

