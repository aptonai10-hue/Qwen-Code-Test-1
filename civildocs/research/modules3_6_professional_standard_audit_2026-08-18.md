# CivilDocs Modules 3–6 Professional-Standard Audit

**Scope:** Variation & EOT Claims (CD-03), NCC Grade Upgrade Portfolio (CD-04), Escalation Clause Builder (CD-05), and Site Inspection & Defect Log (CD-06).  
**Release target:** A single pre-demo package suitable for review by experienced Zambian civil engineers, quantity surveyors, contract managers, and contractor commercial teams.  
**Current status:** Source-led acceptance matrix created; implementation and production acceptance remain in progress.

## Professional baseline

CivilDocs must prepare reviewable drafts rather than represent an Engineer’s determination, statutory approval, procurement approval, payment authorisation, or legal advice. The Zambia public-works context is contract-specific: the Public Procurement Act and Regulations are read with approved standard forms, and the Engineer / Contract Manager’s responsibilities include documentation, contract administration, variations, payment obligations, and records.[1] The Zambian public-road contract-management research identifies qualified and experienced monitoring personnel, adequate funding, and enhanced record keeping as critical success factors.[2]

For public works, variations must be treated as approval-controlled contract events rather than merely arithmetic changes. The Zambia-focused legal commentary describes written variation/amendment controls and a cumulative variation threshold of 25% of original contract price in the cited statutory context.[1] CivilDocs should therefore distinguish **proposed**, **recommended**, **approved**, and **implemented** changes, and must not silently treat an unapproved variation as an approved contract value.

## Shared acceptance matrix

| Control | CD-03 Variation / EOT | CD-04 NCC Portfolio | CD-05 Escalation | CD-06 Inspection / Defects |
|---|---|---|---|---|
| Source traceability | Event notice, instruction, cause, records, submission date, contract reference. | NCC grade/category, project certificates, completion evidence, client references, statutory/company records. | Contract base date, index/rate source, material, unit, quantity, base/current rate, formula and effective period. | Project, inspection date, location/chainage, observer, drawing/specification reference, observation evidence. |
| Role accuracy | Contractor notice, Engineer/Contract Manager assessment, Employer approval; no automatic approval. | Contractor application evidence versus NCC decision; no claim that the tool grants a grade. | Contractor/Employer risk allocation and certifier/quantity-surveyor review; no universal entitlement. | Inspector observation versus contractor corrective action and Engineer acceptance; no claim that AI verified site conditions. |
| Calculated values | Original/revised contract sum, variation amount/percentage, EOT days, original/revised completion date. | Exact project-value reconciliation, grade eligibility conditions, missing-evidence warnings. | Transparent escalation formula, base/current rates, quantities, indices, date basis, and rounding. | Practical affected quantities, severity/status mapping, due dates where provided, and item counts. |
| Boundaries | Variation threshold warning, zero-day Variation-only, zero-cost EOT-only, overlapping/duplicate events. | Grade-specific project count/value boundary and incomplete portfolio evidence. | Missing index, unmatched material, negative or zero quantity, base-date ambiguity, and user override. | 20–25 large-count handling, invalid severity, zero/negative quantity, duplicate observations, and critical defects. |
| Review control | One claim card at a time; edit before PDF. | Project-by-project evidence review before final portfolio PDF. | Material/rate schedule review before final clause PDF. | Observation-by-observation review before final log PDF. |
| PDF quality | Claim chronology, entitlement basis, calculation, notice/support record, and reservations. | Company profile, project evidence, reconciliation, eligibility warning, and supporting-document checklist without empty misleading headings. | Clause, schedule, assumptions, sources/overrides, formula, effective date, and limitations. | Register fields, severity colours, status, responsibility, target date, evidence, and page readability. |
| Safe-use wording | Draft / subject to contract and approval. | Application-support portfolio, not NCC approval or guaranteed upgrade. | Commercial drafting aid, not an automatic entitlement or index determination. | Site record draft, not a substitute for inspection, testing, or Engineer acceptance. |

## Module audit plan and current baseline

### CD-03 — Variation & EOT Claims

The existing evidence covers combined Variation/EOT, Variation-only, and EOT-only published PDFs with date arithmetic and cost/time separation. The professional audit must now confirm that every claim retains event cause, notice date, instruction/approval status, supporting records, entitlement basis, affected completion milestone, and reservation of rights. A zero-day variation must not create an artificial extension; a zero-cost EOT must not create an artificial monetary claim. The Zambia source baseline requires approval-aware treatment of variations.[1]

### CD-04 — NCC Grade Upgrade Portfolio

