# CivilDocs Full Stress-Suite Evidence Status

**Prepared:** 21 August 2026  
**Scope:** The 104 rows in the supplied “Final Pre-Handoff Stress Test Suite”  
**Evidence rule:** A row is marked **PASS** only where a comparable production-domain run and its observed result are recorded. **PARTIAL** means related evidence exists but does not execute every condition in the requested row. **NOT RUN** means no real production input/output was recorded for that exact row. It is not a failure and must not be presented as a pass. [1]

## Direct answers to the requested checks

### Module 5 — Test 5.1

The recorded published-domain M5-01 run **passed exactly**. The actual entered values were: project value **K1,595,900.00**; trigger **5%**; cap **20%**; floor **-10%**; cement **850 @ K185.00 / K215.00**; reinforcement steel **18 @ K16,800.00 / K18,900.00**; diesel **12,500 @ K28.50 / K29.75**; and aggregate **2,400 @ K325.00 / K385.00**. The exported PDF displayed all four material rows and **Net Payable Escalation: K145,317.50**. This matched the gate exactly. [2]

However, the exact scenario has **not been re-run on a second day** in the current evidence set. Thus, **5.1 is a recorded PASS**, while **5.13 remains NOT RUN**. I cannot honestly call it “reconfirmed on a different day” until that second real production run is made.

### Module 2 — Tests 2.2 to 2.4

There is **no recorded production-domain result** for the requested over-certification case (2.2), exact-boundary case (2.3), or negative-work/deduction case (2.4). They are **NOT RUN**, not passes and not failures. The real IPC run that is recorded was a normal, below-contract-sum certificate: contract **K850,000.00**, previous certified **K210,000.00**, current-period gross value **K125,500.00**, zero deductions, and a 14-day term. It produced cumulative value **K335,500.00**, issue date **2026-08-20**, and payment due **2026-09-03 (14 days)** with no over-certification warning. That supports **2.1** only. [2]

## Status summary

| Status | Rows | Meaning |
|---|---:|---|
| PASS | 5 | A comparable real production run and actual observed output are recorded. |
| PASS after fix | 1 | The original real run failed, a documented repair was deployed, and a follow-up production run passed. This row is included in the five PASS rows. |
| PARTIAL | 11 | Related real evidence exists, but it does not meet every condition in the requested row. |
| NOT RUN | 88 | No exact production-domain input/output record exists for the row. |
| Total | 104 | All supplied module and cross-module rows are listed below. |

> **Important:** Automated unit tests and build checks are valuable regression evidence, but this document does not use them to turn an unexecuted production stress row into a PASS. The full suite is therefore **not complete**. [1]

## Module 1 — Bid Package Builder

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| 1.1 | Mid-size drainage, aligned budget | **Input:** Chimwemwe, Kitwe; 300 m reinforced-concrete U-drain; 2 culverts; excavation, bedding, backfill, compaction, traffic management; 14-day mobilisation; budget **K1,250,000.00**. **Output:** repaired PDF contained ZMW BOQ, tender cover letter, drawings/technical-reference checklist, submission date, and no user-visible placeholders. | **PASS after fix** |
| 1.2 | Budget far below scope cost | No production input/output recorded. | **NOT RUN** |
| 1.3 | Budget far above scope cost | No production input/output recorded. | **NOT RUN** |
| 1.4 | Very small project | No production input/output recorded. | **NOT RUN** |
| 1.5 | Large 35+ line-item, multi-phase project | No production input/output recorded. | **NOT RUN** |
| 1.6 | Mixed discrete/continuous units | No production input/output recorded. | **NOT RUN** |
| 1.7 | Required fields only | No production input/output recorded. | **NOT RUN** |
| 1.8 | Ambiguous project type | No production input/output recorded. | **NOT RUN** |
| 1.9 | Full currency formatting | No production input/output recorded. | **NOT RUN** |
| 1.10 | ZPPA structure | Recorded 1.1 output included tender cover letter, BOQ, and drawings checklist, but no formal comparison to the official small-works template was recorded. | **PARTIAL** |
| 1.11 | Repeat 1.1 twice | One repaired production output is recorded; no second identical-input run and comparison is recorded. | **NOT RUN** |
| 1.12 | Deliberate API failure | The initial Chimwemwe request timed out; its single retry completed. Form-data preservation and the exact throttle/airplane-mode message were not recorded for this run. | **PARTIAL** |
| 1.13 | Rapid double-click Generate | No production double-click observation recorded. | **NOT RUN** |
| 1.14 | Refresh during form fill | Browser-local persistence exists, but no exact production refresh test with recorded values is available. | **PARTIAL** |
| 1.15 | K150m+ contract | No production input/output recorded. | **NOT RUN** |

