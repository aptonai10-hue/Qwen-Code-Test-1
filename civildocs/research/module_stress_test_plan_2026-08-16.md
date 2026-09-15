# CivilDocs Multi-Scenario Stress-Test Plan

**Test date:** 2026-08-16  
**Execution rule:** Each scenario must exercise the live form, Gemini proxy where capacity permits, module normalization, required flashcard review, and final PDF handoff. Capacity responses are logged separately from implementation failures and do not block non-AI validation.

| Module | Scenario A — baseline and multi-page | Scenario B — edge case | Scenario C — incomplete or constrained input |
|---|---|---|---|
| 1. Bid Package Builder | A 35-line school-drainage BOQ with multiple sections and a multi-page PDF. | Mixed units: bags, bricks, m³, tonnes, litres, metres, m², lump sums, and unfamiliar finish items. | A small community-works budget below credible minimum scope, to confirm practical quantities and one honest shortfall note. |
| 2. Interim Payment Certificate | A 12-line road-maintenance valuation across three work categories and multi-page certificate. | Retention, prior payments, and negative adjustment / recovery values. | Sparse contract details and a one-sentence work description, to verify three usable valuation lines are still generated or the error is clear. |
| 3. Variation & EOT Claims | Three variations plus two EOT events with different notices and price effects. | A mixed “Both” variation and time claim with several supporting records. | Missing notice date / incomplete instruction data, to verify limitations are surfaced rather than invented. |
| 4. NCC Grade Upgrade Portfolio | A 15-project portfolio with mixed values, clients, and completion dates. | Very large values and long project descriptions that require multi-page output. | Incomplete project records, to verify the portfolio stays transparent about missing evidence. |
| 5. Escalation Clause Builder | A 12-material schedule using current referenced rates with a long-duration contract. | Mixed bases: supplier quotation, ERB diesel, load-derived aggregate, and user overrides. | Minimal contract fields plus a material with no reference match, to verify fallback handling and exact currency. |
| 6. Site Inspection & Defect Log | A 15-item inspection log with varied severity, status, owners, and multi-page PDF. | Mixed practical quantities: count items, m³, tonnes, litres, metres, and m². | Sparse inspection data and invalid/ambiguous status wording, to verify normalization and clear remediation fields. |

## Result record

| Module | Scenario | Proxy result | Normalization / review result | PDF result | Outcome and defects |
|---|---|---|---|---|---|
| 1 | A | Not invoked in this run | Automated normalization passed | Pending live multi-page retry | 35-line BOQ stress contract passed: all count-based quantities were whole numbers and volume quantities preserved 0.1m³ increments. |
| 1 | B | Not invoked in this run | Automated normalization passed | Pending live multi-page retry | Bags, m³, tonnes, litres, metres, and m² all passed their practical-increment assertions. |
| 1 | C | Not invoked in this run | Automated budget-note guard passed | Pending live constrained-budget retry | The concise honest-budget note was added once only. |
| 2 | A | Success | Five live valuation flashcards reviewed; every displayed current-period line was nonzero | One-page PDF downloaded and visually verified | The detailed Chawama Road Maintenance IPC-03 browser scenario initially encountered transient capacity responses while preserving its inputs. The final live run produced five valuation cards: K 50,000.00, K 150,000.00, K 250,000.00, K 100,000.00, and K 100,000.00 for the current period, reconciling to K 650,000.00. The one-page PDF retains the neutral certifier-completion instruction, removes the prior mostly blank Certification page, and accurately shows K 1,200,000.00 previous, K 1,850,000.00 cumulative, K 65,000.00 retention, K 585,000.00 net, and “Page 1 of 1”. |
| 2 | B | Not invoked in this run | Automated recalculation passed | Pending live PDF retry | A three-line valuation including a negative recovery adjustment reconciled to gross value ZMW 16,500.00 and net payment ZMW 15,675.00. |
| 2 | C | Not invoked by design | Browser validation passed | Not applicable | With only project, one-sentence work description, and period value entered, the live form displayed “Complete every required field before generating the document.” No AI request or misleading certificate was created. |
| 3 | A | Temporary upstream capacity on two live attempts | Not reached | Not reached | A complete combined Chawama Road Rehabilitation claim with ZMW 500,000.00 cost impact and 35-day EOT was submitted twice to the live proxy. Each attempt correctly retained the inputs and displayed the configured “AI is temporarily at capacity” retry state; the multi-claim review and PDF are pending a later non-blocking retry. Deterministic normalization reconciles five claims exactly to the supplied amounts. |
| 3 | B | Not invoked in this run | Automated mixed-claim normalization passed | Pending live review and PDF retry | A “Both” claim split into Variation Order and Extension of Time review items with totals retained. |
| 3 | C | Not invoked by design | Browser validation passed | Not applicable | The Extension of Time form rejected the scenario without a Change or Delay Event, displaying “Complete every required field before generating the document.” The supporting reason remained visible and no unsupported AI claim was created. |
| 4 | A | Success; three fallback regression retries temporarily capacity-limited | Portfolio normalized and totalled to ZMW 15,000,000.00 | PDF downloaded and visually verified | The live 15-project BuildRight Zambia Ltd scenario produced a complete portfolio PDF with all project rows and an accurate “Page 1 of 1” footer. The total of ZMW 15,000,000.00 and exact two-decimal currency are correct. Its initial empty “Recommended Supporting Documents” table has been corrected with a neutral bidder-completion instruction, backed by unit coverage and a passing production build. Three fresh live fallback-rendering retries, including two after 60-second cooldowns, received the configured temporary-capacity response, so visual re-verification remains pending a later retry. |
| 4 | B | Not invoked in this run | Automated precision test passed | Pending live multi-page retry | A ZMW 125,000,000.55 project value retained exact two-decimal precision. |
| 4 | C | Not invoked by design | Browser validation passed | Not applicable | A portfolio record missing client and completion year was stopped at the live form with “Complete every required field before generating the document.” No incomplete portfolio was sent to AI or rendered as supporting evidence. |
| 5 | A | Not invoked in this run | Automated 12-material schedule passed | Pending live large-schedule retry | All 12 schedule items produced finite numeric base rates. |
| 5 | B | Not invoked in this run | Automated override precedence passed | Pending live override PDF retry | A user Diesel quotation of ZMW 29.75 superseded the shared reference. |
| 5 | C | Success | Review completed; unknown material retained with no invented reference | PDF downloaded and visually verified | The Kanyama Flood Mitigation scenario completed through the live proxy. The generated schedule retained “Geotextile membrane” at **K 0.00** with “verify supplier quotation”; the downloaded PDF rendered as one page with a correct “Page 1 of 1” footer. A preliminary text-extraction report of two pages was disproved by visual PDF inspection. |
| 6 | A | Success | All 15 flashcards reviewed and confirmed | Two-page PDF downloaded and visually verified | The Kanyama Primary School sanitation-block scenario initially exposed a fixed eight-item prompt cap. The correction requires one item for every numbered observation. The live proxy then returned “Item 1 of 15”; all 15 cards were kept and the final two-page PDF rendered items 1–12 on page 1, 13–15 plus report sections on page 2, and accurate “Page 1 of 2” / “Page 2 of 2” footers. Practical quantities retained 1.3m³, 5 sheets, and 2.5 tonnes. |
| 6 | B | Not invoked in this run | Automated quantity normalization passed | Pending live mixed-unit retry | Affected quantities normalized to 1.3m³, 5 sheets, and 2.5 tonnes. |
| 6 | C | Not invoked by design | Browser validation passed | Not applicable | With only project name and observations entered, the live inspection form displayed “Complete every required field before generating the document.” No unsupported site, inspector, contractor, date, or weather details were inferred. |

