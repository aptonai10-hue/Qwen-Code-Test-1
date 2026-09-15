# Zambian Construction Rate-Reference Research Report

**Workstream status:** Complete  
**Research date:** 2026-08-16  
**Implementation:** `client/rate-reference.js`

## Purpose and safeguards

CivilDocs now provides traceable planning references for common construction materials. These values are **not quotations**, tender-specific schedules of prices, or substitute professional estimates. Every rate carries source metadata, and code plus documentation flag the table for periodic manual review. Explicit user or supplier rates take precedence.

| Material reference | CivilDocs planning value | Source basis and caveat |
|---|---:|---|
| Cement 42.5, 50 kg bag | ZMW 177.00 | Lusaka average in ZPPA’s Q1 2026 Market Price Index.[1] |
| Reinforcement steel | ZMW 17,639.90/tonne | Derived from the stated Mungwi Steel UMZ 500 MPa Y20 12m bar price; confirm with a fresh supplier quotation.[2] |
| Diesel | ZMW 26.86/litre | ERB August 2026 pump-price reference; refresh when the monthly schedule changes.[3] |
| Building sand | ZMW 320.00/m³ | Transparent planning conversion from a Lusaka Quarry 20-tonne delivered-load listing; supplier publishes the load price, not an m³ price.[4] |
| Crushed aggregate | ZMW 412.50/m³ | Transparent planning conversion from the same 20-tonne load-basis listing.[4] |
| Common brick | ZMW 3.00/unit | ZPPA Q1 2026 Market Price Index reference.[1] |
| Polycarbonate roofing sheet | ZMW 270.27/m² | Converted only from the stated Radian Zambia 0.74m × 3m, ZMW 600 product. It is not a steel IBR proxy.[5] |
| Grade A timber | ZMW 14.656/metre | Derived from ZAFFICO’s stated ZMW 73.28 price for a 5m Grade A 25 × 75mm Lusaka retail board.[6] |

## Implementation result

The rate table now exposes both a review date (`2026-08-16`) and a manual-update note in source code. The BOQ and Escalation Clause prompts receive the references with an instruction not to invent conflicting rates. The Escalation flow preserves unmatched materials transparently, as demonstrated by a live geotextile example that showed a zero reference and “verify supplier quotation” rather than an invented price.

> Bulk-material m³ figures are disclosed estimating conversions. The documented inputs are 1.60 tonnes/m³ for building sand and 1.50 tonnes/m³ for quarry stone; they are not supplier-stated density or delivery guarantees.

## References

[1]: https://www.zppa.org.zm/documents/20182/320954/Revised+2026+Q1+MPI.pdf/0ca2fc81-49f6-4c36-b0d1-25c42dbadb29 "ZPPA Revised Market Price Index — First Quarter 2026"
[2]: https://www.instagram.com/p/DbAlGxVsRQo/ "Mungwi Steel & Hardware 12-metre deformed-bar price card"
[3]: https://www.erb.org.zm/ "Energy Regulation Board — Current Fuel Prices"
[4]: https://www.instagram.com/reel/DbtNPF5gQC2/ "Lusaka Quarry delivered-load listing"
[5]: https://www.radianonline.co.zm/hardware-construction/roofing-sheets.html "Radian Zambia polycarbonate roofing sheets"
[6]: https://online.zaffico.co.zm/products/timber-grade-a "ZAFFICO Grade A timber catalogue"

