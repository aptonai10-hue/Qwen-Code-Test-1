/**
 * CivilDocs market-reference rates — reviewed 2026-08-16.
 *
 * MANUAL UPDATE REQUIRED: refresh this table at least monthly, immediately after
 * ERB changes its pump-price schedule, and before any tender submission. Supplier
 * quotations, employer schedules, and user-entered rates always take precedence.
 * Full source notes, units, dates, and conversion assumptions are in
 * research/zambian_rate_sources_2026.md.
 */
export const RATE_REFERENCE_REVIEWED_ON = "2026-08-16";
export const RATE_REFERENCE_MANUAL_UPDATE_NOTE =
  "Refresh at least monthly and obtain project-specific supplier quotations before tender submission.";

export const ZAMBIAN_MATERIAL_RATES = {
  cement: {
    label: "Cement 42.5",
    unit: "50 kg bag",
    priceZMW: 177,
    source: "ZPPA Market Price Index Q1 2026, Lusaka average",
    sourceDate: "2026-01"
  },
  reinforcementSteel: {
    label: "Reinforcement steel (UMZ 500 MPa)",
    unit: "tonne",
    priceZMW: 17639.9,
    source: "Mungwi Steel 12m Y20 UMZ bar price card (posted 2026-07-20); converted by nominal bar mass",
    sourceDate: "2026-07"
  },
  diesel: {
    label: "Diesel",
    unit: "litre",
    priceZMW: 26.86,
    source: "Energy Regulation Board August 2026 retail pump price",
    sourceDate: "2026-08"
  },
  sand: {
    label: "Building sand",
    unit: "m³",
    priceZMW: 320,
    source: "Lusaka Quarry 20-tonne local-delivery load; planning conversion at 1.60 tonnes/m³",
    sourceDate: "2026-08"
  },
  aggregate: {
    label: "Crushed aggregate / quarry stone",
    unit: "m³",
    priceZMW: 412.5,
    source: "Lusaka Quarry 20-tonne local-delivery load; planning conversion at 1.50 tonnes/m³",
    sourceDate: "2026-08"
  },
  commonBrick: {
    label: "Burnt clay common brick",
    unit: "unit",
    priceZMW: 3,
    source: "ZPPA Market Price Index Q1 2026, published provincial average",
    sourceDate: "2026-01"
  },
  roofingSheet: {
    label: "Polycarbonate roofing sheet (0.74m × 3m)",
    unit: "m²",
    priceZMW: 270.27027,
    source: "Radian Zambia 0.74m × 3m sheet catalogue price, converted to m²",
    sourceDate: "2026-08"
  },
  timber: {
    label: "Grade A sawn timber 25 × 75 mm",
    unit: "metre",
    priceZMW: 14.656,
    source: "ZAFFICO Lusaka retail 5m board price, converted to metre",
    sourceDate: "2026-08"
  }
};

export const ZAMBIAN_QUANTITY_RULES = "Whole-number quantities for all count-based materials and components, including cement bags, bricks, blocks, roofing sheets, tiles, pipes sold by length, doors, windows, fixtures, fittings, no./each items and lump sums; volume materials in m³ rounded to the nearest 0.1 m³; bulk mass in tonnes rounded to the nearest 0.5 tonne; kilograms rounded to the nearest whole kilogram; liquids in litres rounded to the nearest whole litre; linear metres rounded to the nearest 0.1 m; area measured in m² rounded to the nearest 0.1 m² unless the material is a count-based roofing sheet, tile, panel or similar component, which must be a whole number; labour plant or time measured in days or hours rounded to the nearest 0.5. Never output thousandths or other impractical fractional purchase quantities, regardless of project scale.";

export const PRACTICAL_QUANTITY_INCREMENT_GUIDE = [
  "Count-based units (bag, brick, block, sheet, tile, panel, piece, item, each, No., unit, door, window, fixture, fitting, load, lot, LS): 1",
  "Cubic metres (m³): 0.1",
  "Tonnes: 0.5",
  "Kilograms (kg): 1",
  "Litres (L): 1",
  "Linear metres (m): 0.1",
  "Square metres (m²): 0.1, except count-based sheets, tiles, or panels: 1",
  "Hours or days: 0.5",
  "Any unclassified unit: no more than one decimal place"
];

export function materialRateReferenceForPrompt() {
  return Object.values(ZAMBIAN_MATERIAL_RATES)
    .map(rate => `${rate.label}: K ${rate.priceZMW.toLocaleString("en-ZM", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per ${rate.unit}`)
    .join("; ");
}

export function practicalQuantityRulesForPrompt() {
  return PRACTICAL_QUANTITY_INCREMENT_GUIDE.join("; ");
}