### 2026-08-17 manual live retry — Module 1 small constrained-budget case

Inputs: Kanyama Market Ablution Block, Kanyama/Lusaka, Lusaka City Council, Bbelasons Investments Ltd, K180,000 budget, 2-room ablution block with foundations, slab, blockwork, roof, plumbing, and drainage; procurement reference LCC/KMB/2026/04; IFB-04/2026; 60-day bid validity; submission date 2026-08-30. The published form accepted the scenario and the secured Gemini request was submitted. Result after a bounded wait: **AI temporarily at capacity** with Retry shown. No BOQ review or PDF was reached, so this scenario remains pending and is not counted toward the three live Module 1 passes.

A second browser Retry was submitted for the same inputs after the capacity response. After another bounded wait, the published page still showed “Building your bid package…” and had not reached BOQ review or PDF generation. This second attempt is also pending and is not counted as a live pass.

### 2026-08-17 manual live retry — Module 2 negative-adjustment case

Inputs: Kafue Road Drainage Rehabilitation, Road Development Agency, BuildRight Zambia Ltd, IPC-07, K1,800,000 contract sum, K1,200,000 previous certification, K16,500 current period, 15% retention, and a work description including drainage, culverts, reinstatement, and an earlier overpayment recovery. The published form accepted the scenario and the secured Gemini request was submitted. After a bounded wait, the page remained on “Preparing your payment certificate…” without reaching valuation review or PDF handoff. This scenario remains pending and is not counted toward the three live Module 2 passes.

### 2026-08-17 manual live success — Module 3 baseline five-item combined claim

Inputs: Chongwe Feeder Road Upgrade, Road Development Agency, Bbelasons Investments Ltd, K3,200,000 original value, 2026-11-30 completion date, K425,000 estimated cost impact, and 35 estimated days. The published Gemini-backed flow returned five claim cards: three Variation Orders tied to EI-12, EI-15, and EI-18, plus two EOT items for saturated subgrade and utility relocation. All five cards were kept. The review summary reconciled K425,000 total cost impact, K3,625,000 revised value, and 35 total days. The downloaded PDF was verified at two pages and preserved the supplied instructions, amounts, dates, and neutral approval language. This is **one confirmed live Module 3 scenario**.

### 2026-08-17 manual live success — Module 3 mixed claim

Inputs: Chinsali District Hospital Repairs, Ministry of Health, BuildRight Zambia Ltd, K1,450,000 original value, 2026-10-15 completion date, K90,000 cost impact, 14 days, Engineer Instruction EI-21, roof inspection records, supplier quotations, site diaries, and utility-repair notices. The published Gemini-backed flow returned two claim cards, one Variation Order and one Extension of Time. Both cards were kept. The summary reconciled K90,000 total cost impact, K1,540,000 revised value, and 14 total days. The downloaded PDF was verified as two pages and retained the user-supplied roof, access, and utility-repair facts. This is **two confirmed live Module 3 scenarios**; one further live scenario remains before Module 3 has full three-scenario live coverage.

### 2026-08-17 manual live success — Module 3 limitation-preservation EOT

Inputs: Kasama Health Post Lighting Upgrade, Ministry of Health, Bbelasons Investments Ltd, K680,000 original value, 2026-09-15 completion date, zero cost impact, and 10 days. The stated facts expressly said that the instruction was verbal and that no formal written instruction, instruction reference, or notice date was available. The published Gemini-backed flow returned one Material Delivery Delay claim card, which was kept. The completed review reconciled K0.00 cost impact and 10 days. The downloaded two-page PDF retained the missing-evidence limitation verbatim and added only neutral assessment language. This is the **third confirmed live Module 3 scenario**, completing Module 3’s requested three-scenario live coverage.

### 2026-08-17 manual live retry — Module 1 large multi-section BOQ

Inputs: Mumbwa Secondary School Drainage and Walkways, Ministry of Education, Bbelasons Investments Ltd, K2,750,000 budget, K25,000 discount, and an explicit request for a 35-line, multi-page BOQ with mixed practical units. The published form accepted the tender details and submitted the secured Gemini request. The response returned the configured **AI is temporarily at capacity** state with Retry offered. No flashcard review or PDF was reached, so this large-scope scenario remains pending and is not counted toward Module 1’s three live confirmations.

### 2026-08-17 manual live retry — Module 2 detailed baseline valuation

Inputs: Chawama Road Maintenance Phase II, Road Development Agency, Bbelasons Investments Ltd, IPC-09, K5,000,000 contract sum, K1,200,000 previous certification, K650,000 current period, 10% retention, and a twelve-activity road-maintenance scope. The published form accepted the scenario and submitted the secured Gemini request. The response returned the configured **AI is temporarily at capacity** state with Retry offered. No valuation review or PDF was reached, so this detailed baseline scenario remains pending and is not counted toward Module 2’s three live confirmations.

### 2026-08-17 manual live retry — Module 4 high-value portfolio

Inputs: Bbelasons Investments Ltd, Grade 4 to Grade 2, 12 years in operation, detailed staff and equipment information, and two completed projects valued at K125,000,000.55 and K88,900,000.00. The published form accepted the high-value records and submitted the secured Gemini request. The response returned the configured **AI is temporarily at capacity** state with Retry offered. No portfolio review or PDF was reached, so this scenario remains pending and is not counted toward Module 4’s three live confirmations.

### 2026-08-17 manual live success — Module 5 twelve-material escalation schedule

Inputs: Kafue Industrial Park Infrastructure, K18,000,000 contract value, 30 months, 2025-01-15 base date, and twelve materials: cement, reinforcement steel, diesel, sand, aggregate, common brick, roofing sheet, timber, bitumen, PVC pipes, geotextile membrane, and paint. The published Gemini-backed flow completed and produced a downloadable PDF. The verified one-page PDF included the project, the listed materials, rate-reference treatment for cement, steel, diesel, and geotextile, and an accurate “Page 1 of 1” footer. This is a further confirmed live Module 5 scenario; two more are required for full three-scenario coverage.

### 2026-08-17 post-fix retry — Module 5 user-rate override

The prior live PDF did not carry the submitted Diesel K29.75 and Aggregate K385.00 values into its normalized schedule, so deterministic precedence parsing was corrected and published with a focused regression test. The post-fix production retest submitted Diesel: K29.75 per litre. This request returned the configured **AI is temporarily at capacity** state before a PDF could be generated. Automated validation is now at 66 passing tests; the live PDF confirmation of the published override fix remains pending and is retained in the background retry queue.

### 2026-08-17 manual live retry — Module 6 mixed practical quantities

Inputs: Kanyama Primary School Sanitation Block, Kanyama, Eng. M. Phiri, BuildRight Zambia Ltd, 2026-08-17, cloudy weather, and eight numbered observations covering 1.3 m³, five sheets, 2.5 tonnes, 14 m, eight count items, 30 litres, 6 m², and four frames. The published form accepted the inputs and submitted the secured Gemini request. The response returned the configured **AI is temporarily at capacity** state before the inspection flashcards or PDF were produced. This scenario remains pending and is not counted toward Module 6’s three live confirmations.

After a one-minute cooldown, the same mixed-unit Module 6 scenario was re-entered and resubmitted on the published domain. It again returned the configured temporary-capacity retry state before flashcard review. The second attempt is logged as capacity-limited evidence and does not count as a live pass.


### 2026-08-17 manual live success — Module 3 quality-bar date/source consistency retest

Published URL: https://civildocs-zuztwkvm.manus.space/?quality=module3-date

