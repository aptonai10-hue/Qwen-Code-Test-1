# CivilDocs Full Published-Domain Stress Run Log

**Run date:** 27 August 2026  
**Target:** `https://civildocs-zuztwkvm.manus.space`  
**Method:** Run the supplied stress-suite scenarios against the published application, preserve actual inputs and observed browser/PDF outputs, and record a failure only where observed.

## Entry verification

The run began in a clean browser state. The Pilot Terms checkbox was accepted, which enabled **Use for free**; selecting it opened the published six-module document register. No profile defaults or saved drafts were present, preventing earlier browser-local data from contaminating the new run.

## Evidence policy

Each completed row will record the submitted inputs, the observed output values, browser/PDF outcome, and final status. Calculations will not be marked passed unless the recorded output reconciles to the stated test expectation. AI-generation tests and user-interface resilience tests will be separated where they require different observable evidence.

## CD-05 / Test 5.1 — second live baseline attempt

The published CD-05 form was populated with the four-material baseline: contract value **K1,595,900.00**; 12-month duration; base date **2026-01-01**; assessment date **2026-08-20**; 5% trigger; 20% cap; -10% floor; cement **850 bag @ K185.00 / K215.00**; reinforcement steel **18 tonne @ K16,800.00 / K18,900.00**; diesel **12,500 litres @ K28.50 / K29.75**; and aggregate **2,400 m3 @ K325.00 / K385.00**.

The live request completed and the published application displayed **“Your document is ready”** with a PDF download control. The PDF download was requested. The numerical reconciliation and PDF output inspection remain pending until the downloaded file is inspected; completion-screen success alone is not treated as a test pass.

The downloaded PDF confirmed the required output. Its reconciliation states: total base schedule **K1,595,900.00**; total current schedule **K1,818,825.00**; raw rate movement **K222,925.00**; and net payable escalation **K145,317.50**. The PDF showed all four submitted material rows, with adjustments of **K17,637.50** for cement, **K22,680.00** for reinforcement steel, **K0.00** for diesel (within threshold), and **K105,000.00** for aggregate. Test **5.1 passed** on this second published-domain run.

The text extraction view initially reported three pages while the visible footer sequence ended at Page 2 of 2. Direct visual inspection of the exported PDF confirmed there are two actual rendered pages, with the second page ending correctly at its Page 2 of 2 footer. This is an extraction-metadata quirk, **not an exported blank-page defect**; no PDF pagination repair is required from this observation.

## CD-02 / Test 2.2 — over-certification boundary

The published CD-02 form was populated with contract sum **K500,000.00**, previous certified value **K480,000.00**, current-period gross valuation **K50,000.00**, retention **0%**, no variation, and no other deductions. Supporting test identifiers were IPC-STRESS-2.2 / certificate 2.2 / August 2026. This creates the required cumulative value of **K530,000.00**, which exceeds the contract sum by **K30,000.00**.

The live request was accepted and remained in the explicit generation-progress state at the latest observation. No warning or generated PDF has yet been observed; this row remains pending rather than being marked passed.

The three reviewable valuation lines were retained unchanged: **K150,000.00 / K15,000.00**, **K220,000.00 / K20,000.00**, and **K110,000.00 / K15,000.00** for previous/current values. The completed review showed the required on-screen warning that cumulative value **K530,000.00** exceeded contract sum **K500,000.00** by **K30,000.00**, with current deductions **K0.00** and net amount proposed for certification **K50,000.00**.

The exported PDF reproduced the same warning on page 2 and the same contract sum, cumulative value, excess, deductions, and net amount. Test **2.2 passed** in both the form-review and PDF-output stages. The same text-extraction page-count discrepancy was observed, but visual PDF inspection confirms the visible document remains the expected two pages.

## CD-02 / Test 2.3 — exact contract-sum boundary

The published CD-02 form was rerun with contract sum **K500,000.00**, previous certified value **K480,000.00**, current-period gross valuation **K20,000.00**, and retention/deductions of **K0.00**. The four reviewed items reconciled to the submitted totals: previous values **K150,000.00**, **K200,000.00**, **K80,000.00**, and **K50,000.00**; current values **K5,000.00**, **K10,000.00**, **K3,000.00**, and **K2,000.00**.

The completed review and exported PDF both show cumulative valuation **K500,000.00**, exactly equal to the contract sum, total current deductions **K0.00**, and net amount proposed for certification **K20,000.00**. Neither displayed the contract-sum-exceeded warning. This establishes the intentional rule: the warning triggers only when cumulative valuation is **greater than** the contract sum, not when it is equal. Test **2.3 passed**. The text extraction reported an extra page, but this is not a rendered PDF page based on direct visual inspection.

## CD-02 / Test 2.4 — negative current-period correction

The published form received contract sum **K500,000.00**, previous certified **K100,000.00**, current-period valuation **-K25,000.00**, and zero retention/deductions. The completed review and PDF correctly reconciled the values to cumulative valuation **K75,000.00** and net amount **-K25,000.00**. The generated correction lines were explicitly negative for the two recovery lines (**-K20,000.00** and **-K5,000.00**).

The original result failed the presentation requirement: both the review and the PDF labelled the outcome only as **“Net amount for certification”** / **“NET AMOUNT PROPOSED FOR CERTIFICATION”** beside **K-25,000.00**, without saying it was a recovery or deduction. This is a semantic-labelling defect, not an arithmetic defect. The repair adds conditional **“Amount to recover / deduct”** wording and shows the recovery amount as a positive magnitude. Its focused unit test, the full 49-file / 182-test suite, type check, and production build pass. A fresh published-domain 2.4 rerun remains required after deployment.

The repair was published in checkpoint `f033afd8` and rerun on the production domain using the identical saved 2.4 input set. The review now reports **“Amount to recover / deduct — K25,000.00.”** The regenerated PDF shows **“Net amount to recover / deduct — K25,000.00”** in its reconciliation and **“AMOUNT TO RECOVER / DEDUCT — K25,000.00”** in the certificate band. Test **2.4 now passes**: the arithmetic remains correct and the business meaning is explicit in both review and export.

## QA stress-session scope

To complete the customer-authorised full run without changing the pilot offered to engineers, the published test browser uses the exact query value **`civilDocsQa=full-stress`** plus the exact **sessionStorage** pair **`civildocs.qa-stress-session.v1=authorized-2026-08-27`**. When, and only when, both values are present, the page displays: **“QA stress session active in this browser only. Generations are not counted against the public pilot allowance.”** The normal public route retains the 30-generation device-local cap. Unit coverage rejects a missing session marker, a missing query, and a different query value.