## Module 2 — Interim Payment Certificate

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| 2.1 | Normal mid-project certificate | **Input:** contract **K850,000.00**; previous **K210,000.00**; current gross value **K125,500.00**; deductions **K0.00**; 14 days. **Output:** four lines of **K50,000/K15,000**, **K100,000/K60,000**, **K40,000/K30,500**, **K20,000/K20,000**; cumulative **K335,500.00**; issue **2026-08-20**; due **2026-09-03 (14 days)**; no over-certification warning. | **PASS** |
| 2.2 | Cumulative exceeds contract sum | No production input/output recorded for contract K500,000 / previous K480,000 / this period K50,000, or another over-limit case. | **NOT RUN** |
| 2.3 | Cumulative exactly equals contract sum | No production input/output recorded. Warning behavior at equality is unknown. | **NOT RUN** |
| 2.4 | Negative value of work | No production input/output recorded. Deduction/refund presentation is unknown. | **NOT RUN** |
| 2.5 | Sparse required fields | No production input/output recorded. | **NOT RUN** |
| 2.6 | 0% retention | No production input/output recorded. | **NOT RUN** |
| 2.7 | 25% retention | No production input/output recorded. | **NOT RUN** |
| 2.8 | First certificate, previous zero | No production input/output recorded. | **NOT RUN** |
| 2.9 | Very high value with decimals | No production input/output recorded. | **NOT RUN** |
| 2.10 | Repeat identical input | No production repeat-run output recorded. | **NOT RUN** |
| 2.11 | Near contract-sum line-item quality | No production input/output recorded. | **NOT RUN** |
| 2.12 | Normal-range line-item quality | The four-line normal IPC schedule is recorded under 2.1, but this exact named comparison test was not separately executed. | **PARTIAL** |
| 2.13 | Certificate sequence | No production input/output recorded. Tool does not have recorded automatic carry-forward evidence. | **NOT RUN** |
| 2.14 | Repeat payment due date | One run produced **2026-09-03 (14 days)** from issue date **2026-08-20**; no second identical run is recorded. | **PARTIAL** |
| 2.15 | Deliberate API failure | No IPC-specific production failure output recorded. | **NOT RUN** |
| 2.16 | Double-click Generate | No production double-click observation recorded. | **NOT RUN** |
| 2.17 | Long client/project name | No production input/output recorded. | **NOT RUN** |
| 2.18 | Blank Work Completed | No production input/output recorded for this exact UI validation case. | **NOT RUN** |

## Module 3 — Variation Order and EOT Claims

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| 3.1 | Variation only | No production input/output recorded. | **NOT RUN** |
| 3.2 | EOT only | No production input/output recorded. | **NOT RUN** |
| 3.3 | Combined cost and EOT | **Input:** Chimwemwe culvert replacement variation **K236,480.00** and EOT **7 days**. **Output:** PDF claim-item table, revised contract value, justification, and requested action consistently showed **K236,480.00** and **7 days**; status remained Proposed. | **PASS** |
| 3.4 | Zero-day EOT plus cost | No production input/output recorded. | **NOT RUN** |
| 3.5 | 180+ day impact | No production input/output recorded. | **NOT RUN** |
| 3.6 | Eight-figure cost impact | No production input/output recorded. | **NOT RUN** |
| 3.7 | Multiple-claim reconciliation | No production input/output recorded. | **NOT RUN** |
| 3.8 | Revised date changes on EOT | The observed seven-day claim had a recorded time impact, but original/revised date values were not preserved in the evidence register. | **PARTIAL** |
| 3.9 | Thin delay description | No production input/output recorded. | **NOT RUN** |
| 3.10 | Detailed delay description | No production input/output recorded. | **NOT RUN** |
| 3.11 | Contractual basis blank vs stated | No production input/output recorded. | **NOT RUN** |
| 3.12 | Repeat combined claim | No production repeat-run output recorded. | **NOT RUN** |
| 3.13 | Negative cost impact | No production input/output recorded. | **NOT RUN** |
| 3.14 | Deliberate API failure | No Module 3-specific production failure output recorded. | **NOT RUN** |
| 3.15 | Double-click Generate | No production double-click observation recorded. | **NOT RUN** |

