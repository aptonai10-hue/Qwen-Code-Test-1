# CivilDocs Pilot Validation Report

**Project:** CivilDocs Contractor Toolkit  
**Validation date:** 20 August 2026  
**Published version:** `ce5ad4d2`  
**Validation basis:** Automated regression suite, production-browser workflows, and downloaded PDF inspection.

## Executive Summary

CivilDocs completed the priority pilot validation across its six document modules. The live production application generated and downloaded the selected test PDFs, and the confirmed arithmetic, dates, data fields, and document content matched the applicable pilot gates. Two document-quality defects were found during live validation: user-visible placeholders and missing tender sections in the bid package, plus unresolved ownership and an absent dedicated action field in the defect log. Both defects were corrected, regression-tested, redeployed, and revalidated against the published site.

> **Scope note:** This report records the completed priority-gate and cross-module spot-check results. It is not a claim that every case in the wider 90-test pack has been individually executed.

| Outcome | Result |
|---|---:|
| Priority live module workflows validated | 6 of 6 |
| Confirmed live PDF defects found | 2 |
| Confirmed live PDF defects repaired and revalidated | 2 of 2 |
| Automated test files passed | 32 |
| Automated tests passed | 135 |

## Validation Method

Each selected workflow was completed in the published CivilDocs application at `civildocs-zuztwkvm.manus.space`. Inputs were entered into the live form, generated entries were reviewed where the module required a review step, and the resulting PDF was downloaded and inspected for its stated acceptance criteria. The automated suite was then run after the code repairs, followed by a production build check.

## Live Validation Results

| Module | Scenario and acceptance gate | Result | Evidence observed |
|---|---|---|---|
| **CD-01 Bid Package Builder** | Chimwemwe Emergency Drainage Works bid package; requires ZMW pricing, a cover letter, drawings list/checklist, a stated submission date, and no user-visible placeholders | **Passed after repair** | The revalidated PDF contains a distinct **Tender Cover Letter**, **Drawings and Technical Reference Checklist**, ZMW BOQ, stated submission date, and no bracketed or “bidder completion required” placeholder copy. |
| **CD-02 Interim Payment Certificate** | 2026 date check and normal valuation arithmetic; expected cumulative valuation **K335,500.00** | **Passed** | The PDF displayed issue date **2026-08-20**, payment due **2026-09-03 (14 days)**, and cumulative valuation **K335,500.00** with a reconciled four-line valuation schedule. |
| **CD-03 Variation & EOT Claims** | Combined culvert-replacement variation and EOT; expected variation **K236,480.00** and a seven-day extension | **Passed** | The PDF reconciled the cost impact and the seven-day time impact across the reviewed claim items. |
| **CD-04 NCC Grade Upgrade Portfolio** | Two-project portfolio total; expected value **K213,900,000.55** | **Passed** | The PDF showed the supplied two-project record and the exact expected portfolio value. |
| **CD-05 Escalation Clause Builder** | M5-01 four-material baseline; expected net payable escalation **K145,317.50** | **Passed** | The schedule visibly included all four materials and the reconciliation showed **K145,317.50**. |
| **CD-06 Site Inspection & Defect Log** | Major honeycombing defect at CH 0+450; requires location, severity, responsibility, corrective action, due date, and evidence/photo reference | **Passed after repair** | The final PDF displays CH 0+450, High severity, **Contractor** responsibility, due date **2026-06-17**, evidence reference `IMG-CH0450-01`, and a dedicated **Corrective Action Register** with the engineer-approved repair action. |

## Defects Found and Corrective Actions

### CD-01 Bid Package Builder

The initial live PDF included user-visible placeholders such as “bidder completion required” and did not provide distinct tender cover-letter or drawings-list sections. This did not meet the stated M1-01 document-completeness gate.

The repair introduced deterministic bid-package content, including a complete tender cover letter, a drawings and technical-reference checklist, personnel, equipment, mobilisation, construction-schedule, and qualification-evidence guidance. The text is designed to avoid pretending that an unprovided drawing reference or tender fact exists. The repaired production PDF passed the same live test.

### CD-06 Site Inspection & Defect Log

The initial live PDF had the correct location, severity, evidence reference, and date, but showed responsibility as “To be assigned” and did not render the corrective action as a dedicated defect-register field. This did not meet the M6-02 requirement for clear accountability and action tracking.

The repair now defaults unresolved defect ownership to **Contractor** when a contractor is supplied in the source form. It also adds a separate **Corrective Action Register** to the inspection PDF, containing the location, severity, responsible party, corrective action, due date, and evidence reference. The repaired live PDF passed revalidation.

## Automated Verification

The post-repair automated regression suite completed successfully.

| Check | Result |
|---|---|
| `pnpm test` | **32 test files passed; 135 tests passed** |
| `pnpm build` | **Completed successfully** |
| Inspection normalisation regression | Confirms unresolved responsibility becomes **Contractor** when a contractor is provided, while preserving the action, date, and evidence reference. |
| Bid-package regression | Confirms the generated support content includes required sections and avoids placeholder language. |

## Remaining Observations and Recommended Next Steps

The PDF text extractor reported a page count that was one greater than the visible footer count for several generated PDFs. The visible PDF content and footers did not show a corresponding blank or clipped page in the reviewed outputs, so this was treated as a non-blocking export-quality observation rather than a calculation or content failure. It should nevertheless be investigated during the full test-pack execution.

The next testing increment should convert the remaining unexecuted cases in the 90-test pack into deterministic browser and PDF-text checks. In particular, expand boundary, negative, recalculation, and layout assertions for all six modules, and add automated verification for the observed PDF pagination metadata.

## Published Deliverable

The repairs and this evidence record are included in published CivilDocs checkpoint **`ce5ad4d2`**.