The integration regression also confirms the normal usage record at **30 of 30** remains blocked when either guard is absent, while the exact query-plus-session pair is the only path that bypasses the block and suppresses QA-run usage recording. The QA notice is explicitly present in the published browser only when that pair is active. The combined regression suite now passes **51 test files / 187 tests**.

The final behavioural tests route the same decisions used by `app.js` through shared runtime helpers. They confirm that a normal 30-of-30 browser session is blocked, that an exact QA query and marker can proceed without incrementing the local pilot record, and that the notice is hidden for normal or incompletely marked sessions. The full test, type-check, and production-build gate now passes at **51 test files / 190 tests**.

## CD-05 / Test 5.2 — single material above threshold

The published QA session received one Cement line: quantity **100 bags**, base rate **K100.00**, current rate **K120.00**, 5% trigger, 20% cap, and -10% floor. The downloaded PDF shows base amount **K10,000.00**, current amount **K12,000.00**, raw variance **K2,000.00**, and payable adjustment **K1,500.00**, labelled **“Triggered; compensation due.”** This matches the intended first-5%-contractor-risk rule: K2,000.00 less K500.00 threshold exposure. Test **5.2 passed**.

## CD-05 / Test 5.3 — below-threshold attempt

The published QA session received one Cement line with quantity **100 bags**, base rate **K100.00**, current rate **K103.00**, and a 5% trigger. The expected adjustment is K0.00 with a within-threshold label. The live AI request did not produce a document within the protected request window. CivilDocs showed the structured recovery panel: **“The request took too long,”** confirmed the saved draft, explained that the AI service did not complete in time, and offered both a manual retry and one four-minute automatic retry. This is a live service-timeout observation, not a calculation pass; the draft and recovery path passed, but test **5.3 remains pending a completed generation**.

The manual retry used the preserved input values and completed successfully. The downloaded PDF shows base amount **K10,000.00**, current amount **K10,300.00**, variance **K300.00**, adjustment **K0.00**, and status **“Within threshold; Contractor bears cost.”** The explanatory text correctly identifies the 3% movement as below the 5% trigger. Test **5.3 now passes**; its first-attempt timeout remains recorded as an upstream-availability observation rather than a calculation defect.

## CD-05 / Test 5.4 — cap enforcement

The published QA session used one Cement line: quantity **100 bags**, base rate **K100.00**, current rate **K150.00** (+50%), 5% trigger, 20% cap, and -10% floor. The PDF records raw movement **K5,000.00**, a payable adjustment **K1,500.00**, and status **“Triggered; cap applied; compensation due.”** The figure reflects the capped 20% rate movement less the 5% contractor threshold (15% × K10,000.00). Test **5.4 passed**.

## CD-05 / Test 5.5 — floor enforcement

The published QA session used one Cement line: quantity **100 bags**, base rate **K100.00**, current rate **K85.00** (-15%), 5% trigger, 20% cap, and -10% floor. The PDF records raw movement **-K1,500.00**, a credit adjustment **-K500.00**, and status **“Triggered; floor applied; Employer credit due.”** The result applies the -10% floor and leaves the first 5% movement with the contractor, resulting in a 5% credit on the K10,000.00 base amount. Test **5.5 passed**.

## CD-05 / Test 5.6 — mixed material netting

The published QA session used three K10,000.00 base lines. Cement at +30% was capped and adjusted by **K1,500.00**; Steel at +4% remained within threshold at **K0.00**; and Diesel at -20% was floored and credited by **-K500.00**. The PDF reconciles total base schedule **K30,000.00**, total current schedule **K31,400.00**, raw movement **K1,400.00**, and net payable escalation **K1,000.00**. Each row is independently and correctly labelled. Test **5.6 passed**.

## CD-03 / Test 3.1 — combined variation and EOT claim

The published QA session submitted original contract value **K1,200,000.00**, variation cost impact **K85,000.00**, extension-of-time impact **35 days**, original completion date **2026-06-30**, notice date **2026-05-15**, and instruction **SI-004**. The production review generated two distinct, correctly classified items: one Variation at **K85,000.00 / 0 days** and one Extension of Time at **K0.00 / 35 days**. The confirmed PDF reconciles revised contract value **K1,285,000.00** and revised completion date **2026-08-04**, includes the SI-004 event basis and supporting-records reference, and warns that Proposed status is not approved value. Test **3.1 passed**.

## CD-03 / Test 3.1 — variation-only claim

The published QA session submitted a Variation Order with original contract value **K750,000.00**, cost impact **K12,500.00**, and time impact **0 days**. The review showed one Cost item at **K12,500.00 / 0 days**, revised contract value **K762,500.00**, and total time impact **0 days**. The PDF retained that zero-day value, retained the original completion date **2026-06-30** without changing it, and its Requested Action sought only assessment of **ZMW 12,500.00**—there is no phantom EOT request. Test **3.1 passed**.

## CD-03 / Test 3.2 — extension-of-time-only claim

The published QA session submitted an Extension of Time with original contract value **K750,000.00**, cost impact **K0.00**, time impact **42 days**, and original completion date **2026-06-30**. The review showed one Time Impact item at **K0.00 / 42 days**, total cost impact **K0.00**, and unchanged revised contract value **K750,000.00**. The PDF records revised completion date **2026-08-11** (42 days later) and a Requested Action limited to assessment of the **42-day extension of time**. No phantom cost request appears. Test **3.2 passed**.

## CD-03 / Test 3.5 — high day-count date calculation

The published QA session submitted an Extension of Time with original completion date **2026-06-30**, cost impact **K0.00**, and time impact **185 days**. The generated item, review, and PDF consistently retained **185 days** with no cost claim. The PDF calculated the revised completion date as **2027-01-01**, which is exactly 185 calendar days after 2026-06-30; the cross-year transition printed correctly without date overflow or wraparound. Test **3.5 passed**.

## CD-04 / Test 4.4 — two-project, cent-level reconciliation

The published QA session submitted two Available-evidence projects: **Kafue Drainage Works — K1,250,000.50** with certificate **CC-001** and evidence **EV-001**, plus **Chongwe Road Rehabilitation — K2,750,000.75** with certificate **CC-002** and evidence **EV-002**. The PDF preserved both rows, values, certificates, evidence references, clients, and years, and reconciled their sum as **K4,000,001.25** exactly. The document appropriately states that it is an application-support draft and does not represent an NCC upgrade decision. Test **4.4 passed**.

## CD-04 / Tests 4.2, 4.5 and 4.9 — eligibility shortfall, single project, and missing evidence

