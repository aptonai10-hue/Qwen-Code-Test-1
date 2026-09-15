export function money(value, currency = "ZMW") {
  const symbol = currency === "USD" ? "US$" : "K";
  return `${symbol} ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

