const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value) {
  return typeof value === "string" && ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function isoDateFrom(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function localCalendarDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysToIsoDate(dateValue, days) {
  const base = isIsoDate(dateValue) ? new Date(`${dateValue}T00:00:00Z`) : new Date(dateValue);
  if (Number.isNaN(base.getTime())) return "";
  base.setUTCDate(base.getUTCDate() + Number(days || 0));
  return isoDateFrom(base);
}

export function contractPaymentTermDays(value, fallback = 14) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 365 ? Math.round(parsed) : fallback;
}

export function normalizePaymentDates(data, source = {}, now = new Date()) {
  // The form does not collect a user-entered issue date. The browser's local
  // calendar date is therefore the document source of truth, while the payment
  // period is an explicit contract term rather than an assumed universal rule.
  const issueDate = localCalendarDate(now);
  const paymentTermDays = contractPaymentTermDays(source.paymentTermDays ?? data.paymentTermDays);
  data.dateIssued = issueDate;
  data.paymentTermDays = paymentTermDays;
  data.paymentDueDate = addDaysToIsoDate(issueDate, paymentTermDays);
  return data;
}