The published QA session submitted one **K100,000.00** project for a Grade 6 to Grade 3 application, with only **1** year in operation, basic staffing/equipment, no certificate/evidence references, and Evidence Status **Missing**. The completion view and PDF both surfaced the explicit missing-evidence warning: **“1 completed project is marked Partial or Missing. Attach completion certificates, client references, and project evidence before submission.”** The PDF preserved the one project and its Missing status rather than inventing evidence, and added capacity warnings that one site supervisor and one concrete mixer are insufficient for Grade 3 work. The output therefore handles the single-project boundary and material gaps without crashing or concealing them. Tests **4.2, 4.5, and 4.9 passed** for these observed conditions.

## CD-05 / Test 5.4 — above-threshold price decrease

The published QA session submitted Cement: **100 bags**, base rate **K100.00**, current rate **K92.00**, with 5% trigger, 20% cap, and -10% floor. The PDF shows base amount **K10,000.00**, current amount **K9,200.00**, raw movement **-K800.00**, adjustment **-K300.00**, and **“Triggered; Employer credit due.”** This correctly applies the 5% threshold before crediting the remaining 3% and does not mischaracterise a price decrease as a contractor compensation payment. Test **5.4 passed**.

## CD-06 / Tests 6.3 and 6.14 — fifteen-item retention and multi-page PDF

The published QA session submitted 15 numbered site observations, spanning CH 0+100 through CH 1+500. The review opened at **Item 1 of 15**, advanced through the sequence, and ended at **Item 15 of 15** before confirmation. The final confirmation preserved each numbered observation and corrective action. Direct visual inspection of the downloaded PDF confirms a correctly rendered **four-page** document: pages 1–2 contain all 15 inspection records and close-out detail, page 3 contains the signature sheet, and page 4 contains the corrective-action register with items **1–15**. Every visible footer runs consecutively from **Page 1 of 4** to **Page 4 of 4**. Tests **6.3 and 6.14 passed**; the text extractor's earlier five-page count was metadata noise, not an output pagination defect.

## CD-02 / Test 2.7 — 25% retention boundary

The published QA session submitted contract sum **K1,000,000.00**, previous certified value **K200,000.00**, current-period gross valuation **K100,000.00**, and retention percentage **25%**, with every other deduction **K0.00**. The review and PDF agree on cumulative valuation **K300,000.00**, current retention deduction **K25,000.00**, total current deductions **K25,000.00**, and net amount proposed for certification **K75,000.00**. The PDF explicitly labels the 25% rate, applies no undisclosed cap, and computes payment due as **2026-09-10 (14 days)** from the 2026-08-27 issue date. Test **2.7 passed**.

## CD-02 / Tests 2.6 and 2.8 — zero retention and first certificate

The published QA session submitted Certificate **1** with contract sum **K500,000.00**, previous certified value **K0.00**, current-period gross valuation **K75,000.00**, and retention **0%**. The four reviewed valuation rows each had prior value **K0.00** and reconciled to the K75,000.00 current total. The PDF shows cumulative valuation **K75,000.00**, current retention deduction **K0.00**, total deductions **K0.00**, and net amount proposed for certification **K75,000.00**, with payment due **2026-09-10 (14 days)**. The zero starting value caused no error, and no hidden deduction appears. Tests **2.6 and 2.8 passed**.

## CD-02 / Test 2.9 — high-value, cent-precision certificate

The published QA session submitted contract sum **K150,000,000.55**, previous certified value **K149,000,000.11**, current-period gross valuation **K1,000,000.22**, and retention **7.5%**. The review and PDF retain standard K currency formatting without scientific notation and reconcile cumulative valuation to **K150,000,000.33**. The rounded current retention is **K75,000.02** and the net amount proposed for certification is **K925,000.20**, precisely matching K1,000,000.22 less K75,000.02. Test **2.9 passed**.

## CD-01 / Test 1.2 — under-budget scope and repaired multi-page layout

The published QA session submitted the 1.2 km drainage scope with a **K1,500,000.00** stated budget. The reviewed BOQ retained **13** practical items and reconciled total measured works and tender price to **K2,830,868.45**, rather than shrinking the scope to the stated budget. The original four-page PDF displayed a visual page-two footer collision/omission at the end of the Tender Cover Letter; this was a real document-layout failure under the multi-page condition.

The repair paginates long text sections inside a footer-safe body area. After checkpoint `cf6330a4` deployed, the identical published-domain rerun retained the **K2,830,868.45** BOQ total and its explicit page-four compliance note: **“the described scope of works exceeds the stated budget of 1500000.”** Direct visual inspection confirms that page 2 now ends before the footer with **Generated by CivilDocs | Page 2 of 4**, page 3 starts **Tender Cover Letter (continued)** with the remaining tender particulars, and its **Page 3 of 4** footer is clear. Test **1.2 passed after repair**. The root cause was an unsplit long text section crossing the static footer-safe boundary; this aligns with known defect pattern 3 (line-item/document quality degrading at a boundary condition), not an arithmetic issue.

The page-separated extraction of the repaired PDF independently preserves the observable boundary: the final page-2 tenderer/submission lines precede **“Generated by CivilDocs | Page 2 of 4”**; the next page begins **“Tender Cover Letter (continued)”**; and page 3 ends with **“Generated by CivilDocs | Page 3 of 4.”** This textual separation corroborates the visual inspection and replaces the original broken footer placement.

## CD-01 / Test 1.1 calibration — mid-size drainage scope

The published rerun used the same 1.2 km drainage scope with a stated **K3,000,000.00** budget. The application generated **14** internally coherent BOQ items and a tender total of **K3,095,245.50**, with whole-number quantities for discrete LS entries and real-world continuous units such as m³, m², m and tonnes. The exported four-page PDF retained all tender/bid-package sections and correct section “To Collection” subtotals.

The PDF nevertheless adds its budget-shortfall compliance note because the generated total exceeds the stated budget by **K95,245.50**. This is an expected disclosure for the actual submitted values, so this calibration run is not counted as Test 1.1's matching-budget pass. A rerun with a budget that covers the generated scope remains required to verify the absence of the note.

## CD-01 / Test 1.3 — far-higher-budget inflation check

