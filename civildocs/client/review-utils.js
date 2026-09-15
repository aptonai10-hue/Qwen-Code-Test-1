export function clearPaymentReviewWarning(root = document) {
  const warning = root.getElementById?.("payment-overrun-warning");
  if (!warning) return false;
  warning.remove();
  return true;
}