The existing evidence covers mixed-value portfolio reconciliation, a single-project Grade 2 boundary warning, and a two-project high-value portfolio. The official NCC website provides the registration and downloadable application route, including the official upgrade form; the downloadable form should remain the primary document to review for current grade/category and evidence fields.[3] The audit must ensure that the PDF labels evidence as an application portfolio, distinguishes completed-project proof from recommendations, does not promise an NCC outcome, and warns when grade-specific project count/value or supporting evidence is insufficient.

### CD-05 — Escalation Clause Builder

The existing evidence covers 12-material schedules, unmatched-material fallback, and user-provided Diesel K29.75/litre and Aggregate K385.00/m³ overrides with explicit source labels. The audit must ensure that every adjustment states its base date, effective date, rate/index source, unit, quantity basis, formula, rounding, and party risk allocation. A missing or unmatched index must be visible as an assumption or verification item rather than replaced with an unrelated rate. Price escalation is a contract mechanism whose entitlement depends on the agreed clause and source data, not a universal percentage.

### CD-06 — Site Inspection & Defect Log

The existing evidence covers 15-, 20-, and 25-observation published PDFs and preserves Low, Medium, High, and Critical severity semantics. The audit must ensure each observation remains an observation rather than an asserted finding of fact, with location, specification/drawing reference, evidence, responsible party, corrective action, target date, status, and close-out/acceptance fields. Critical and High items require prominent visibility, while severity colours must remain consistent with labels. The tool must not imply that an AI-generated register substitutes for a qualified site inspection.

## Pre-demo acceptance requirements

Each module must pass one normal scenario, one boundary or incomplete-input scenario, and one large/multi-item or source-reconciliation scenario. For every run, the reviewer must compare the entered source values with the review cards, summary, and downloaded PDF. Any difference of K0.01, one calendar day, one item, one unit, one sign, or one role label is a material defect for triage.

The tester package will record the exact scenario, source inputs, expected treatment, actual review/PDF result, page and item reference, severity, and a redacted PDF or screenshot reference. Feedback must identify whether the defect is calculation, source/entitlement, role/wording, boundary handling, review interaction, PDF layout, or operational/retry behaviour.

## References

[1] [International Bar Association — *The FIDIC Pink Book and public procurement legislation, Zambia*](https://www.ibanet.org/country-updates-clint-june-2023-zambia)  
[2] [Munga, L. & Mwiya, B. — *Development of a public road works contract management framework for the Zambian construction industry*](https://scielo.org.za/scielo.php?script=sci_arttext&pid=S2959-96522024000100003)  
[3] [National Council for Construction Zambia — Registration and downloadable forms](https://www.ncc.org.zm/registration/)  
[4] [National Council for Construction Zambia — Official upgrade form (DOCX)](https://www.ncc.org.zm/wp-content/uploads/2021/10/2022-UPGRADE-FORM.docx)

## Code-level gap register — initial audit

The current source and deterministic tests establish a strong reliability baseline, but they do not yet equal a professional contract-administration release across all modules.

| Module | Confirmed gap to address | Why it matters |
|---|---|---|
| CD-03 | The form captures claim type, event, original value/date, cost, time, and reason, but not notice/reference date, instruction/approval status, affected milestone, or supporting records. The prompt and PDF also need explicit proposed/recommended/approved language and a statutory/contract approval caveat. | A variation or EOT claim needs an event chronology, entitlement basis, records, and approval status; a clean arithmetic result alone does not establish entitlement.[1] |
| CD-04 | The form currently collects only company profile, grade, years, staff, equipment, and project name/client/value/year. It does not collect category, certificate/reference evidence, completion evidence, client contact/reference, or document-status fields. Eligibility warnings are limited and the document must clearly remain an application-support portfolio rather than an NCC decision. | NCC upgrade evidence is grade/category and evidence dependent. The official NCC registration page and upgrade form are the controlling sources for current submission fields.[3] [4] |
| CD-05 | Current normalization protects rate-source precedence and unmatched materials, but the clause model does not reliably capture index/source, base and current dates, base/current rates, formula, threshold, cap/floor, notice requirements, or risk allocation. | An escalation clause must be auditable from its contract date basis and agreed mechanism; a material list plus prose is not enough to calculate or administer an adjustment. |
| CD-06 | Current normalization protects practical affected quantities and status/severity labels, but observations lack structured drawing/specification reference, evidence reference, responsible party, target date, close-out date, and acceptance/verification status. | A professional defect register needs ownership and close-out traceability; an AI-generated narrative must not imply that the site was independently inspected or accepted. |

The implementation phase will add only source-preserving fields and warnings; it will not invent contract approvals, NCC certificates, site findings, index values, or entitlement. Existing live evidence remains valid for the behaviours already tested and will be rerun after the upgraded fields are deployed.

