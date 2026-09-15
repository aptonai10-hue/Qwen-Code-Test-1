# Module 2 Professional-Standard Audit — Interim Payment Certificate

**Audit date:** 2026-08-18  
**Scope:** CivilDocs CD-02 — Interim Payment Certificate  
**Purpose:** Prepare a disciplined acceptance basis for civil-engineering reviewers in Zambia. This document is a product-quality cross-check, not a substitute for the signed contract, Bill of Quantities, Engineer's instructions, tax advice, measurement records, or an authorised Engineer/Contract Manager's certification.

## Source-led requirements baseline

| Source | Zambia-specific finding | Product implication for Module 2 |
|---|---|---|
| International Bar Association, *The FIDIC Pink Book and public procurement legislation, Zambia* (2023) | Zambia's Public Procurement Act No. 8 of 2020 regulates public procurement and requires public entities to use standard contracts approved by the Attorney-General and issued by ZPPA. The article describes the FIDIC Pink Book as the approved standard contract for international construction works and explains the Engineer/Contract Manager relationship. | The generated certificate must be a **draft valuation/certification aid**, not a representation of approval, inspection, acceptance, or payment authority. It must identify the contract, project, parties, certificate period, and certifier completion requirement. |
| International Bar Association, same source | The Contract Manager/Engineer is responsible for contract administration; Regulation 214 includes ensuring required documentation is submitted and employer payment obligations are met in accordance with the contract. | The draft must prompt the reviewer to verify measured-work records, supporting documentation, deductions, approved variations, and payment figures before signature. |
| Munga & Mwiya, *Development of a public road works contract management framework for the Zambian construction industry* (2024) | The study identifies lengthy payment processes, delayed payments for satisfactory performance, competent monitoring, and enhanced record keeping as material issues in Zambian public road works. | The certificate needs clear, auditable reconciliation: prior certified, current-period valuation, cumulative valuation, deductions, net amount, document date, and contract-specific payment terms; it should make review records explicit rather than rely on an AI narrative. |
| University of Zambia, *Contract management of high-value road works in Zambia* (search-accessible summary) | The research summary states that Interim Payment Certificates are issued by the Contract Manager based on contractors' monthly statements. | Module 2 must distinguish the contractor's submission / valuation basis from the authorised Contract Manager's certification. A certificate should not imply the AI has independently inspected or approved the works. |
| FIDIC Clause 14 public reference | The payment cycle distinguishes advance payment, monthly statements, interim certificates, retention, payment timing and final account; the Engineer issues the IPC after review. It also stresses that Particular Conditions can change payment periods and statement requirements. | The product must make payment terms **contract-configurable** rather than assume a universal 14-day period. It should support contractually applicable deductions and require the certifier to check the project's statement/supporting-document requirements. |

## Current Module 2 baseline observed in code

| Area | Current behaviour | Preliminary professional-standard assessment |
|---|---|---|
| Identity and traceability | Captures project, contract number, client, contractor, certificate number, and period. | **Strong base**, but an explicit valuation/application reference and contract payment-term field are likely required. |
| Valuation reconciliation | Recalculates prior, current, cumulative, retention and net payment from reviewable valuation cards. | **Strong base**, but should separate gross valuation, deduction categories, and retention held/released where contract data permits. |
| Contract-sum control | Warns when cumulative value exceeds contract sum. | **Strong base**, but should state that approved variations can change the certified limit and prompt for the approved revised-contract sum/reference where relevant. |
| Dates | Forces Date Issued to the browser's current local date and calculates Payment Due as +14 days. | **Needs correction:** payment timing must follow the signed contract; 14 days can be an explicit default, not an implied universal Zambian rule. |
| Certification authority | Provides a neutral certifier-completion instruction and signature lines. | **Strong safeguard**, but the PDF should explicitly distinguish contractor's application/submission from Engineer/Contract Manager certification and employer payment authorisation. |
| Supporting evidence | Free-text work description and valuation lines only. | **Gap to investigate:** professional reviewer flow should capture a concise schedule of support records, such as measurement sheets, site records, approved variations, material-on-site evidence, advance-payment recovery, tax / statutory deductions where contractually applicable, and prior-certificate references. |

## Confirmed design gaps to correct

