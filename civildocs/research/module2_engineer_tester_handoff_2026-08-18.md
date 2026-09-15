# CivilDocs Module 2 — Engineer Tester Handoff

**Release:** Professional Module 2 update, checkpoints `0ea5d7ed` and `14fdd132`  
**Module:** CD-02 — Interim Payment Certificate  
**Test audience:** Civil engineers, quantity surveyors, contract managers, and contractor commercial teams  
**Test URL:** [CivilDocs production](https://civildocs-zuztwkvm.manus.space/)

> **Purpose.** CivilDocs prepares a reviewable valuation and certification **draft** from user-supplied information. It is not an inspection record, Engineer’s determination, payment authorisation, tax calculation, or substitute for the signed contract, Particular Conditions, approved variations, measurement sheets, or professional judgement. Zambian public-works contract administration requires competent monitoring, sound record keeping, and contract-specific payment administration.[1] [2]

## What changed in this release

| Area | Tester-visible behaviour |
|---|---|
| Contract traceability | The form captures an Employer / Procuring Entity, Contractor, Engineer / Contract Manager / Certifier, certificate number, valuation period, and Contractor Statement / Application Reference. |
| Contract-specific dates | The user enters the payment term in days. The certificate calculates Payment Due from the document date; it no longer implies that 14 days is universally applicable. |
| Contract limit | Original Contract Sum plus Approved Variation / Adjustment produces an Adjusted Contract Sum. Cumulative valuation above this limit creates a visible warning before and after review. |
| Deductions | Current retention, a retention cap, advance-payment recovery, statutory deductions, and other contract deductions are separately calculated and exposed before the net amount. |
| Evidence trail | An optional supporting-record register is included in the PDF for the certifier to verify. |
| Certification roles | The PDF separates contractor submission, authorised Engineer / Contract Manager certification, and Employer payment authorisation where separately required. |
| Review control | Gemini-proposed valuation lines are reviewed one at a time. A PDF is generated only after confirmation. |

## Verified acceptance cases

| Case | Inputs / expected result | Published result |
|---|---|---|
| **IPC-15: normal valuation, term and deductions** | Original K9,850,000.00 + K650,000.00 approved variation = K10,500,000.00 adjusted sum; previous K9,100,000.00; current K780,000.00; 28 days; retention K78,000.00; advance recovery K50,000.00; statutory K12,000.00; other K5,000.00. | Four review lines. Cumulative K9,880,000.00; total deductions K145,000.00; net K635,000.00; due date 2026-09-15. Two-page PDF verified. |
| **IPC-16: 105% limit boundary** | Original and adjusted sum K500,000.00; previous K480,000.00; current K50,000.00; 14 days. | The form, review summary, and PDF all show a K30,000.00 contract-limit warning. Net amount is K45,000.00 after 10% retention. |
| **IPC-17: negative adjustment** | K35,000.00 measured works less K18,500.00 recovery; entered current gross valuation K16,500.00; previous K1,200,000.00; 28 days. | A dedicated `Recovery of IPC-16 Overpayment` row remains K-18,500.00 through review and PDF. Cumulative is K1,216,500.00 and net is K15,675.00 after 5% retention. |
| **Invalid retention-cap data** | Retention held before the certificate K60,000.00 with a K50,000.00 cap. | Generation is blocked before any AI call with an explicit data-consistency message. |

## Suggested reviewer walkthrough

Begin with a contract for which you know the signed contract sum, payment provision, certificate history, variation status, retention rules, and measurement records. Enter the information exactly as it appears in the project records. Keep the supporting-record field concise but traceable: statement reference, measurement sheets, site records, variation approval, recovery schedule, and material-on-site records as applicable.

When the valuation cards appear, test whether the line descriptions are commercially meaningful and whether their Previous Certified, Current-Period Valuation, and Cumulative Valuation reconcile to the source record. Edit an item where necessary; the summary should recalculate before the PDF is generated. Then compare the PDF against your own project record, not against an assumed generic FIDIC term. Payment periods and statement-support requirements can be modified by Particular Conditions and Contract Data.[3]

| Review question | Expected answer / escalation trigger |
|---|---|
| Does the output distinguish the contractor’s statement from the certifier’s role? | Yes. Escalate if it appears to assert inspection, approval, or payment authority that the user has not completed. |
| Does the current valuation reconcile exactly to the reviewed line items? | Yes. Escalate any difference of even K0.01. |
| Is the cumulative amount tested against the correct adjusted contract sum? | Yes. Confirm the approved variation entered is genuinely approved and belongs in the limit. |
| Are retention, recovery, statutory, and other deductions contractually appropriate? | The arithmetic is explicit; the contractual basis must be confirmed by the reviewer. Escalate missing or misleading categories. |
| Is the Payment Due date correct? | It must equal the local document date plus the entered contract term. Escalate if the term or calendar result does not match. |
| Is a negative adjustment labelled as a recovery or correction rather than disguised as work? | Yes. Escalate semantic ambiguity or a positive/negative sign error. |

## Operational limits and safe use

The secured server-side Gemini integration can occasionally return a temporary-capacity, timeout, or empty-content response. The form stays editable and provides a retry option; an empty successful reply is now described as `AI returned no usable content. Please retry the same certificate.` Do not alter figures simply to obtain an AI response. Preserve the statement, supporting documents, and measurements as the source of truth.

Form data remains in browser memory for the current session. Download the reviewed PDF and preserve it under the project’s normal document-control process. CivilDocs does not store, inspect, approve, submit, or pay a certificate on the user’s behalf.

## Reviewer feedback record

Please record feedback against the following fields so fixes can be reproduced precisely.

| Field | Record |
|---|---|
| Project type / contract form | |
| Scenario used | |
| Exact values entered | |
| Expected commercial or contractual treatment | |
| Actual review / PDF behaviour | |
| Page and line-item reference | |
| Severity: blocking / material / usability / wording | |
| Screenshot or redacted PDF reference | |

## References

[1] [International Bar Association — *The FIDIC Pink Book and public procurement legislation, Zambia*](https://www.ibanet.org/country-updates-clint-june-2023-zambia)  
[2] [Munga, L. & Mwiya, B. — *Development of a public road works contract management framework for the Zambian construction industry*](https://scielo.org.za/scielo.php?script=sci_arttext&pid=S2959-96522024000100003)  
[3] [FIDIC .uz — *Clause 14: Contract Price and Payment*](https://fidic.uz/en/clauses/payment-14/)