**Failed (verified production behavior).** The same 1.2 km drainage description was submitted with a **K50,000,000.00** indicative budget. The review generated **17** BOQ lines totalling **K15,879,285.50**. Several quantities expanded materially against the otherwise comparable mid-size drainage runs: soft excavation became **7,200 m³** versus **1,800–1,800.5 m³**, reinforced concrete became **1,800 m³** versus **480.3–720 m³**, and reinstatement became **6,000 m²** versus **2,400 m²**. The schedule is below the stated K50m ceiling but is not scope-stable; the inflated quantities track the non-binding budget more than the unchanged 1.2 km description. This fails the required “do not inflate arbitrarily” outcome and is a real semantic-quality defect, not an arithmetic issue. The bid-generation prompt/validation must be repaired and the scenario rerun before the row can pass.

**Repaired and passed.** Checkpoint `43af4c48` removed the optional budget amount from the active AI instruction, explicitly forbids using it to scale scope/quantities/rates, and determines the budget notice solely from calculated tender price after generation. A fresh published production request used the same scope and **K50,000,000.00** budget under the distinct reference **M1.3 Far Higher Budget Retest 2026-08-27**, preventing reuse of the pre-repair repeat-cache response. The review and exported four-page PDF retained **17** practical BOQ lines totalling **K2,963,246.50**: soft excavation **1,800 m³**, reinforced concrete **480 m³**, and reinstatement **2,400 m²**. Those quantities align with the earlier realistic 1.2 km runs, rather than the prior 7,200 m³ / 1,800 m³ / 6,000 m² inflation. The final PDF contains no budget-shortfall warning because the calculated tender total is below K50m. Test **1.3 passed after repair**. Root cause: a free-text budget amount in the AI prompt anchored model estimates despite the field being non-binding.

## CD-02 / Tests 2.1 and 2.12 — normal mid-project certificate and baseline line quality

The published QA session submitted contract sum **K5,000,000.00**, previous certified **K2,000,000.00**, current-period gross valuation **K750,000.00**, and retention **10%**, with all other deductions **K0.00**. The review and PDF split the valuation across four varied work items: K150,000.00 earthworks, K300,000.00 concrete/culvert slab, K200,000.00 precast wall units, and K100,000.00 backfilling. They reconcile to cumulative valuation **K2,750,000.00**, current retention **K75,000.00**, total deductions **K75,000.00**, and net amount proposed for certification **K675,000.00**. No over-certification warning appeared because cumulative value remained K2,250,000.00 below the K5m contract sum. The PDF consistently states payment due **2026-09-10 (14 days)**. Tests **2.1 and 2.12 passed**.

## CD-02 / Test 2.5 — sparse required-fields-only certificate (review evidence)

The published QA session filled the required fields only: project **M2.5 Sparse Certificate**, contract **IPC-25**, employer **QA Employer**, contractor **QA Contractor**, certificate **1**, application reference **APP-25**, period **August 2026**, contract sum **K1,000,000.00**, payment term **14 days**, work description **“Drainage works.”**, current valuation **K100,000.00**, and retention **10%**. Optional certifier, supporting-record, prior-certificate, variation, cap and deduction fields were blank. The application reached a normal three-line review without a crash or `undefined`/`NaN`; it calculated previous/cumulative values as K0.00/K100,000.00, retention as **K10,000.00**, and net amount as **K90,000.00**. PDF export confirmation is the next evidence step.

The exported two-page PDF confirms the same figures and provides explicit non-fabricating placeholders, rather than invented identities or records: certifier **“to be completed”** and supporting records **“to be verified.”** It preserves the supplied minimal work basis **“Drainage works.”**, prints a calculated due date **2026-09-10 (14 days)**, and contains no `undefined` or `NaN` artefact. Test **2.5 passed**.

## CD-02 / Test 2.6 — zero-retention boundary

The published QA session submitted contract sum **K1,000,000.00**, previous certified **K500,000.00**, current gross valuation **K250,000.00**, and retention **0%**, with every other deduction set to K0.00. The review and exported PDF both calculate current retention **K0.00**, total deductions **K0.00**, cumulative valuation **K750,000.00**, and net amount proposed for certification **K250,000.00**, exactly equal to gross current valuation. Test **2.6 passed**.

## CD-02 / Tests 2.10, 2.11 and 2.14 — near-boundary quality and calculated-date baseline (review evidence)

The published QA session submitted contract sum **K1,000,000.00**, previous certified **K900,000.00**, current-period gross valuation **K90,000.00**, retention **5%**, and payment term **14 days**. The application produced a varied four-item boundary review rather than equal-split filler: K15,000.00 final earthworks, K35,000.00 concrete lining, K20,000.00 culvert/headwalls, and K20,000.00 reinstatement. The review reconciles to cumulative **K990,000.00**, current retention **K4,500.00**, deductions **K4,500.00**, and net amount **K85,500.00**, with no over-certification warning. Final PDF and an identical-input repeat remain required to close these rows.

The exported PDF matches every reviewed value and gives calculated payment due **2026-09-10 (14 days)**, not a relative-date phrase. The identical published-browser rerun restored the same four line items, K990,000.00 cumulative valuation, K4,500.00 deductions, K85,500.00 net amount, and same date format. The application used its documented same-input repeat cache; this is a published-client repeat result, not a second independent upstream request. Tests **2.10, 2.11 and 2.14 passed**.

## CD-06 / Tests 6.4, 6.5, 6.11 and 6.12 — detailed 25-item retention, review, and unit handling (review evidence)

The published QA session submitted **25** numbered observations for the 1 km drainage work, including exact measurements in mm, m, m², m³, tonnes, counts, and a 1.5 m² fuel-spill area. The review opened at **Item 1 of 25** and, after accepting the first 24 entries, reached **Item 25 of 25** without a cap or truncation. The final entry retained the source observation and unit exactly: **“CH 0+960 fuel spill staining affects 1.5 m² beside the plant area.”**, affected quantity **1.5 m²**, status **Non-Compliant**, severity **Medium**, required cleanup action, and due date **2026-09-03**. Final export and multi-page layout verification remain required.

The completed review summary displayed all 25 confirmed items. It classified the submitted clear diversion signs, secure excavation ladder, and all-worker helmet compliance as **Compliant / Low**, and classified the missing pedestrian barrier, absent concrete-cube records, honeycombing, out-of-tolerance pipe joints, and expired temporary-works tag as **High** severity. It preserved the submitted quantities and units, including **12 m³**, **3 tonnes**, **45 m³**, **2.5 m²**, and **1.5 m²**. The generated and directly viewed PDF is physically **five pages**. It has the first 12 inspection-table entries on page 1, entries 13–25 and close-out records 1–7 on page 2, close-out records 8–25 plus remarks and signatures on page 3, corrective-register entries 1–23 on page 4, and corrective-register entries 24–25 on page 5. Each page visibly carries a non-overlapping footer: **Generated by CivilDocs | Page 1 of 5** through **Page 5 of 5**. This confirms successful multi-page retention and footer pagination for this 25-item case. Tests **6.5, 6.11 and 6.12 passed**; the separate 20-item row 6.4 remains to be run.