| Priority | Gap | Correction target |
|---|---|---|
| High | Payment Due is hard-wired to 14 days. | Add a mandatory **contract payment period (days)** field, defaulted transparently to 14 days; calculate the due date from that stated term and label the result as contract-term based. |
| High | The certificate conflates a contractor valuation with the Engineer/Contract Manager's certificate. | Introduce separate **Contractor statement / application reference** and **Certifier / Contract Manager completion** sections. Keep the PDF clearly marked as a draft pending authorised certification. |
| High | Only retention is represented as a deduction. | Add optional, reviewable deductions for advance-payment recovery, statutory deductions, and other contract deductions; calculate a transparent net certified amount. |
| Medium | The contract-sum warning does not distinguish the original contract sum from approved variations. | Add an optional approved-variation value and calculate an adjusted contract sum; preserve a warning whenever cumulative certified value exceeds that adjusted limit. |
| Medium | Supporting records are not visibly listed. | Add an optional supporting-record register in the form and PDF, with contract-specific verification language rather than assertions that evidence exists. |
| Medium | The certificate identifies only Client and Contractor. | Use role-accurate labels: Employer / Procuring Entity, Contractor, Engineer / Contract Manager / Certifier, and Contractor's authorised representative. |

## Implemented correction and local acceptance evidence

The following corrections were implemented against the identified gaps. Module 2 now captures an explicit Contractor Statement / Application Reference, role-accurate Employer / Contractor / Engineer-Contract-Manager-Certifier fields, a mandatory contract payment term, optional approved variation value, an optional supporting-record register, retention held and cap, advance-payment recovery, statutory deductions, and other contract deductions. The data model recalculates the adjusted contract sum, retention subject to the stated cap, total deductions, net amount proposed for certification, and the payment due date from the entered contract term. The certificate remains a user-reviewed draft pending authorised certification.

### Local end-to-end acceptance scenario — 2026-08-18

| Input / control | Verified result |
|---|---|
| Contract and valuation | Original contract sum **K9,850,000.00**, approved variation **K650,000.00**, adjusted contract sum **K10,500,000.00**, previous certified **K9,100,000.00**, and current gross valuation **K780,000.00** reconciled to cumulative valuation **K9,880,000.00**. |
| Contract payment term | A stated **28-day** term calculated Date Issued **2026-08-18** and Payment Due **2026-09-15**; the product no longer treats 14 days as a universal contractual rule. |
| Deductions | 10% current retention was correctly limited to **K78,000.00** below the remaining cap; advance recovery **K50,000.00**, statutory deductions **K12,000.00**, and other deductions **K5,000.00** produced total deductions **K145,000.00**. |
| Review control | The secured server-side Gemini workflow produced five full valuation cards. Each was reviewed before the final summary, which exposed the deduction breakdown and the final **K635,000.00** net amount proposed for certification. |
| PDF quality | `Payment_Certificate_Lusaka_West_Drainage_and_Access_Road_Improvement_2026-08-18.pdf` downloaded successfully as a readable two-page PDF. Visual review confirmed the role-separated headers, statement reference, supporting-record list, adjusted-contract and deduction schedule, contract-term payment date, neutral draft language, and certification / authorisation lines. |

Focused regression coverage passed for the expanded calculation, date, certification, and form-validation helpers. The full deterministic suite passed **84 tests across 20 files** after the change.

### Production propagation check — 2026-08-18

Immediately after checkpoint `0ea5d7ed`, the public production domain still displayed the earlier CD-02 card description, `Get paid faster with accurate valuations`, rather than the new professional-release description. A cache-busting request produced the same earlier asset. This is recorded as a deployment-propagation observation, not a Module 2 pass; production acceptance will begin only after the public page serves the checkpointed form fields.

### Published professional acceptance result — 2026-08-18

The public release subsequently propagated and displayed the new professional Module 2 form. The same contract-term and deduction scenario completed through the secured Gemini proxy, returned four reviewable valuation cards, reconciled the entered **K780,000.00** current-period gross valuation and **K9,100,000.00** previous certified value to **K9,880,000.00** cumulative value, and kept the **K145,000.00** deductions separate before presenting **K635,000.00** as the net amount proposed for certification. The published PDF, `Payment_Certificate_Lusaka_West_Drainage_and_Access_Road_Improvement_2026-08-18 (1).pdf`, downloaded successfully with two pages and retained the 28-day contract term, 2026-09-15 due date, K10,500,000.00 adjusted contract sum, role labels, statement reference, certification signature, and employer authorisation line.