Inputs: Kasama Health Post Drainage Upgrade; contract CON-2026-031; Kasama District Council; Bbelasons Investments Ltd; claim type Both; original contract value K2,400,000; original completion date 2026-09-15; estimated cost impact K180,000; estimated time impact 21 days; event describing unforeseen hard-rock excavation and late access; supporting evidence EI-12, site diary entries, measurement sheets, and supplier quotations.

Live result: Gemini returned two review cards. Item 01 Variation Order: K180,000.00 and 7 days. Item 02 Extension of Time: K0.00 and 14 days. The review summary showed original value K2,400,000.00, total cost impact K180,000.00, revised value K2,580,000.00, and total time impact 21 days. Confirmed PDF downloaded successfully as Variation_EOT_Kasama_Health_Post_Drainage_Upgrade_2026-08-17.pdf and rendered as two pages.

Quality-bar assertions: the PDF preserved original completion date 2026-09-15; calculated revised completion date was 2026-10-06 (21 calendar days later); currency displayed exactly two decimals; and Requested Action reconciled to the reviewed source values, requesting assessment of ZMW 180000.00 and 21 days without contradictory figures. PASS. The downloaded artifact displayed generated/submitted date 2026-08-25 although the browser session was 2026-08-17; this is a separate document-date freshness issue, not a revised-date arithmetic failure.


### 2026-08-17 post-fix live retry — Module 3 document-date freshness

The same Kasama Health Post Drainage Upgrade combined Variation/EOT scenario was submitted against the published checkpoint containing the date-freshness normalization. Inputs and expected values were retained in the form, but after a bounded wait the published UI returned the configured `AI is temporarily at capacity — please try again in a few minutes` state before review or PDF generation. This attempt is recorded as capacity-blocked and is not counted as a post-fix PDF pass. The deterministic fix is covered by the focused regression and full suite; a later capacity-available retry is still required to visually confirm the PDF now carries the current submission date.


### 2026-08-17 manual live retry — Module 4 mixed-value NCC portfolio

Inputs: Bbelasons Investments Ltd; current Grade 4; target Grade 2; 12 years in operation; detailed staff and equipment records; completed projects Mufulira Township Roads Rehabilitation (K125,000,000.55, 2025), Kitwe Industrial Access Road (K88,900,000.00, 2024), and Choma District Hospital Staff Housing (K48,750,000.25, 2023). The published form accepted all three rows and submitted the secured Gemini request. After a bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before portfolio review or PDF generation. This attempt is pending and is not counted toward Module 4's three confirmed live scenarios.


### 2026-08-17 Module 4 parity fix — NCC Grade 1/2 eligibility boundary warning

Primary-source review: the official NCC Zambia 2024 Application Form for Upgrading of Registration states that an applicant upgrading to Grade 1 or Grade 2 should have completed, within the past five years, two projects whose value is not less than 50% of the applicable current-grade/category tender-value limit. The same form also lists grade-specific professional and technical staff criteria and category-specific tender-value bands. Because CivilDocs does not currently collect category or the applicable current-grade tender limit, it must not invent a monetary pass/fail threshold.

Implementation: `normalizeGradePortfolio` now computes the number of submitted projects dated within the current year and prior five years. For target Grade 1 or Grade 2, it adds a clear eligibility warning when fewer than two qualifying projects are entered. For target Grades 3–5, it warns when no qualifying recent project is entered. The warning is included in the generated PDF under `NCC Eligibility Warnings` and in the completion-state description; the portfolio headline total and project detail rows remain calculated from the same normalized project list.

Regression evidence: added a focused Grade 2 one-project boundary test. Full validation passes with 71 Vitest tests across 19 files and a clean production build.

The three-project live Module 4 scenario (Mufulira K125,000,000.55, Kitwe K88,900,000.00, Choma K48,750,000.25; Grade 4 to Grade 2) was submitted to the published domain but returned the configured temporary-capacity state before review/PDF. It remains pending and is not counted as a live pass.