## CD-06 / Test 6.4 — independent 20-item retention threshold

The published QA session then submitted a distinct **20-item** inspection set for **QA Drainage Extension, Chainage 1+000 to 1+400**, under reference **M6.4 Twenty-Item Retention 2026-08-27**. The review opened at **Item 1 of 20** and, after accepting the first 19 entries, reached **Item 20 of 20** without truncation. The last retained item preserved both area and unit exactly: **“CH 1+390 completed reinstatement is uneven across 24 m².”**, with affected quantity **24 m²**, status **Non-Compliant**, severity **Medium**, corrective action **“Scarify, level, and re-compact reinstatement area to grade.”**, and due date **2026-09-04**.

The completed review summary preserved all 20 entries, including compliant rows with **Action: None · N/A** and mixed severity outcomes up to **High** for the missing warning tape, absent compaction record, insufficient concrete cover, and rain-exposed cement. The exported PDF is physically **four pages**. Direct visual inspection shows page 1 contains items 1–12, page 2 contains items 13–20 plus the close-out section ending with **“Item 20: Open; close-out date Not closed; verified by QA Inspector”**, page 3 contains narrative remarks and signatures, and page 4 contains the corrective-action register ending at item 20. Page-separated extraction confirms the rendered footer sequence **Generated by CivilDocs | Page 1 of 4** through **Page 4 of 4**. Test **6.4 passed**.

## CD-06 / Tests 6.2 and 6.6 — clean eight-item inspection

The published QA session submitted eight explicit compliant observations for **QA Clean Drainage Inspection, Chainage 2+000 to 2+250**, under reference **M6.2 and 6.6 Clean Eight-Item Inspection 2026-08-27**. The review opened at **Item 1 of 8** and reached **Item 8 of 8**. Each entered item was classified **Compliant / Low**, rather than being converted into an invented defect. The first item, concerning the barricaded and clear trench, retains **“None required. Maintain existing safety measures.”**; the eighth, concerning the clear drainage outlet and silt-control measures, retains the proportionate action **“Monitor silt traps regularly.”** No entry was classified Requires Attention, Non-Compliant, or Critical.

The exported PDF is physically **three pages**. Its inspection table contains all eight **Compliant** rows; close-out records list items 1–8 as **Verified**, with each close-out date **2026-08-27** and verifier **QA Inspector**; and the page footer sequence runs from **Page 1 of 3** through **Page 3 of 3**. Tests **6.2 and 6.6 passed**.

## CD-06 / Test 6.7 — all-critical safety inspection

The published QA session submitted six explicitly marked critical hazards for **QA Critical Safety Walkover, Chainage 3+000 to 3+200**, under reference **M6.7 Critical Safety Inspection 2026-08-27**. The flashcard review opened at **Item 1 of 6** and assigned the first unshored 4 m excavation **Non-Compliant / Critical**, an immediate shoring/barrier/ladder action, and a **2026-08-28** due date. After review, the completed summary retained every source observation and assigned **Non-Compliant / Critical** to all six hazards. The exposed electrical cables, suspended load, open manhole, and fuel leak all received same-day dates **2026-08-27**; the excavation and unstable formwork received **2026-08-28**. The output therefore did not reduce explicit critical inputs to High or invent less urgent labels.

The exported PDF retains all six **Critical** labels in both the main inspection table and corrective-action register. Direct visual inspection shows the critical status/severity cells in a pale red risk treatment with legible red urgency text, while corrective actions remain readable. The severity treatment and same-day/next-day urgency are clear, so Test **6.7 passed**.

**New PDF defect (verified).** The same exported artifact has a real page-total inconsistency: it is physically **three pages** and page 3 contains the corrective-action register, but its visible footers read **“Generated by CivilDocs | Page 1 of 2”**, **“Page 2 of 2”**, and then **“Page 3 of 3.”** This violates the sequential total-page numbering requirement despite the content being retained. It is a document-layout boundary defect (known pattern 3), not an AI classification or calculation failure. The footer-rendering path must be repaired, regression-tested, redeployed, and the scenario rerun before the cross-PDF pagination outcome can be considered complete.

**Repaired and rerun.** Checkpoint `669d75c0` defers the inspection footer pass until after the corrective-action register (and any auto-table overflow pages) has been appended. Its focused regression verifies that the base inspection renderer skips its premature footer pass and that the wrapper renders the register before exactly one final footer invocation. The full validation gate passed **54 test files / 196 tests**, type check, and production build.

The published post-deployment rerun used the same six critical hazards under the distinct project reference **M6.7 Critical Safety Footer Retest 2026-08-27**, avoiding same-input cache reuse. It again produced six Non-Compliant / Critical entries and a physical **three-page** PDF. Direct visual inspection and page-separated extraction now agree on one non-overlapping, final-total footer per page: **Generated by CivilDocs | Page 1 of 3**, **Page 2 of 3**, and **Page 3 of 3**. The repaired corrective-action register appears on page 3 and preserves all six actions, responsible party, same-day due dates, and evidence references. The newly verified pagination defect is therefore **closed after repair**.

## CD-06 / Tests 6.1, 6.10 and 6.13 — one-item sparse-input and missing-quantity check

The published QA session submitted the required CD-06 fields with the entire observation set as **“Loose bolt.”**—one minimal item and no quantity, unit, measurement, or count—under reference **M6.1 6.10 6.13 Single Sparse Inspection 2026-08-27**. The application did not crash and opened a one-card review at **Item 1 of 1**. It retained the source observation verbatim, classified it **Requires Attention / Low**, and proposed the concise action **“Inspect and tighten loose bolt.”** Test **6.1 therefore passes**, and the short description did not create a generic multi-item narrative.

**Failure (verified production behavior):** Although the source never provided a quantity, the review displayed **Affected quantity: 1 unit**. That is an invented measurement rather than a meaningful omission/flag, and fails Test **6.13**. It is a field-semantics defect (known pattern 5): the application must keep an unavailable quantity absent or clearly state that it was not supplied, rather than turn it into a factual “1 unit.” Test **6.10 is only partially supported by the no-crash/concise-text observation and remains open pending the repaired missing-quantity rerun. The normalisation fallback and PDF representation must be repaired, covered by regression tests, deployed, and rerun.

