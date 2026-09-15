function roundToIncrement(value, increment) {
  return Math.round(Number(value || 0) / increment) * increment;
}

function normalizedDecimal(value) {
  return Number(Number(value).toFixed(1));
}

export function practicalQuantityFor(item) {
  const raw = Math.max(0, Number(item.quantity || 0));
  const unit = String(item.unit || "").toLowerCase().replaceAll(" ", "");
  const description = String(item.description || "").toLowerCase();
  const countBased = /\b(bags?|bricks?|blocks?|sheets?|tiles?|panels?|pieces?|items?|each|no\.?|numbers?|units?|doors?|windows?|fixtures?|fittings?|loads?|lots?|ls|lumpsums?|lengths?)\b/.test(`${item.unit || ""} ${description}`.toLowerCase()) || /roofing\s*(sheet|tile|panel)/i.test(description);

  if (countBased) return Math.max(1, Math.round(raw));
  if (unit.includes("m³") || unit.includes("m3") || unit.includes("cubicmet")) return Math.max(0.1, normalizedDecimal(roundToIncrement(raw, 0.1)));
  if (unit.includes("tonne") || unit === "t" || unit.includes("metricton")) return Math.max(0.5, normalizedDecimal(roundToIncrement(raw, 0.5)));
  if (unit.includes("kg") || unit.includes("kilogram")) return Math.max(1, Math.round(raw));
  if (unit.includes("litre") || unit.includes("liter") || unit === "l") return Math.max(1, Math.round(raw));
  if (unit === "m" || unit.includes("metre") || unit.includes("meter")) return Math.max(0.1, normalizedDecimal(roundToIncrement(raw, 0.1)));
  if (unit.includes("m²") || unit.includes("m2") || unit.includes("sqm")) return Math.max(0.1, normalizedDecimal(roundToIncrement(raw, 0.1)));
  if (unit.includes("hour") || unit.includes("hr") || unit.includes("day")) return Math.max(0.5, normalizedDecimal(roundToIncrement(raw, 0.5)));
  return Math.max(0.1, normalizedDecimal(roundToIncrement(raw, 0.1)));
}