Official source: [NCC 2024 Application Form for Upgrading of Registration](https://www.ncc.org.zm/wp-content/uploads/2024/01/2024-UPGRADE-FORM-1.pdf), instructions (two recent projects for Grades 1–2) and Appendix I (grade/category staff and tender-value bands).


### 2026-08-17 manual live retry — Module 5 wider schedule and user-rate overrides

Inputs: Kitwe Industrial Access Road Rehabilitation; contract value K185,000,000.00; ZMW; 18 months; base date 2026-08-01; materials Cement, Diesel, Aggregate, and Imported geotextile; overrides `Diesel K29.75; Aggregate K385.00; Imported geotextile — verify supplier quotation`. The published form accepted the four-material schedule and submitted the secured Gemini request. After a bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before escalation output or PDF generation. This attempt is pending and is not counted as a live pass. Deterministic override precedence remains covered by the existing unit regression; a capacity-available PDF retry is still required, especially because the previous live record showed a PDF/source mismatch.


### 2026-08-17 manual live retry — Module 6 25-observation inspection register

Inputs: Chimwemwe Drainage and Access Roads Package, Chimwemwe Kitwe, Eng. Mwila Phiri, Bbelasons Investments Ltd, inspection date 2026-08-17, Cloudy weather, and 25 numbered observations spanning excavation, bedding, pipework, concrete, catchpits, road subgrade, safety controls, utilities, and close-out actions. The published form accepted the complete long observation register and submitted the secured Gemini request. After a bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before flashcard review or PDF generation. This attempt is pending and is not counted as a live pass. The deterministic 25-item retention/numbering test remains green; a capacity-available production retry is still required.


### 2026-08-17 post-parser live retry — Module 5 whitespace-separated overrides

The published checkpoint containing the expanded parser was tested with Kitwe Industrial Access Road Rehabilitation, contract value K185,000,000.00, ZMW, 18 months, base date 2026-08-01, materials Cement and Aggregate, and rate overrides `Diesel K29.75; Aggregate K385.00`. The published form accepted the scenario, but after a bounded wait the proxy returned `AI is temporarily at capacity — please try again in a few minutes` before escalation output or PDF generation. This confirms the parser fix is not yet visually verified in a published PDF; the dedicated live-PDF todo remains pending and this attempt is not counted as a live pass.


### 2026-08-17 post-fix live retry — Module 3 current submission date

The published release containing the date-freshness normalization was retested with Kasama Health Post Drainage Upgrade, CON-2026-031, Kasama District Council, Bbelasons Investments Ltd, claim type Both, original value K2,400,000, original completion date 2026-09-15, estimated cost impact K180,000, and estimated time impact 21 days. The form accepted the complete scenario and the secured request was submitted. After a bounded wait, the published UI returned `AI is temporarily at capacity — please try again in a few minutes` before review or PDF generation. The deterministic source correction remains covered by regression tests, but current-date PDF confirmation remains pending and this attempt is not counted as a pass.


### 2026-08-17 schedule audit

The inherited `CivilDocs six-module live stress validation` schedule remains active with a 14,400-second interval, `runAsNewTask: true`, and expiry at 2026-08-23T05:59:00Z (Africa/Lusaka). Its latest execution was recorded at 2026-08-17T21:14:55Z. The schedule instructions continue to require a published Gemini-backed review and downloadable PDF before a scenario is counted, and explicitly leave capacity-limited scenarios pending.


### 2026-08-17 manual live retry — Module 2 105% contract-sum boundary

Inputs: Kafue Road Drainage Rehabilitation, RDA/KAF/IPC-07, Road Development Agency, BuildRight Zambia Ltd, IPC-07, period 2026-07-01 to 2026-07-31, contract sum K500,000, current-period value K125,000, previous certified K400,000, 10% retention, and a detailed drainage/culvert/reinstatement scope. The published form visibly calculated and displayed the pre-submit warning: cumulative K525,000.00 exceeds contract sum K500,000.00 by K25,000.00. The secured Gemini request was submitted, but after a bounded wait the UI returned `AI is temporarily at capacity — please try again in a few minutes` before valuation review or PDF generation. The warning path is live-confirmed at form level; review-summary/PDF and Payment Due verification remain pending. This attempt is not counted as a live pass.


The same Module 2 105%-boundary scenario was retried once after the first capacity response. The submitted values remained intact and the form-level excess warning was preserved, but the retry again returned the configured temporary-capacity state before valuation review, Payment Due calculation, or PDF generation. It remains pending and is not counted as a live pass.


### 2026-08-17 development-server diagnostic check

After restarting the local development services, Vite started cleanly at 22:10:53Z with no fresh `payment-date-utils.js` import error in the new server or browser-console tail. The earlier import message was historical/stale; the current source graph remains validated by the 73-test suite and production build.


### 2026-08-17 manual live retry — Module 4 three-project mixed-value portfolio

Inputs: Bbelasons Investments Ltd; current Grade 4; target Grade 2; 12 years in operation; staff and equipment records; Mufulira Township Roads Rehabilitation for Mufulira Municipal Council at K125,000,000.55 in 2025; Kitwe Industrial Access Road Rehabilitation for Kitwe City Council at K88,900,000.00 in 2024; and Choma District Hospital Staff Housing for Choma Provincial Health Office at K48,750,000.25 in 2023. The published form accepted all three project rows and submitted the secured Gemini request. After a bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before portfolio review or PDF generation. This attempt remains pending and is not counted as a live pass.


### 2026-08-17 manual live retry — Module 6 25-observation severity and quantity scenario

Inputs: Chimwemwe Drainage and Access Roads, Kitwe, Eng. Mwansa, BuildRight Zambia Ltd, inspection date 2026-08-17, Clear weather, and 25 observations spanning earthworks, drainage, concrete, roadworks, safety, environment, finishes, and documentation. The scenario deliberately mixed Compliant, Non-Compliant, Requires Attention, Low, Medium, High, and Critical observations with practical affected quantities including m³, m, m², bags, tonnes, and item counts. The published request was submitted successfully, but after the bounded wait the UI returned `AI is temporarily at capacity — please try again in a few minutes` before flashcard review or PDF generation. This attempt remains pending and is not counted as a live pass.


### 2026-08-17 manual live pass — Module 5 whitespace overrides and unmatched material

Inputs: Kitwe Municipal Roads Price Adjustment; contract value K7,500,000; ZMW; 18 months; base date 2026-01-15; materials Diesel, Aggregate, and Imported geotextile; rate overrides `Diesel K29.75; Aggregate K385.00`. The published request reached the document-complete state and produced a one-page A4 PDF. Text extraction verified Diesel at K29.75/litre and Aggregate at K385.00/m³. The Rate Source section explicitly stated `Diesel: User-provided rate override` and `Aggregate: User-provided rate override`; Imported geotextile remained K0.00/unit with `CivilDocs reference estimate — verify supplier quotation`. This is a confirmed post-parser live PDF pass for the focused override scenario. The broader three-scenario Module 5 stress requirement remains open.


### 2026-08-17 manual live retry — Module 1 small municipal drainage BOQ

Inputs: Chimwemwe Stormwater Drainage Improvement, Kitwe, Kitwe City Council, BuildRight Zambia Ltd, ZMW, 180 m lined stormwater drain with two culvert crossings and associated structures, budget K350,000, procurement reference KCC/DRN/2026/014, IFB KCC/IFB/014/2026, 90-day bid validity, representative Eng. Mwansa, tender submission date 2026-08-20, and explicit cement/diesel/aggregate/sand rate references. The published request was submitted, but after a bounded wait the UI returned `AI is temporarily at capacity — please try again in a few minutes` before BOQ flashcard review or PDF generation. This attempt remains pending and is not counted as a live pass.


### 2026-08-17 manual live retry — Module 3 post-fix submission-date verification

Inputs: Chimwemwe Drainage Improvement, KCC/DRN/2026/014, Kitwe City Council, BuildRight Zambia Ltd, combined Both claim, original contract value K180,000, original completion date 2026-12-31, cost impact K180,000, time impact 21 days, and the recorded utility-relocation/culvert-crossing reason. The published post-fix request was submitted, but after a bounded wait the UI returned `AI is temporarily at capacity — please try again in a few minutes` before flashcard review or PDF generation. The current-date override remains covered deterministically and the live PDF confirmation remains pending; this attempt is not counted as a pass.


### 2026-08-17 manual live retry — Module 4 Grade 4 to Grade 2 boundary

Inputs: Bbelasons Investments Ltd; current Grade 4; target Grade 2; 12 years in operation; engineering/QS/site/safety staff; excavators, graders, tippers, rollers, mixers, water bowser, survey and traffic-control assets; two completed projects: Mufulira Township Roads Rehabilitation for K125,000,000.55 in 2025 and Kitwe Industrial Access Road Rehabilitation for K88,900,000.00 in 2024. The published request was submitted, but after a bounded wait the UI returned `AI is temporarily at capacity — please try again in a few minutes` before portfolio review or PDF generation. The form-level eligibility logic remained reachable; this attempt is not counted as a live pass.


### 2026-08-17 manual live retry — Module 2 105% contract-sum boundary

Inputs: Chimwemwe Drainage Improvement, KCC/DRN/2026/014, Kitwe City Council, BuildRight Zambia Ltd, IPC-08, period 2026-07-01 to 2026-07-31, contract sum K500,000, current value K50,000, previous certified K480,000, and 10% retention. The published form correctly displayed the warning before submission: cumulative K530,000 exceeds contract sum K500,000 by K30,000. The request was submitted, but after a bounded wait the UI returned the configured capacity message before valuation review or PDF generation. This attempt is not counted as a live pass.


### Current reconciliation note — 2026-08-17

Earlier entries in this report retain their original historical context, including the 66-test count and the pre-fix Module 5 override attempt. The current production checkpoint supersedes those interim states: the suite is now **75 passing tests across 19 files**, the Module 5 whitespace-override parser is corrected, and the post-fix published PDF pass verified Diesel K29.75 and Aggregate K385.00 with explicit user-override source labels. All later capacity-blocked attempts remain classified as non-passes. Module 3 still has three completed baseline stress scenarios; its separate post-fix document-date verification remains pending because recent retries stopped at upstream capacity.


### 2026-08-17 manual live retry — Module 6 20-observation mixed-severity register

Inputs: Chimwemwe Drainage and Access Roads, Kitwe, Eng. Mwansa, BuildRight Zambia Ltd, inspection date 2026-08-17, Clear weather, and 20 observations across earthworks, drainage, concrete, roadworks, safety, environment, finishes, and documentation. The observations deliberately mixed Compliant, Non-Compliant, Requires Attention, Low, Medium, High, and Critical severities with practical affected quantities in m³, m, m², bags, and item counts. The published request was submitted, but after a bounded wait the UI returned `AI is temporarily at capacity — please try again in a few minutes` before flashcard review or PDF generation. This attempt remains pending and is not counted as a live pass.


### 2026-08-17 schedule audit

The inherited six-module live-stress validator remains active in full-auto mode for project `Ar2hYjqWHcmuPzRnYy2gQn`, with a four-hour interval (`14,400` seconds), Africa/Lusaka timezone, task UID `SUqQX2qXFXJYxjJVNaRywL`, and expiry at 2026-08-23T05:59:00Z. Its rule remains that only a published Gemini-backed review plus downloadable PDF counts as a pass; capacity-limited attempts remain pending.


### 2026-08-17 manual live retry — Module 4 Grade 4 to Grade 2 boundary

Inputs: Bbelasons Investments Limited; current Grade 4; target Grade 2; 12 years in operation; detailed staff and equipment records; and two recent qualifying projects: Mufulira Township Roads Rehabilitation for K125,000,000.55 in 2025 and Kitwe Industrial Access Road Rehabilitation for K88,900,000.00 in 2024. The exact portfolio total is K213,900,000.55 and the two-project boundary warning is expected to be visible for the target grade. The published request was submitted, but after a bounded wait the UI returned the configured capacity message before portfolio review or PDF generation. This attempt remains pending and is not counted as a live pass.


### 2026-08-17 manual live retry — Module 3 post-fix document-date freshness

Inputs: Chimwemwe Drainage Improvement, KCC/DRN/2026/014, Kitwe City Council, BuildRight Zambia Ltd, combined Both claim, original value K3,200,000.00, original completion date 2026-10-15, K180,000 cost impact, and 21-day time impact under EI-07. The post-fix published request was submitted after the dateSubmitted normalization correction, but the bounded wait ended in the configured capacity message before claim review or PDF download. The corrected current-date path therefore remains deterministic-test verified but not live-PDF verified in this attempt.


### 2026-08-17 manual live retry — Module 1 constrained-budget municipal ablution block

Inputs: Kanyama Market Ablution Block, Kanyama/Lusaka, Lusaka City Council, Bbelasons Investments Limited, K180,000 approximate budget, a two-room ablution block with foundations, slab, blockwork, roof, plumbing, drainage, apron, and reinstatement, procurement reference LCC/KMB/2026/04, IFB-04/2026, 60-day bid validity, Eng. Mwansa as proposed representative, submission date 2026-08-30, and practical-quantity instructions. The published request was submitted, but after a bounded wait the UI returned the configured capacity message before BOQ flashcard review or PDF generation. This scenario remains pending and is not counted as a live pass.


### 2026-08-17 manual live retry — Module 2 105% contract-sum boundary

Inputs: Chimwemwe Drainage Improvement, KCC/DRN/2026/014, Kitwe City Council, BuildRight Zambia Ltd, IPC-09, period 2026-07-01 to 2026-07-31, contract sum K500,000, current value K50,000, previous certified K480,000, and 10% retention. The form again displayed the correct pre-submit warning that cumulative K530,000 exceeds contract sum K500,000 by K30,000. The submitted request remained capacity-blocked after the bounded wait, with no valuation review, calculated Payment Due date, or PDF handoff. This attempt is not counted as a live pass.


## Current quality-bar parity matrix — 2026-08-17

| Module | Deterministic evidence currently passing | Published production evidence currently confirmed | Remaining live evidence |
|---|---|---|---|
| Module 2 — Interim Payment Certificate | Exact 100% and 105% contract-sum boundaries, K30,000 overrun fallback warning, multi-line valuation reconciliation, calculated payment-date utilities, and negative-adjustment normalization. | Baseline multi-line IPC PDF pass is confirmed. | A repeated 105% boundary PDF with calculated Payment Due remains capacity-blocked; sparse and negative-adjustment live cases remain pending.
| Module 3 — Variation & EOT | Source-authoritative cost/time reconciliation, revised completion date arithmetic, current document-date stamping, two-decimal values, and multi-claim normalization. | Three baseline live claim PDFs are confirmed. | Post-fix current submission-date PDF confirmation remains capacity-blocked.
| Module 4 — NCC Portfolio | Official NCC Grade 1/2 two-project boundary warning, exact mixed high-value total K213,900,000.55, two-decimal aggregation, and empty-supporting-documents fallback. | One 15-project portfolio PDF is confirmed. | Three-scenario re-verification and fallback visual confirmation remain capacity-blocked.
| Module 5 — Escalation Clause | Sourced-rate handling, user override precedence across colon/equal/semicolon/newline/whitespace formats, wider-list unmatched-material transparency, and exact two-decimal rates. | Three live outputs are confirmed: 12-material schedule, unmatched-material fallback, and post-fix override PDF. | No remaining Module 5 parity blocker is identified; the overall six-module campaign remains open.
| Module 6 — Site Inspection | 25-item retention, 20-item mixed-severity practical-quantity normalization, all valid severity levels, invalid-severity fallback, and flashcard preservation. | One 15-item two-page PDF is confirmed. | 20–25 item live review/PDF and large-count severity-color verification remain capacity-blocked.

This matrix deliberately distinguishes implementation evidence from live Gemini evidence. Capacity responses are retained as pending attempts rather than treated as failures or passes.

### 2026-08-17 — Module 2 105% boundary retry (latest)

Inputs: Chimwemwe Drainage Improvement; KCC/DRN/2026/014; Kitwe City Council; BuildRight Zambia Ltd; IPC-09; period 2026-07-01 to 2026-07-31; contract sum K500,000; current-period value K50,000; previous certified K480,000; retention 10%. The published form again displayed the deterministic warning: cumulative K530,000 exceeds contract sum K500,000 by K30,000. The submitted Gemini request returned `AI is temporarily at capacity — please try again in a few minutes` after the bounded wait, before valuation flashcard review, calculated Payment Due date, or PDF download. This attempt remains pending and is not counted as a live pass.

The published retry confirms the boundary warning remains visible and stable after reload; live Gemini-backed review/PDF evidence is still capacity-dependent.

### 2026-08-17 — Module 3 current submission-date retry (latest)

Inputs: Chimwemwe Drainage Improvement; KCC/DRN/2026/014; Kitwe City Council; BuildRight Zambia Ltd; combined Both claim; original value K3,200,000; original completion date 2026-10-15; cost impact K180,000; time impact 21 days; EI-07 and supporting notice/site-diary facts. The published form accepted the scenario and the secured Gemini request was submitted. After the bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before claim review or PDF download. The current-date PDF confirmation remains pending and is not counted as a live pass.

### 2026-08-17 — Module 4 Grade 4 to Grade 2 boundary retry (latest)

Inputs: Bbelasons Investments Limited; current Grade 4; target Grade 2; 12 years in operation; detailed staff and equipment; Mufulira Township Roads Rehabilitation for K125,000,000.55 in 2025; Kitwe Industrial Access Road Rehabilitation for K88,900,000.00 in 2024. The published form accepted both projects and submitted the secured Gemini request. After the bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before portfolio review or PDF download. The exact headline total K213,900,000.55 and Grade 1/2 eligibility-warning PDF remain pending and this attempt is not counted as a live pass.

### 2026-08-17 — Module 6 20-observation large-count retry (latest)

Inputs: Kanyama Primary School Sanitation Block; Kanyama, Lusaka; Eng. M. Phiri; BuildRight Zambia Ltd; inspection date 2026-08-17; cloudy weather; 20 numbered observations spanning 1.3 m3, 5 sheets, 2.5 tonnes, metres, litres, square metres, count items, and Low/Medium/High/Critical severities. The published form accepted the full observation text and submitted the secured Gemini request. After the bounded wait, the UI returned `AI is temporarily at capacity — please try again in a few minutes` before flashcard review or PDF generation. Large-count severity-color and PDF verification remain pending and this attempt is not counted as a live pass.

### 2026-08-18 — Module 2 Date Issued authority fix and published verification retry

Defect report: a sparse-input Module 2 certificate displayed `Date Issued` as 2024-10-25 although the current date was 2026-08-18. Root cause: `normalizePaymentDates` accepted any valid AI-supplied `data.dateIssued` rather than using the browser document date. Correction: Date Issued is now always the browser-generated current ISO date and Payment Due is always recalculated as 14 calendar days after it; stale AI dates and non-form source dates are discarded. Deterministic regression verifies stale `2024-10-25` and conflicting `2025-01-01` values normalize to Date Issued `2026-08-18` and Payment Due `2026-09-01` when the injected current date is 2026-08-18.

Published verification inputs: Chimwemwe Drainage Improvement; KCC/DRN/2026/014; Kitwe City Council; BuildRight Zambia Ltd; IPC-10; period 2026-08-01 to 2026-08-17; contract sum K500,000; previous K400,000; current K50,000; 10% retention; concise drainage/culvert scope. The deployed form accepted the request, but Gemini returned `AI is temporarily at capacity — please try again in a few minutes` before review or PDF. The production date/PDF observation remains pending; this attempt is not counted as a live pass.

### 2026-08-18 — Module 2 stable-model fallback live success and date verification

After the proxy reliability update, the published Module 2 request used the standard secured Gemini path, with the stable Flash-Lite fallback available after transient primary-model capacity responses. Inputs: Chimwemwe Drainage Improvement; KCC/DRN/2026/014; Kitwe City Council; BuildRight Zambia Ltd; IPC-11; period 2026-08-01 to 2026-08-18; contract sum K500,000; previous certified K400,000; current-period value K50,000; retention 10%; concise drainage, culvert, headwall, and reinstatement scope.

The live Gemini-backed request reached a four-card valuation review and all items were kept. Reviewed values reconciled exactly: previous certified K400,000.00; current-period K50,000.00; cumulative K450,000.00; retention K5,000.00; net payment K45,000.00. The final published PDF downloaded as a single page, named `Payment_Certificate_Chimwemwe_Drainage_Improvement_2026-08-18.pdf`, and was visually checked. Its `Date Issued` is **2026-08-18** and its calculated `Payment Due` is **2026-09-01**. This confirms both the fallback-backed live flow and the Module 2 current-date correction; it is a confirmed published Module 2 scenario.

### 2026-08-18 — Module 3 current-date PDF verification after model-flow recovery

Published combined-claim inputs: Chimwemwe Drainage Improvement; KCC/DRN/2026/014; Kitwe City Council; BuildRight Zambia Ltd; Both; additional culvert headwalls and delayed utility relocation; original contract K3,200,000; original completion 2026-10-15; cost impact K180,000; time impact 21 days; Engineer Instruction EI-07 and records-based supporting reason.

The live secured Gemini request reached a two-card claim review: a K180,000.00 Variation Order and a 21-day Extension of Time. The summary reconciled to revised value K3,380,000.00 and total time impact 21 days. After accepting both cards, the published PDF downloaded as `Variation_EOT_Chimwemwe_Drainage_Improvement_2026-08-18.pdf`. Text extraction and visual page-one inspection confirmed `Date Submitted` **2026-08-18**, with original completion **2026-10-15** and correctly calculated revised completion **2026-11-05**. This is the confirmed post-fix current-date PDF evidence required for Module 3.

### 2026-08-18 — Module 4 mixed-value portfolio and Grade 2 boundary PDF verification

Published inputs: BuildRight Zambia Ltd; current Grade 4; target Grade 2; 9 years operating; defined professional staff and equipment; Chimwemwe Drainage Improvement for Kitwe City Council at K125,000,000.55 (2025); and Kafue Riverbank Protection Works for Zambia Railways Limited at K88,900,000.00 (2024).

The recovered secured Gemini flow generated and downloaded `NCC_Grade_Portfolio_BuildRight_Zambia_Ltd_2026-08-18.pdf`. Text extraction and visual inspection confirm that both completed-project values appear exactly and the portfolio headline is **K213,900,000.55**, equal to their sum. The portfolio clearly identifies the Grade 4 to Grade 2 application and frames the high-value project record as evidence for the requested classification. The result is a confirmed published Module 4 scenario with headline/detail reconciliation preserved.

### 2026-08-18 — Module 6 twenty-observation, three-page severity PDF verification

Published inputs: Chimwemwe Drainage Improvement; Zone C culvert corridor, Kitwe; Eng. Chanda Mulenga; BuildRight Zambia Ltd; inspection date 2026-08-18; Cloudy weather; twenty numbered observations containing practical affected quantities and explicit Low, Medium, High, and Critical severities.

The secured Gemini request reached a **20-item** flashcard review (not a fixed eight-item output). Review inspection confirmed item 1 as Low / 12 m², item 2 as High / 18 pcs, item 3 as Medium / 24 m, and item 4 as Critical / 6 pcs. The completed summary retained all twenty items, including a second Critical access-ladder item. After confirmation, the final PDF downloaded as `Site_Inspection_Chimwemwe_Drainage_Improvement_2026-08-18.pdf`; `pdfinfo` reports **3 pages** and text extraction yields 513 lines. Visual page-one inspection confirms readable tabular layout and severity colour semantics: green for Compliant/Low, amber for Requires Attention/Medium, and red/pink for Non-Compliant/High/Critical. This is a confirmed published Module 6 large-count scenario.

### 2026-08-18 — Module 1 recovered flow and constrained-budget PDF verification

Published inputs: Kanyama Market Ablution Block; Kanyama, Lusaka; Lusaka City Council; BuildRight Zambia Ltd; ZMW; two-cubicle ablution block with septic tank, soakaway, blockwork, roof, plumbing, apron, and clearance; budget K180,000; LCC/WKS/2026/081; LCC/IFB/2026/081; 90-day validity; tender date 2026-08-29; cement, reinforcement steel, and diesel overrides.

A prior request remained in the browser loading state long enough to identify the need for the bounded upstream timeout guard. On the newly published release, the same request reached a **32-item** BOQ flashcard review and then generated `Bid_Package_Kanyama_Market_Ablution_Block_2026-08-18.pdf`. The five-page PDF records measured works and tender price **K205,982.80**, preserves practical mixed quantities (for example 120 cement bags, 0.5 tonne reinforcement, 300 litres diesel), and contains the required compliance note that the realistic minimum-viable scope exceeds the K180,000 budget. This is a confirmed published Module 1 scenario and confirms that a delayed upstream response ultimately recovered through the current secured proxy flow.

### 2026-08-18 — Module 2 105% boundary, PDF and response-body-timeout verification

Published inputs: Chimwemwe Drainage Improvement; KCC/DRN/2026/014; Kitwe City Council; BuildRight Zambia Ltd; IPC-12; period 2026-08-01 to 2026-08-18; contract sum K500,000; previous certified K480,000; this-period work K50,000; 10% retention.

The submitted form immediately displayed the exact pre-submit warning: cumulative K530,000.00 exceeds K500,000.00 by K30,000.00. A prior run revealed that the first timeout implementation cleared after headers while a response body could still stall; the response-body timeout fix was deployed before this rerun. The corrected live request reached a three-item review, preserved practical valuation descriptions, and carried the same warning into the final summary. The one-page PDF `Payment_Certificate_Chimwemwe_Drainage_Improvement_2026-08-18 (1).pdf` confirms Date Issued **2026-08-18**, Payment Due **2026-09-01**, Cumulative Value **K530,000.00**, Retention **K5,000.00**, Net Payment Due **K45,000.00**, and the exact contract-sum-exceeded warning. This is a confirmed published Module 2 105%-boundary scenario.

### 2026-08-18 — Module 4 Grade 2 eligibility-boundary PDF verification

Published inputs: BuildRight Zambia Ltd; current Grade 4; target Grade 2; 8 years operating; stated technical staff and owned equipment; one completed Kitwe Urban Drainage Rehabilitation project for Kitwe City Council valued at K125,000,000.55 in 2025.

The secured Gemini request completed without a capacity block and produced a downloadable one-page portfolio PDF, `NCC_Grade_Portfolio_BuildRight_Zambia_Ltd_2026-08-18 (1).pdf`. The generated portfolio preserves the supplied single project and exact **K125,000,000.55** headline/detail value. Both the production completion view and the final PDF visibly state the Grade 2 eligibility warning: the NCC 2024 upgrade form expects two completed projects within the past five years, while this scenario contains only one qualifying project. This is a confirmed published Module 4 grade-eligibility boundary scenario.

### 2026-08-18 — Module 5 current proxy-flow override PDF verification

Published inputs: Chimwemwe Drainage Improvement; ZMW3,200,000 contract value; 12-month duration; base date 2026-02-01; Diesel and Aggregate at risk; user rate overrides `Diesel K29.75; Aggregate K385.00; Imported geotextile K0`.

The secured Gemini flow completed without capacity blocking and generated the one-page `Escalation_Clause_Chimwemwe_Drainage_Improvement_2026-08-18.pdf`. The final materials schedule shows Diesel at **K29.75/litre** and Crushed aggregate/quarry stone at **K385.00/m³**. Both rows are explicitly labeled **User-provided rate override**. The formal clause retains the contract-specific base date and escalation mechanism. This confirms current Module 5 production operation through the recovered proxy.

### 2026-08-18 — Module 1 large mixed-unit, discounted BOQ live review and PDF handoff

Published inputs: Mumbwa Secondary School Drainage and Walkways; Mumbwa, Central Province; Ministry of Education; BuildRight Zambia Ltd; ZMW; K2,750,000 approximate budget; K25,000 discount; 90-day validity; MOE/MUM/DRN/2026/035; MOE/IFB/2026/035; tender date 2026-08-29. The requested scope covered drainage, culvert crossings, concrete walkways, catchpits, safety control, reinstatement, and environmental protection with practical mixed units and supplier-rate overrides.

The secured production Gemini flow completed without capacity blocking and returned a **25-item** flashcard review. The reviewed BOQ included count-based, linear, area, volume, weight, litre, bag, brick, and lump-sum entries; examples include 1,400 cement bags, 12.5 tonnes reinforcement steel, 450 m³ aggregate, and 4,500 litres diesel. The review summary reconciled **K3,544,517.00** total measured works, less the exact **K25,000.00** discount, to a **K3,519,517.00** tender price. All 25 review cards were accepted, the document-complete screen was reached, and `Bid_Package_Mumbwa_Secondary_School_Drainage_and_Walkways_2026-08-18.pdf` was downloaded from the published production domain. Local PDF inspection confirms **four pages** and preserves both the Total of Bills / Measured Works of K3,544,517.00 and Tender Price (after discount) of K3,519,517.00. This is a second confirmed live Module 1 scenario.

### 2026-08-18 — Module 2 sparse-detail live review and PDF handoff

Published inputs: Chisamba Community Clinic Drainage; MOH/CHI/DRN/2026/019; Ministry of Health; BuildRight Zambia Ltd; IPC-13; period 1–18 August 2026; contract sum K900,000.00; previous certification K150,000.00; this-period work K80,000.00; retention 5%; and the single-sentence scope “Continue drainage works and reinstate access at the clinic.”

The secured production Gemini flow completed without capacity blocking and returned a **four-item** valuation flashcard review. It generated usable, non-fragmented descriptions despite the concise scope, reconciling the submitted previous and current values exactly: K150,000.00 previous certified, K80,000.00 gross this period, K230,000.00 cumulative, and K76,000.00 net payment after 5% retention. All four cards were accepted, the document-complete screen was reached, and `Payment_Certificate_Chisamba_Community_Clinic_Drainage_2026-08-18.pdf` was downloaded from the published domain. Local PDF inspection confirms **one page** and preserves Date Issued **2026-08-18**, Payment Due **2026-09-01**, Gross Value This Period K80,000.00, Previous Certified Amount K150,000.00, Cumulative Value K230,000.00, and Net Payment Due K76,000.00. This is the third confirmed live Module 2 scenario, completing its requested three-scenario coverage.

### 2026-08-18 — Module 4 high-value two-project portfolio PDF verification

Published inputs: Bbelasons Investments Limited; current Grade 4; target Grade 2; 12 years in operation; detailed technical-staff and owned-equipment evidence; Mufulira Township Roads Rehabilitation and Drainage Upgrading for Mufulira Municipal Council valued at K125,000,000.55 in 2025; and Kitwe Industrial Access Road and Utility Crossings for Kitwe City Council valued at K88,900,000.00 in 2024.

The secured production Gemini flow completed without capacity blocking and reached the document-complete state. The downloaded `NCC_Grade_Portfolio_Bbelasons_Investments_Limited_2026-08-18.pdf` is **two pages**. Local text and PDF inspection confirm it preserves Grade 4-to-Grade-2 intent, both completed-project values at exact two-decimal precision, and the reconciled portfolio value **K213,900,000.55**. The two recently completed projects appropriately satisfy the portfolio-count condition underlying the existing Grade 2 boundary warning logic; no unsupported eligibility-pass statement was introduced. This is the third confirmed live Module 4 scenario, completing its requested three-scenario coverage.

### 2026-08-18 — Module 6 25-observation mixed-severity production review and PDF handoff

Published inputs: Chimwemwe Drainage and Access Roads Package; Zone C culvert corridor, Kitwe; Eng. Chanda Mulenga; BuildRight Zambia Ltd; inspection date 2026-08-18; Cloudy weather; and 25 numbered observations spanning practical units, construction quality, safety, environment, access, utilities, and documentation.

The secured production Gemini flow completed without capacity blocking and returned a **25-item** flashcard review rather than truncating the inspection register. The review preserved the full Low, Medium, High, and Critical severity set, including High unsupported trench sides, Critical missing pedestrian-excavation barriers, Critical unsecured ladder access, and Critical absent utility marker tape. All 25 cards were accepted, the document-complete screen was reached, and `Site_Inspection_Chimwemwe_Drainage_and_Access_Roads_Package_2026-08-18.pdf` was downloaded from the published domain. Visual PDF inspection confirms **three pages**, with items 1–14 presented in a readable table on page 1, items 15–25 and safety/remarks on page 2, and the structured next-inspection and signature area on page 3. Severity and status color semantics are preserved: green for Compliant/Low, amber for Requires Attention/Medium, and red/pink for Non-Compliant/High/Critical. This is the third confirmed live Module 6 scenario, completing its requested three-scenario coverage.

### 2026-08-18 — Module 1 final mixed-unit municipal-drainage review and PDF handoff

Published inputs: Chimwemwe Stormwater Drainage Improvement; Chimwemwe, Kitwe; Kitwe City Council; BuildRight Zambia Ltd; K350,000 approximate budget; KCC/DRN/2026/014; KCC/IFB/014/2026; 90-day validity; and rate references for cement, reinforcement steel, diesel, sand, aggregate, and bricks. The defined scope was 180 m of lined stormwater drain with two culvert crossings, headwalls, catchpits, excavation, concrete, reinforcement, formwork, safety controls, and reinstatement.

The secured production Gemini flow completed without capacity blocking and returned a **12-item** BOQ flashcard review. Practical values included whole-number lump sums and bricks (8,500 bricks), sensible earthworks and concrete volumes (450 m³ excavation, 65 m³ reinforced concrete), and 3.5 tonnes of reinforcement steel. The reviewed total measured works and tender price both reconciled to **K490,900.00**. All 12 cards were accepted, the document-complete screen was reached, and `Bid_Package_Chimwemwe_Stormwater_Drainage_Improvement_2026-08-18.pdf` was downloaded from the published domain. Local PDF inspection confirms **four pages**, and preserves 450 m³ excavation, 65 m³ reinforced concrete, 3.5 tonnes reinforcement, 8,500 bricks, Total of Bills / Measured Works K490,900.00, and Tender Price (after discount) K490,900.00. This is the third confirmed live Module 1 scenario, completing its requested three-scenario coverage.

## Eighteen-scenario production campaign reconciliation — 2026-08-18

All six modules now have three confirmed published-domain scenarios that completed the secured Gemini request, review flow, PDF generation, and downloaded-PDF verification. The completed campaign consists of three Module 1 bid packages, three Module 2 certificates, three Module 3 claims, three Module 4 portfolios, three Module 5 escalation schedules, and three Module 6 inspection logs. Earlier capacity-limited attempts remain preserved above as non-passes; they were not used to satisfy the campaign threshold. The remaining work is the targeted Module 2 and Module 3 parity-edge audit, rather than broad stress coverage.

### 2026-08-18 — Module 2 negative-adjustment parity review and PDF handoff

Published inputs: Kafue Road Drainage Rehabilitation; RDA/KAF/IPC-14; Road Development Agency; BuildRight Zambia Ltd; IPC-14; period 1–18 August 2026; contract sum K1,800,000.00; previous certification K1,200,000.00; this-period net value K16,500.00; retention 5%. The source scope explicitly stated K35,000.00 measured works less K18,500.00 recovery of an earlier overpayment.

The secured production flow completed without capacity blocking and returned a five-card review. The recovery was surfaced explicitly and semantically correctly as `Recovery of overpayment from IPC-13 (Adjustment)`, with This Period **K-18,500.00**, rather than as an invented work activity. The review reconciled K16,500.00 gross this period, K1,200,000.00 previous certified, K1,216,500.00 cumulative, and K15,675.00 net payment after 5% retention. All cards were accepted and `Payment_Certificate_Kafue_Road_Drainage_Rehabilitation_2026-08-18.pdf` was downloaded from the published domain. Local PDF inspection confirms **one page**, Date Issued **2026-08-18**, Payment Due **2026-09-01**, the K-18,500.00 recovery row, K16,500.00 current value, K1,216,500.00 cumulative value, and K15,675.00 net payment. This completes the negative-adjustment portion of the Module 2 parity audit.

### 2026-08-18 — Module 3 variation-only parity review and PDF handoff

Published inputs: Ndola Market Access Road Rehabilitation; KCC/NDA/VAR/2026/022; Ndola City Council; BuildRight Zambia Ltd; Variation Order; Engineer Instruction EI-22; original contract value K2,450,000.00; original completion date 2026-10-31; cost impact K220,000.00; and time impact 0 days.

The secured production flow completed without capacity blocking and returned two **Cost** claim cards, each with **0 days**: K150,000.00 for additional headwalls/outlet protection and K70,000.00 for utility-duct crossings. The review summary reconciled K220,000.00 total cost impact, K2,670,000.00 revised value, and zero total time impact. Both cards were accepted and `Variation_EOT_Ndola_Market_Access_Road_Rehabilitation_2026-08-18.pdf` was downloaded from the published domain. Local PDF inspection confirms **two pages**, Date Submitted **2026-08-18**, both 0-day Cost items, original value K2,450,000.00, K220,000.00 cost impact, and revised value K2,670,000.00. This confirms independent, internally consistent Variation-only treatment.

### 2026-08-18 — Module 3 EOT-only parity review and PDF handoff

Published inputs: Kasama District Health Centre Access Improvement; MOH/KAS/EOT/2026/011; Ministry of Health; BuildRight Zambia Ltd; Extension of Time; original value K1,680,000.00; original completion 2026-10-15; cost impact K0.00; and time impact 21 days. The delay evidence covered exceptional rainfall, saturation, supplier haulage disruption, site diaries, rainfall records, moisture tests, and Engineer Instruction EI-19.

The secured production flow completed without capacity blocking and returned one **Time Extension** card, with cost impact K0.00 and time impact 21 days. The review summary retained original and revised contract value at K1,680,000.00 and correctly displayed a 21-day total time impact. The card was accepted and `Variation_EOT_Kasama_District_Health_Centre_Access_Improvement_2026-08-18.pdf` was downloaded from the published domain. Local PDF inspection confirms **two pages**, Date Submitted **2026-08-18**, one 21-day Time Extension with K0.00 cost impact, original/revised contract value K1,680,000.00, and calculation of original completion 2026-10-15 to revised completion **2026-11-05**. This confirms independent, internally consistent EOT-only treatment.

## Final quality-bar parity reconciliation — 2026-08-18

| Module | Security and review control | Published calculation / source evidence | Business-limit and date evidence | Parity result |
|---|---|---|---|---|
| 2 — Interim Payment Certificate | Secured proxy and one-at-a-time valuation review; no browser credential exposure. | Three published certificates reconcile submitted and reviewed values, including K-18,500.00 recovery, K16,500.00 current value, K1,216,500.00 cumulative, and K15,675.00 net payment. | The 105% case carries the visible K30,000.00 excess warning. Published certificates consistently use Date Issued 2026-08-18 and Payment Due 2026-09-01. | **Complete.** |
| 3 — Variation & EOT Claims | Secured proxy and claim-card review prevent silent changes before the PDF. | Combined, Variation-only, and EOT-only paths preserve source-authoritative cost/time totals; cost-only and time-only impacts remain separated. | The variation-only route retains 0 days; the EOT-only route retains K0.00 cost and calculates 2026-10-15 plus 21 days as 2026-11-05. | **Complete.** |
| 4 — NCC Portfolio | Secured proxy output with calculated headline and project-detail reconciliation. | Exact mixed project values K125,000,000.55 and K88,900,000.00 reconcile to K213,900,000.55 in the PDF. | The single-project Grade 2 boundary case visibly warns that two recent completed projects are expected; the two-project case avoids inventing a pass claim. | **Complete.** |
| 5 — Escalation Clause | Secured proxy output maintains user-provided rate references and schedule review. | Twelve-material, unmatched-material, and override scenarios retain finite rates or explicit verify-supplier treatment; Diesel K29.75 and Aggregate K385.00 remain user overrides. | Source labels distinguish rate references, user overrides, and unmatched material rather than inventing supplier rates. | **Complete.** |
| 6 — Site Inspection & Defect Log | Secured proxy and mandatory 15-, 20-, and 25-item flashcard reviews preserve user review of every output item. | Practical quantities and all Low/Medium/High/Critical severities remain intact through the three-page 25-item PDF. | Status/severity colors remain semantically aligned: green for Compliant/Low, amber for Requires Attention/Medium, red/pink for Non-Compliant/High/Critical. | **Complete.** |

### Five known defect-pattern reconciliation

| Defect pattern | Published verification |
|---|---|
| Missing bounded-value warnings | Module 2 carries the K30,000.00 over-contract warning to its final PDF; Module 4 carries the Grade 2 one-project boundary warning. |
| Independently regenerated figures | Module 2 review/PDF values and Module 3 original/revised values reconcile to the source values, including negative and zero-impact cases. |
| Boundary-condition degradation | Module 2’s 105% case preserves practical valuation descriptions, while the negative-recovery case keeps a labelled adjustment line rather than degrading it into unrelated scope. |
| Inconsistent date formatting | Module 2 enforces current browser date plus 14 days; Module 3 enforces current submission date and calculates the revised completion date consistently. |
| Semantic field mislabeling | The recovery is labelled an Adjustment, Variation-only and EOT-only claim types remain distinct, and Module 6 status/severity labels remain aligned to their color semantics. |

All evidence above refers to the published production domain and is separate from deterministic coverage. The deterministic suite remains the regression safety net for these rules.

### 2026-08-18 — Validator lifecycle completion

After the eighteen-scenario campaign and parity audit were completed, the four-hour `CivilDocs six-module live stress validation` schedule was paused. It remains preserved with its task UID and historical execution record, but will not consume further automated runs unless a new validation requirement is introduced.