**Repaired and rerun.** Checkpoint `9672f1c7` adds a source-evidence guard: where a submitted observation has no explicit physical quantity and unit, an AI-supplied value is removed; real source measurements remain permitted, including Unicode **m²** and **m³**. The focused regression suite includes both the “Loose bolt.” no-quantity case and an explicit **1.5 m²** case. Full validation passed **54 test files / 198 tests**, type check, and production build.

The fresh published rerun used **“Loose bolt.”** under the distinct reference **M6.13 Missing Quantity Retest 2026-08-27**. The flashcard remained **Item 1 of 1**, retained the concise observation and a proportionate tighten/check action, and displayed **no Affected quantity field at all**. After confirmation, the exported physical two-page PDF printed the row’s **Qty.** cell as **“—”** and contains no **“1 unit”** text. Tests **6.10 and 6.13 passed after repair**; Test **6.1 remains passed** from the initial single-item flow.

## CD-06 / Tests 6.8 and 6.9 — four-item mixed-severity and due-date ordering check

The published QA session submitted four distinct, numbered observations under **M6.8 M6.9 Mixed Severity Due-Date Inspection 2026-08-27**: a compliant **12 m³** curing-record note, a low-severity **1 unit** loose handrail bolt, a high-severity **3 m²** honeycomb repair, and a critical exposed electrical cable stated to extend **2 m** in water. The review retained all four observations in order. It assigned: (1) **Compliant / Low**, 12 m³, due **2026-08-27**; (2) **Requires Attention / Low**, 1 unit, due **2026-08-30**; (3) **Non-Compliant / High**, 3 m², due **2026-08-29**; and (4) **Non-Compliant / Critical**, due **2026-08-27**. This provides live evidence that distinct severity terms are represented and that the Critical item is scheduled no later than the High and Low items. Test **6.8 passes** for the observed severity range, and Test **6.9 is partially supported** by the logical urgency ordering.

**New field-semantics defect (verified):** Although source item 4 expressly stated **“across 2 m,”** its review card omitted **Affected quantity** entirely. The new guard correctly blocks unsupported values, but its allowed-unit set recognises m²/m³ and not linear **m**. Therefore it suppresses a genuine submitted quantity. This fails the quantity-and-units aspect of Test **6.9** and must be repaired and rerun before that row can pass.

**First repair and rerun.** Checkpoint `c72e7788` adds explicit linear **m** recognition, with a focused regression. On the fresh published rerun under **M6.9 Linear Metre Quantity Retest 2026-08-27**, all four review cards retained the source quantity values: **12 m³**, **1 units**, **3 m²**, and the previously missing critical **2 m**. The final three-page PDF contains the severity labels, the 3 m² and 2 m source references, and a consistent **Page 1 of 3** through **Page 3 of 3** footer sequence. The Critical item is still due **2026-08-27**, earlier than the High (**2026-08-29**) and Low (**2026-08-30**) defects.

**Remaining source-unit mismatch (verified):** The low-severity source explicitly says **“tighten 1 unit,”** but the rerun review renders **“1 units.”** The numerical amount is correct but the unit is not faithfully preserved. That is a field-semantics discrepancy; source measurements must govern both value and unit. Test **6.9 remains open** until this unit fidelity repair is made and live-rerun. The linear-metre omission itself is repaired.

**Second repair and successful production rerun.** Checkpoint `1daa344f` treats an explicit source measurement as authoritative for both its number and unit, rather than trusting a variant AI label. The focused coverage now tests absent quantity, m², m³, linear m, and preservation of **1 unit** against an AI-returned **units** value; full validation passed **54 test files / 200 tests**, type check, and production build.

The distinct published rerun **M6.9 Source Unit Fidelity Retest 2026-08-27** returned four cards with exactly the submitted quantities and units: **12 m³**, **1 unit**, **3 m²**, and **2 m**. The critical electrical item remains **Non-Compliant / Critical** and due **2026-08-27**; the High honeycomb item is due **2026-08-30** and the Low handrail item **2026-08-29**. The completed three-page PDF includes all four source measurements, contains the action wording **“Tighten 1 unit loose bolt,”** contains no **“1 units”** text, and has final-total footers **Page 1 of 3**, **Page 2 of 3**, and **Page 3 of 3**. Test **6.9 passed after repair**.

## CD-06 / Test 6.16 — rapid double activation

On the published QA route, the form was populated with the one-item **“Loose cover on inspection chamber.”** scenario under **M6.16 Rapid Double Activation 2026-08-27**. The Generate control was programmatically activated twice in the same browser task, mimicking a rapid duplicate activation. Immediately after the two activations, the control was disabled and labelled **“Generating document…”**. A temporary browser-side counter wrapped the real production `fetch` call without modifying its request or response and recorded **exactly one** AI-proxy request after completion. The application then opened a single **Item 1 of 1** review card with **Requires Attention / Low** and the action **“Secure and properly seat the inspection chamber cover.”** There was no second review flow, duplicate document, or duplicate request. Test **6.16 passed**.

## CD-06 / Tests 6.11 and 6.12 — detailed source descriptions and mixed units

The published QA session submitted four long, numbered descriptions under **M6.11 M6.12 Detailed Mixed Unit Inspection 2026-08-27**. The source covered: **18 m³** reinforced-concrete cube-test records (29 MPa against 30 MPa specification); **3.5 m²** of retaining-wall honeycombing and exposed reinforcement; **0.8 tonnes** of bent 16 mm reinforcement on wet ground; and **7 units** of missing pedestrian barrier beside a trench. All four review cards retained the detailed source narrative, named the appropriate chainage, and preserved the specified corrective-action details rather than replacing them with generic boilerplate. The values observed were: **18 m³**, **3.5 m²**, **1 tonnes**, and **7 units**. This supports detailed-content retention and three of four mixed-unit cases.

**New quantity-fidelity defect (verified):** The explicit continuous source quantity **0.8 tonnes** was displayed as **1 tonnes**. Although the unit remained present, the quantity was rounded upward by the practical-quantity helper. That makes the output less faithful to the source and fails the “specific figures” condition of Test **6.11** and the accurate mixed-unit condition of Test **6.12**. This is field semantics (known pattern 5). The application must preserve explicit input quantities exactly (subject only to harmless display precision), rather than applying a BOQ procurement increment to a site-observation measurement. Tests **6.11 and 6.12 remain open** pending repair and live rerun.

