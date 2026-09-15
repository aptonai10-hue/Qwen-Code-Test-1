const MAX_ITEMS = 100;

function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function finiteNumber(value, { allowNegative = true } = {}) {
  if (value === null || value === undefined || value === "") return true;
  const number = Number(value);
  return Number.isFinite(number) && (allowNegative || number >= 0);
}

function validateArray(data, key, itemValidator, errors, { required = false } = {}) {
  if (data[key] === undefined || data[key] === null) {
    if (required) errors.push(`${key} is required`);
    return;
  }
  if (!Array.isArray(data[key])) {
    errors.push(`${key} must be an array`);
    return;
  }
  if (required && data[key].length === 0) errors.push(`${key} must contain at least one item`);
  if (data[key].length > MAX_ITEMS) errors.push(`${key} exceeds the safe ${MAX_ITEMS}-item limit`);
  data[key].forEach((item, index) => itemValidator(item, index, errors));
}

function validateBidItem(item, index, errors) {
  if (!isRecord(item)) return errors.push(`boqItems[${index}] must be an object`);
  if (!String(item.description || "").trim()) errors.push(`boqItems[${index}] has no description`);
  if (!finiteNumber(item.quantity, { allowNegative: false })) errors.push(`boqItems[${index}] has an invalid quantity`);
  if (!finiteNumber(item.rate, { allowNegative: false })) errors.push(`boqItems[${index}] has an invalid rate`);
}

function validatePaymentItem(item, index, errors) {
  if (!isRecord(item)) return errors.push(`lineItems[${index}] must be an object`);
  if (!finiteNumber(item.previousValue) || !finiteNumber(item.valueThisPeriod)) errors.push(`lineItems[${index}] has an invalid value`);
}

function validateVariationItem(item, index, errors) {
  if (!isRecord(item)) return errors.push(`claimItems[${index}] must be an object`);
  if (!finiteNumber(item.costImpact) || !finiteNumber(item.timeImpactDays, { allowNegative: false })) errors.push(`claimItems[${index}] has an invalid impact`);
}

function validateGradeProject(item, index, errors) {
  if (!isRecord(item)) return errors.push(`completedProjects[${index}] must be an object`);
  if (!finiteNumber(item.value, { allowNegative: false })) errors.push(`completedProjects[${index}] has an invalid value`);
}

function validateEscalationItem(item, index, errors) {
  if (!isRecord(item)) return errors.push(`materialsSchedule[${index}] must be an object`);
  if (!finiteNumber(item.quantity, { allowNegative: false }) || !finiteNumber(item.baseUnitPrice, { allowNegative: false }) || !finiteNumber(item.currentUnitPrice, { allowNegative: false })) errors.push(`materialsSchedule[${index}] has an invalid quantity or rate`);
}

function validateInspectionItem(item, index, errors) {
  if (!isRecord(item)) return errors.push(`inspectionItems[${index}] must be an object`);
  if (!finiteNumber(item.affectedQuantity, { allowNegative: false })) errors.push(`inspectionItems[${index}] has an invalid affected quantity`);
}

export function validateGeneratedResponse(type, data) {
  const errors = [];
  if (!isRecord(data)) return { ok: false, errors: ["AI response must be a JSON object"] };
  if (type === "bid") validateArray(data, "boqItems", validateBidItem, errors, { required: true });
  if (type === "payment") validateArray(data, "lineItems", validatePaymentItem, errors);
  if (type === "variation") validateArray(data, "claimItems", validateVariationItem, errors);
  if (type === "grade") validateArray(data, "completedProjects", validateGradeProject, errors);
  if (type === "escalation") validateArray(data, "materialsSchedule", validateEscalationItem, errors);
  if (type === "inspection") validateArray(data, "inspectionItems", validateInspectionItem, errors);
  return { ok: errors.length === 0, errors };
}

