# CivilDocs Zambian Rate Reference Sources — 2026 Review

**Purpose.** This research record supports conservative default reference rates in `client/rate-reference.js`. It does not replace supplier quotations, tender-specific schedules of prices, or a quantity surveyor’s estimate. The code must identify each value’s source date and retain a manual update flag.

| Material | Verified source and access date | Published value | Use decision |
|---|---|---:|---|
| Diesel | Energy Regulation Board (ERB) homepage, accessed 2026-08-16; the official page identifies its August 2026 Petroleum Pump Prices notice | **ZMW 26.86/litre** | Use as the current national retail pump-price reference, dated 2026-08-01; refresh whenever ERB changes its monthly schedule. |
| Polycarbonate roofing sheet | Radian Zambia online catalogue, accessed 2026-08-16 | **ZMW 600.00** for a 0.74m × 3m polycarbonate sheet | Use only when the product specification matches. This equates to approximately ZMW 270.27/m² before wastage; it is not a substitute for a steel IBR roofing-sheet quotation. |
| Reinforcement steel | Mungwi Steel & Hardware (Lusaka) Instagram price card posted 2026-07-20; reviewed 2026-08-16 | UMZ 500 MPa 12m bars: Y10 **ZMW 132**, Y12 **ZMW 189**, Y16 **ZMW 335**, Y20 **ZMW 522**, Y25 **ZMW 837**, Y32 **ZMW 1,418** | Use the Y20 UMZ price as the traceable source for a conservative all-in reinforcement-steel tonne reference after converting by nominal bar mass. The post gives no expiry date; refresh with a supplier quotation before bid pricing. |
| Cement | Mungwi Steel & Hardware (Lusaka) Facebook post dated 2025-10-04; reviewed 2026-08-16 | Amaka Cement 42.5 **ZMW 157** per 50kg bag; Dangote Cement 42.5 **ZMW 172** per 50kg bag | Retain as a named-supplier historical retail observation, not a current quote. A fresh August 2026 supplier quote remains required before this rate can be treated as current. |
| Building sand, quarry stone, gravel | Lusaka Quarry Instagram listing dated “August 6”, accessed 2026-08-16 | Delivered locally: **ZMW 4,000 per 20-tonne building-sand load**, **ZMW 5,500 per 20-tonne quarry / stone load**, **ZMW 2,800 per 20-tonne gravel load** | The supplier says prices are for short distances in Lusaka and surrounding areas. Retain the exact load basis in the source record; do not silently present an unsupported per-m³ conversion. |
| Roofing / structural timber | ZAFFICO official e-commerce catalogue, accessed 2026-08-16 | Grade A 25 × 75mm, SKU `25 X 75 X 5A-LSK-Retail`: **ZMW 73.28** for the listed 5m Lusaka retail board | Use only for this stated 25 × 75mm, Grade A, 5m product. The catalogue identifies it as kiln-dried, ZAFFICO-plantation timber and ZABS-compliant; convert to a per-metre reference only with the product length retained in code documentation. |

## Sources

1. Zambia Public Procurement Authority, [Revised Market Price Index — First Quarter 2026](https://www.zppa.org.zm/documents/20182/320954/Revised+2026+Q1+MPI.pdf/0ca2fc81-49f6-4c36-b0d1-25c42dbadb29), published January 2026 and accessed 2026-08-16. Table 5 lists Building and Construction Products. Its Lusaka average is **ZMW 177** for Cement 42.5–50kg and **ZMW 171 per metre** for 0.5mm IBR/IT4 colour-coated roofing sheet. The index lists river sand by tonne but has no Lusaka quote in that row, so it is not used for a Lusaka sand default.
2. Energy Regulation Board, [Current Fuel Prices](https://www.erb.org.zm/), accessed 2026-08-16. The official homepage lists diesel at **ZMW 26.86/litre** and links to the August 2026 pump-price statement.
3. Radian Zambia, [3 Meter Polycarbonate Roofing Sheets (0.74 × 3)](https://www.radianonline.co.zm/hardware-construction/roofing-sheets.html), accessed 2026-08-16. The online catalogue lists a **ZMW 600.00** price and a 3m length.
4. Mungwi Steel & Hardware, [12-meter deformed-bar price card](https://www.instagram.com/p/DbAlGxVsRQo/), posted **2026-07-20** and accessed 2026-08-16. The card identifies the Lusaka supplier, lists UMZ 500 MPa 12m deformed-bar prices, and gives no end date. The exact card transcription is retained above; only the clearly readable values were recorded.
5. Mungwi Steel & Hardware, [cement retail offer](https://www.facebook.com/mungwisteelzambia/posts/%EF%B8%8F-build-strong-build-smart-%EF%B8%8Fyour-trusted-building-supplies-are-now-in-stock-at-m/813118794556282/), posted 2025-10-04 and accessed 2026-08-16. The post identifies Lusaka as its location and lists Amaka Cement 42.5 at **ZMW 157** and Dangote Cement 42.5 at **ZMW 172**.
6. Lusaka Quarry, [current local-delivery listing](https://www.instagram.com/reel/DbtNPF5gQC2/), accessed 2026-08-16. The listing states that short-distance delivery within Lusaka and surrounding areas is **ZMW 5,500 for 20 tonnes of quarry / stones**, **ZMW 4,000 for 20 tonnes of building sand**, and **ZMW 2,800 for 20 tonnes of gravel**; it warns that long-distance delivery costs more.
7. ZAFFICO, [Grade A timber catalogue](https://online.zaffico.co.zm/products/timber-grade-a), accessed 2026-08-16. The official catalogue lists the 25 × 75mm Grade A Lusaka retail SKU `25 X 75 X 5A-LSK-Retail` at **ZMW 73.28**. Its naming expresses a 5m length, while the page describes Grade A as kiln-dried and sourced from ZAFFICO plantations.

## Transparent conversions used for a planning-only m³ reference

The current Lusaka Quarry source is priced by **20-tonne delivered load**, not by cubic metre. Where a BOQ requires m³, CivilDocs will retain the original load-basis information and use only these explicitly disclosed planning conversions: building sand = `ZMW 4,000 ÷ 20 tonnes × 1.60 tonnes/m³ = ZMW 320.00/m³`; quarry / crushed stone = `ZMW 5,500 ÷ 20 tonnes × 1.50 tonnes/m³ = ZMW 412.50/m³`. These bulk-density factors are estimating conventions rather than supplier-stated conversion factors; user or QS rate overrides take precedence.

## Research quality note

The earlier ZPPA Market Price Index document reviewed in this task is titled **October 2021**, so it is not suitable as a current 2026 material-rate source. The current **Q1 2026** index cited above supersedes it for the identified official reference values.

