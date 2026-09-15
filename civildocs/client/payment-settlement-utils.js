export function paymentSettlementPresentation(netPaymentDue) {
  const net = Number(netPaymentDue || 0);
  const isRecovery = Number.isFinite(net) && net < 0;

  return {
    isRecovery,
    displayAmount: isRecovery ? Math.abs(net) : net,
    reviewLabel: isRecovery ? "Amount to recover / deduct" : "Net amount for certification",
    breakdownLabel: isRecovery ? "Net amount to recover / deduct" : "Net amount proposed for certification",
    pdfHeading: isRecovery ? "AMOUNT TO RECOVER / DEDUCT" : "NET AMOUNT PROPOSED FOR CERTIFICATION",
  };
}