**Repaired and rerun.** Checkpoint `db189af9` separates explicit source measurements from BOQ procurement increments, so a user-supplied inspection measurement is now retained exactly. The full validation gate passed **54 test files / 201 tests**, type check, and production build. The fresh published rerun used **M6.11 M6.12 Detailed Exact Quantity Retest 2026-08-27** with the same four detailed entries. The resulting review showed **18 m³**, **3.5 m²**, **0.8 tonnes**, and **7 units** exactly, and preserved the source-specific actions: retain cube records/obtain Engineer disposition; prepare repair method and prevent concealment; segregate and store reinforcement on dunnage; and install barriers before restart. The exported three-page PDF contains all four measurement strings and consecutive final-total footers **Page 1 of 3** through **Page 3 of 3**. Tests **6.11 and 6.12 passed after repair**.

## CD-02 / Test 2.13 — certificate sequencing and carry-forward

The published QA route generated **Certificate 1** for **M2.13 Sequencing Drainage Works 2026-08-27** / contract **IPC-M2-13**, with original sum **K500,000.00**, previous certified **K0.00**, current-period gross valuation **K100,000.00**, and 0% retention/deductions. Its four retained review lines were K15,000.00, K35,000.00, K20,000.00, and K30,000.00; the completed review reconciled **Current-period K100,000.00**, **Cumulative K100,000.00**, and **Net K100,000.00**.

Returning to the form after that completed review preserved Certificate 1’s entered **Previously Certified Value = 0**; the tool did **not** silently carry its K100,000.00 result into a new certificate. The persistent labelled input **“Previously Certified Value (ZMW)”** therefore remains the explicit manual carry-forward control. Certificate 2 was then entered with **Previous K100,000.00** and **Current K75,000.00** under the same project/contract. Its three review lines reconcile to K70,000.00, K60,000.00, and K45,000.00 cumulative, and the completed summary reports **Current-period gross K75,000.00**, **Total deductions K0.00**, **Cumulative K175,000.00**, and **Net amount K75,000.00**. The published application correctly supports the documented manual procedure, rather than implying an automatic project ledger. Test **2.13 passed**.

## CD-02 / Test 2.18 — required work-description validation

On the published CD-02 form, the fully completed Certificate 2 values were left intact but **Current-Period Works / Valuation Basis** was cleared to an empty string before Generate was pressed. The control stayed enabled, no request was started, the form remained visible with all other entered values preserved (including Certificate 2, K75,000 current and K100,000 previous), and the visible inline message was **“Complete every required field before generating the document.”** This is a clear blocked-submission outcome, with no unstated fallback value. Test **2.18 passed**.

## CD-02 / Test 2.16 — rapid double activation

On the published QA route, a valid Certificate 16 scenario was submitted for **M2.16 Rapid Double Activation 2026-08-27**, using K25,000.00 current-period value and K100,000.00 previous certified value. The Generate control was activated twice in the same browser task. It immediately disabled after the first activation. A temporary browser-side counter wrapped the unmodified real production `fetch` function and recorded **one** AI-proxy call after completion; the function was then restored. The application opened one certificate review flow at **Item 1 of 3**, with no duplicate review/document. The first line showed Previous K30,000.00, Current K5,000.00, Cumulative K35,000.00—an internally consistent allocation of the submitted certificate inputs. Test **2.16 passed**.

## CD-02 / Test 2.17 — long project and employer names

The published QA route generated Certificate 17 using a **133-character** project name—**“M2.17 Kafue Gorge East Northern Collector Drainage Rehabilitation, Flood Resilience and Community Access Improvement Works 2026-08-27”**—and a **100-character** employer name—**“National Water Supply and Sanitation Council — Northern Regional Infrastructure Delivery Directorate.”** The review completed normally with three valuation lines and reconciled **K75,000.00** current period, **K175,000.00** cumulative, and **K75,000.00** proposed net certification.

Direct visual inspection of the published two-page PDF confirms that both long fields wrap cleanly within their labelled header cells on page 1: no text leaves the cells, overlaps adjacent headers, or clips. The project, employer, contractor, certifier, three valuation lines, K175,000.00 cumulative value, and final K75,000.00 certification are visible. Page 1 and page 2 carry clean **Generated by CivilDocs | Page 1 of 2** and **Page 2 of 2** footers. Test **2.17 passed**.

## CD-05 / Tests 5.7, 5.8 and 5.10 — 10-material mixed-source schedule with zero quantity

The published QA route generated **M5.7 M5.8 M5.10 Large Mixed Schedule 2026-08-27** with a K12,500,000.00 contract, 18 months, base date 2025-01-01, current date 2026-08-27, 5% threshold, 20% cap, -10% floor, and ten source rows. Cement, reinforcement steel, diesel and aggregate cited **National price bulletin**; sand, bitumen, timber, PVC pipe, geotextile and paint cited individual **Supplier quotation SQ-401 through SQ-406**. The submitted quantities/rates were retained in the PDF: Cement 1,000 bags (K120→K138); steel 25 tonnes (K18,000→K19,800); diesel 5,000 litres (K22→K24.20); aggregate 600 tonnes (K350→K385); sand 400 tonnes (K240→K264); bitumen 120 drums (K950→K1,045); timber 60 pieces (K175→K192.50); PVC pipe 900 m (K65→K71.50); geotextile 1,500 m² (K42→K46.20); and paint **0 litres** (K90→K99).

The completed two-page PDF retains all ten rows and displays the corresponding source disclosure list on page 2. It reconciles **Total base schedule K1,232,000.00**, **Total current schedule K1,361,200.00**, **Raw rate movement K129,200.00**, and **Net payable escalation K67,600.00**. The zero-quantity paint row is K0.00 for base amount, current amount, variance, and adjustment, and does not change the reconciled total. Direct visual inspection confirms the long material table fits legibly on page 1, the rate-source disclosure follows on page 2, and visible footers are **Page 1 of 2** and **Page 2 of 2**. Tests **5.7 and 5.10 passed**.

The same scenario demonstrates per-line source labels but not a verified reference-table lookup versus a parsed user-override calculation side by side: all numerical rates were deliberately supplied in row fields for controlled arithmetic. Test **5.8 remains open** pending a scenario that exercises both actual source paths, rather than inferring one from supplier-labelled user input.

## CD-05 / Test 5.8 — actual reference-rate and user-override resolution

The published QA route then ran **M5.8 Reference and User Override Comparison 2026-08-27** with ten positive-quantity materials. Cement (100), diesel (1,000), building sand (100), crushed aggregate (100), and reinforcement steel (10) were supplied without base rates or sources, deliberately invoking the CivilDocs reference table; their base rates in the PDF were respectively **K177.00**, **K26.86**, **K320.00**, **K412.50**, and **K17,639.90**, with reference units 50 kg bag, litre, m³, m³, and tonne. Timber, bitumen, PVC pipe, geotextile, and admixture were supplied without row base rates but with the parsed `rateOverrides` values **K20**, **K1,000**, **K80**, **K50**, and **K300**, respectively.

