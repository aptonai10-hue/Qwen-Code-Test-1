export function inspectionItemCountInstruction(observations) {
  const source = String(observations || "").trim();
  const numberedItems = source.match(/(?:^|[\s;])\d{1,2}[.)]\s/g) || [];
  const bulletItems = source.split(/\r?\n|;/).filter(item => /^\s*[-•*]\s+/.test(item));
  const requestedCount = Math.max(1, numberedItems.length || bulletItems.length);
  const itemNoun = requestedCount === 1 ? "inspection item" : "inspection items";
  return `Create exactly ${requestedCount} separate ${itemNoun}. Preserve every distinct submitted observation in the input as its own item, in the supplied order. Do not add, infer, invent, replace, or report any additional inspection observations, compliance findings, quantities, locations, defects, or safety issues that the user did not submit.`;
}