## Module 4 — NCC Grade Upgrade Portfolio

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| 4.1 | Portfolio meets target grade | No production evidence of an explicit grade-eligibility pass/warning decision recorded. | **NOT RUN** |
| 4.2 | Portfolio does not meet grade | No production input/output recorded. | **NOT RUN** |
| 4.3 | Exact eligibility boundary | No production input/output recorded. | **NOT RUN** |
| 4.4 | Two high-value projects | **Input:** projects **K125,000,000.55** and **K88,900,000.00**. **Output:** project table and portfolio total each showed **K213,900,000.55** exactly; target grade, category, completion references, evidence status, and ZMW formatting were consistent. | **PASS** |
| 4.5 | Single project | No production input/output recorded. | **NOT RUN** |
| 4.6 | 10+ projects | No production input/output recorded. | **NOT RUN** |
| 4.7 | Nine-figure individual value | No production input/output recorded. | **NOT RUN** |
| 4.8 | Evidence references for all | Two-project evidence references were recorded as consistent, but no every-project verification beyond that scenario was recorded. | **PARTIAL** |
| 4.9 | Missing evidence reference | No production input/output recorded. | **NOT RUN** |
| 4.10 | Multi-level grade jump | No production input/output recorded. | **NOT RUN** |
| 4.11 | Low operating years/high grade | No production input/output recorded. | **NOT RUN** |
| 4.12 | Repeat identical portfolio | No production repeat-run output recorded. | **NOT RUN** |
| 4.13 | Long/special names | No production input/output recorded. | **NOT RUN** |
| 4.14 | Deliberate API failure | No Module 4-specific production failure output recorded. | **NOT RUN** |
| 4.15 | Double-click Generate | No production double-click observation recorded. | **NOT RUN** |

## Module 5 — Escalation Clause Builder

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| 5.1 | Exact four-material baseline | **Input:** project **K1,595,900.00**; trigger **5%**; cap **20%**; floor **-10%**; cement **850 @ K185/K215**; steel **18 @ K16,800/K18,900**; diesel **12,500 @ K28.50/K29.75**; aggregate **2,400 @ K325/K385**. **Output:** four PDF schedule rows with quantity, base/current rates, variance, adjustment; net payable escalation **K145,317.50**. | **PASS** |
| 5.2 | One material above trigger | No production input/output recorded. | **NOT RUN** |
| 5.3 | Below-trigger material | No production input/output recorded. | **NOT RUN** |
| 5.4 | Price decrease past threshold | No production input/output recorded. | **NOT RUN** |
| 5.5 | Increase over 20% cap | No production input/output recorded. | **NOT RUN** |
| 5.6 | Decrease below -10% floor | No production input/output recorded. | **NOT RUN** |
| 5.7 | 10+ material schedule | No production input/output recorded. | **NOT RUN** |
| 5.8 | Mixed override/reference rates | No production input/output recorded. | **NOT RUN** |
| 5.9 | Unknown material/no override | No production input/output recorded. | **NOT RUN** |
| 5.10 | Zero quantity line | No production input/output recorded. | **NOT RUN** |
| 5.11 | 10,000+ tonnes | No production input/output recorded. | **NOT RUN** |
| 5.12 | Custom 1% parameters | No production input/output recorded. | **NOT RUN** |
| 5.13 | 5.1 on a second day | No second-day production input/output recorded. | **NOT RUN** |
| 5.14 | Dates seven days apart | No production input/output recorded. | **NOT RUN** |
| 5.15 | Dates five+ years apart | No production input/output recorded. | **NOT RUN** |
| 5.16 | Deliberate API failure | No Module 5-specific production failure output recorded with retained full material schedule. | **NOT RUN** |
| 5.17 | Double-click Generate | No production double-click observation recorded. | **NOT RUN** |