The completed two-page PDF proves the two source paths side by side. Page 2 labels the first five lines **“CivilDocs reference estimate — verify supplier quotation”** and the latter five **“User-provided rate override.”** Page 1 uses the corresponding base rates and calculates adjustments K415.00, K1,797.00, K2,400.00, K1,687.50, K4,781.05, K300.00, K1,500.00, K2,400.00, K3,750.00, and K4,500.00, reconciling to **Net payable escalation K23,530.55**. Footers are **Page 1 of 2** and **Page 2 of 2**. Test **5.8 passed**.

## CD-03 / Test 3.4 — zero-day EOT with real cost variation

The published QA route generated **M3.4 Zero-Day Cost Variation 2026-08-27** / contract **M3-04-ZERO-DAY** as a Variation Order, with original contract value **K2,500,000.00**, cost impact **K185,000.00**, expressly entered time impact **0 days**, and original completion date 2026-10-31. The single review card is visibly labelled **Cost** and states **Cost impact K185,000.00** and **Time impact 0 days**; it was retained through review.

The confirmed review reconciles **Original K2,500,000.00**, **Total cost impact K185,000.00**, **Revised K2,685,000.00**, and **Total time impact 0 days**. The completed physical two-page PDF repeats the claim item’s K185,000.00 and 0-day values, the same contract-value reconciliation, and clean **Page 1 of 2** / **Page 2 of 2** footers. The zero time impact neither removed nor misrepresented the genuine cost claim. Test **3.4 passed**.

## CD-03 / Test 3.6 — eight-figure cost-variation precision

The published QA route generated **M3.6 Eight Figure Cost Precision 2026-08-27** / contract **M3-06-HIGH-VALUE** as a Variation Order with original contract value **K900,000,000.00**, explicitly entered cost impact **K123,456,789.50**, and a 10-day time impact. The single claim review retained the exact two-decimal cost and stated **10 days**.

The reviewed total reconciliation was **Original K900,000,000.00**, **Total cost impact K123,456,789.50**, **Revised K1,023,456,789.50**, and **Total time impact 10 days**. The independently downloaded two-page PDF repeats the item-level K123,456,789.50 amount and the exact original/revised figures; its source narrative also renders the raw entered decimal amount as `ZMW 123456789.50`. Footers read **Page 1 of 2** and **Page 2 of 2**. Test **3.6 passed**.

## CD-03 / Test 3.8 — EOT revised-date shift

The published QA route generated **M3.8 EOT Revised Date Shift 2026-08-27** / contract **M3-08-DATE-SHIFT** as an Extension of Time. The explicitly supplied original completion date was **2026-10-31**, with cost impact **K0.00** and time impact **14 days**, on the stated basis of delayed access between 1 and 14 October. The review created one Time Extension item with the same zero cost and 14-day duration.

The independently downloaded two-page PDF reports an unchanged **K3,500,000.00** contract value and, in its comparison table, **Completion Date 2026-10-31** (original) versus **2026-11-14** (revised), plus **Time Impact 14 days**. The dates therefore differ by exactly the submitted 14 days; they are not incorrectly identical. Footers read **Page 1 of 2** and **Page 2 of 2**. Test **3.8 passed**.

## CD-03 / Test 3.9 — thin delay description

The published QA route generated **M3.9 Thin Description 2026-08-27** / contract **M3-09-THIN** as an EOT-only claim. The entire submitted event description and supporting reason were the one-sentence input **“Rain delayed work.”** The submitted effects were **K0.00** cost, **3 days** time, original contract value **K1,250,000.00**, and supporting record **Site diary**.

The live review created a single Time Extension item whose title was exactly **“Rain delayed work.”**, with K0.00 and 3 days retained. The exported two-page PDF repeats the source sentence in its item, event, and reason areas; it gives only a generic **“General Conditions of Contract regarding adverse weather conditions and extension of time”** basis, rather than adding project-specific dates, instructions, causes, measurements, or cost facts not supplied. Its requested action is limited to assessment of the explicitly supplied 3 days. Footers are **Page 1 of 2** and **Page 2 of 2**. Test **3.9 passed**.

## CD-03 / Test 3.10 — detailed dates and instruction retention

The published QA route generated **M3.10 Detailed Instruction Retention 2026-08-27** / contract **M3-10-DETAIL** as a combined claim. Its submitted event stated that, on **12 July 2026**, the Engineer issued **EI-M3-10** to relocate a **300 mm watermain** at chainage **4+250**; access was suspended **13–22 July 2026** for isolation, and the relocation required **21 days**. The controlled financial input was original K4,800,000.00 plus cost impact K45,000.00; original completion was 2026-11-30.

The live review created two source-grounded items: a K45,000.00 Cost Impact titled with the 300 mm watermain, chainage 4+250, and EI-M3-10, then a 21-day Time Impact retaining the 13–22 July access suspension. The downloaded two-page PDF preserves EI-M3-10, chainage 4+250, 12 July 2026, 13–22 July records, K45,000.00, and 21 days in the information, item, event, reason, and requested-action areas. Its reconciliation is **K4,800,000.00 → K4,845,000.00** and **2026-11-30 → 2026-12-21**, with the expected 21-day shift. Both page footers are correct. Test **3.10 passed**.

## CD-03 / Test 3.11 — contractual basis blank versus explicit

CD-03 has no separate labelled contractual-basis field; the comparison was exercised through the existing Supporting Reason field. The blank/unstated-basis route was recorded in Test 3.9: the only source statement was **“Rain delayed work.”**, and the resulting export supplied a generic adverse-weather / extension-of-time basis without project-specific invented facts.

For the explicit route, the published QA session generated **M3.11 Explicit Contract Basis 2026-08-27** / contract **M3-11-CLAUSE**, with Supporting Reason **“This notice is submitted pursuant to GCC Clause 44.1 (Extension of Time) following the Engineer-issued drawing revision.”** The submitted EOT was 7 days, based on revised drawing **DRW-REV-44**. The review retained DRW-REV-44 and 7 days. The downloaded two-page PDF repeats the supplied sentence verbatim and lists **GCC Clause 44.1 (Extension of Time)** as its contractual basis; it also calculates completion as **2026-12-15 → 2026-12-22**. This demonstrates a sensible generic-basis result when no clause is stated and verbatim retention when the clause is explicitly submitted. Test **3.11 passed**.