### Published invalid-input guard — 2026-08-18

The public Module 2 form was populated with a valid minimum certificate set except for **K60,000.00 retention already held** against a **K50,000.00 retention cap**. On submission it stayed on the form and displayed `Retention Held Before This Certificate cannot exceed the stated Retention Cap.` No Gemini generation request was initiated. This confirms a reviewer-visible, pre-generation control for a material data inconsistency.

### Published 105% boundary acceptance — 2026-08-18

The professional form was then tested at **K480,000.00 previously certified** plus **K50,000.00 current-period gross valuation** against a **K500,000.00 adjusted contract sum**. It displayed the K30,000.00 excess warning on the form, preserved the warning on the flashcard-review summary, and produced a two-page downloaded certificate. The final PDF retains Date Issued **2026-08-18**, Payment Due **2026-09-01 (14 days)**, the original and adjusted K500,000.00 limits, cumulative value **K530,000.00**, net amount proposed for certification **K45,000.00**, and the visible `WARNING: CONTRACT SUM EXCEEDED` block. The first response attempt returned an empty/malformed successful upstream payload despite a proxy HTTP 200; the retry completed successfully and is recorded as the pass.

The client now maps a successful-but-empty Gemini payload to the explicit retryable message, `AI returned no usable content. Please retry the same certificate.`, rather than the generic connection-failure state. The targeted regression and full deterministic suite pass **85 tests across 20 files** after this guard was added.

### Published negative-adjustment acceptance — 2026-08-18

The production scenario stated K35,000.00 in measured drain and culvert works together with a required **K18,500.00 recovery of an IPC-16 overpayment**, producing the user-entered K16,500.00 current-period gross valuation. The secured workflow returned four valuation cards, including the semantically correct `Recovery of IPC-16 Overpayment (Ancillary Works Correction)` row at **K-18,500.00**. The review reconciled K1,200,000.00 previous certified, K16,500.00 current value, K1,216,500.00 cumulative valuation, K825.00 retention, and K15,675.00 net amount proposed for certification. The downloaded two-page production PDF retains the recovery label, negative value, 28-day term, Date Issued 2026-08-18, Payment Due 2026-09-15, and all reconciled figures.

## Acceptance-pack reconciliation

| Acceptance category | Published evidence | Result |
|---|---|---|
| Normal valuation with a contract-specific term | Lusaka West Drainage and Access Road, IPC-15; 28-day term and four valuation cards. | **Pass.** |
| Retention and deduction controls | IPC-15; retention cap calculation plus advance-payment recovery, statutory deductions, and other deductions reconcile to K145,000.00. | **Pass.** |
| Over-certification boundary | Kafue District Drainage Rehabilitation, IPC-16; K30,000.00 excess warning is visible on form, review, and PDF. | **Pass.** |
| Negative adjustment | Kafue Road Drainage Rehabilitation, IPC-17; explicit K-18,500.00 recovery remains a labelled valuation row through the PDF. | **Pass.** |
| Incomplete / inconsistent inputs | Earlier sparse IPC-13 published evidence confirms graceful sparse-detail normalization; the current public form additionally blocks an invalid retention-cap relationship before Gemini is called. | **Pass.** |
| Multi-line valuation | IPC-15, IPC-16, and IPC-17 each produced four or more reviewable valuation lines with exact reconciliation. | **Pass.** |

## References

1. [International Bar Association — *The FIDIC Pink Book and public procurement legislation, Zambia*](https://www.ibanet.org/country-updates-clint-june-2023-zambia)
2. [Munga, L. & Mwiya, B. — *Development of a public road works contract management framework for the Zambian construction industry*](https://scielo.org.za/scielo.php?script=sci_arttext&pid=S2959-96522024000100003)
3. [University of Zambia — *Contract management of high-value road works in Zambia*](https://dspace.unza.zm/items/69d18850-abfa-4d26-8a03-6b9d4c2b9eb6)
4. [FIDIC .uz — *Clause 14: Contract Price and Payment*](https://fidic.uz/en/clauses/payment-14/)