## Module 6 — Site Inspection and Defect Log

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| 6.1 | Single inspection item | **Input:** one major honeycombing defect at **CH 0+450**. **Output after repair:** High severity, Contractor responsibility, close-out **2026-06-17**, evidence `IMG-CH0450-01`, and dedicated Corrective Action Register. The flashcard-flow detail was not separately recorded. | **PARTIAL** |
| 6.2 | Eight items | No production input/output recorded for eight items. | **NOT RUN** |
| 6.3 | Fifteen items | No production input/output recorded. | **NOT RUN** |
| 6.4 | Twenty items | No production input/output recorded. | **NOT RUN** |
| 6.5 | Twenty-five items | No production input/output recorded. | **NOT RUN** |
| 6.6 | All compliant | No production input/output recorded. | **NOT RUN** |
| 6.7 | All critical | No production input/output recorded. | **NOT RUN** |
| 6.8 | Mixed severities | No production input/output recorded. | **NOT RUN** |
| 6.9 | Severity-based due dates | One High-severity due date was observed, but no comparative severity set was executed. | **PARTIAL** |
| 6.10 | Sparse descriptions | No production input/output recorded. | **NOT RUN** |
| 6.11 | Detailed measurements | No production input/output recorded. | **NOT RUN** |
| 6.12 | Mixed quantity units | No production input/output recorded. | **NOT RUN** |
| 6.13 | Missing quantity | No production input/output recorded. | **NOT RUN** |
| 6.14 | 15+ item multi-page PDF | No production input/output recorded. | **NOT RUN** |
| 6.15 | Deliberate API failure | No Module 6-specific production failure output recorded. | **NOT RUN** |
| 6.16 | Double-click Generate | No production double-click observation recorded. | **NOT RUN** |

## Cross-module safety-valve rows

| ID | Requested scenario | Actual input and output observed | Status |
|---|---|---|---|
| S.1 | Offline mid-generation | No real offline/airplane-mode production result recorded. | **NOT RUN** |
| S.2 | Slow/hanging 30–45+ seconds | A controlled capacity/timeout recovery was observed in other evidence, but no timed 30–45+ second production trace and exact screen progression is recorded. | **PARTIAL** |
| S.3 | Refresh during form fill | Browser-local restoration is implemented and earlier pilot checks are recorded, but no exact current-suite production input/output record exists. | **PARTIAL** |
| S.4 | Navigate away with unsaved changes | No production browser-warning observation recorded. | **NOT RUN** |
| S.5 | Successful generation confirmation/re-download | Successful PDFs and separate export actions are recorded, but no exact “PDF is ready” confirmation and re-download test is recorded. | **NOT RUN** |
| S.6 | Loading under one second | No timed production observation recorded. | **NOT RUN** |
| S.7 | Loading 1–10 seconds | No timed production observation recorded. | **NOT RUN** |
| S.8 | Loading 10+ seconds | No timed production observation recorded. | **NOT RUN** |

## Actual failures found and repaired

| Module | Original real failure | Known defect pattern | Repair and follow-up real result |
|---|---|---|---|
| CD-01 / 1.1 comparable scenario | Initial live PDF showed **“[none / bidder to state]”** and **“Bidder completion required”** placeholders, and omitted a distinct cover letter and drawings list. | **Field mislabeling / wrong semantic content** (Pattern 5), plus document-completeness failure. It was not a calculation error. | Added deterministic tender cover-letter and drawings/technical-reference sections while avoiding invented drawing details. Follow-up live PDF contained the required sections and no visible placeholders: **PASS after fix**. [2] |
| CD-06 / 6.1 comparable scenario | Initial live PDF recorded responsibility as **“To be assigned”** and did not render corrective action as a dedicated register field. | **Field mislabeling / wrong semantic type** (Pattern 5). It was not a quantity, date, or arithmetic error. | Defaulted unresolved responsibility to Contractor when provided and added the Corrective Action Register. Follow-up PDF showed Contractor, action, date, and evidence: **PASS after fix**. [2] |

## Non-blocking observation

The exported-PDF text extractor reported three pages for several recorded documents while the visible document footer identified two pages. The visible PDFs reviewed did not show a blank or clipped page, so this was not classified as a calculation/content failure. It remains an export-quality check for the full stress run, particularly for 1.5, 5.7, and 6.14. [2] [3]

## What this means now

The evidence **confirms the exact recorded M5 5.1 result of K145,317.50** and the normal IPC 2.1 result of K335,500.00. It does **not** confirm IPC 2.2–2.4, a second-day M5 5.13 run, or the rest of the full matrix. The next honest milestone is to execute the remaining 96 untested rows on the published domain with the actual inputs, captured output values, and exported-PDF checks required by the supplied suite. Until then, the product is suitable for the stated controlled pilot but the full stress suite remains incomplete. [1]

## References

[1]: /home/ubuntu/upload/pasted_content_3.txt "User-supplied Final Pre-Handoff Stress Test Suite"
[2]: ./pilot_validation_evidence.md "CivilDocs Pilot Validation Evidence"
[3]: ./CivilDocs_Pilot_Validation_Report.md "CivilDocs Pilot Validation Report"

