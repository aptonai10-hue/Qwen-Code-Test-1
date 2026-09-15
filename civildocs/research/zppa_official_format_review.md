# ZPPA Official Works-Format Review

## Official source captured

The ZPPA Procurement Legislation & Standard Bidding Documents catalogue lists **Standard Bidding Documents — Procurement of Small Works (Open National Bidding), August 2012** and **Standard Bidding Documents — Procurement of Works (Open International Bidding), August 2012**. The Small Works document was downloaded directly from ZPPA on 2026-08-16 and retained locally at `/home/ubuntu/Downloads/SBD_SMALL_WORKS_OPEN_NATIONAL_BIDDING.doc` for review.

| Source | Purpose | Accessed |
|---|---|---|
| https://www.zppa.org.zm/procurement-legislations-and-handbooks | Official ZPPA standard-bidding-document catalogue | 2026-08-16 |
| https://www.zppa.org.zm/documents/20182/21181/SBD_SMALL_WORKS_OPEN_NATIONAL_BIDDING.doc/5de00be9-3d3e-437b-a699-9a3c9ad7709e?version=1.0 | Official ZPPA Small Works (Open National Bidding) document | 2026-08-16 |

## Required document architecture observed

The official Small Works template distinguishes the **complete procuring-entity bidding document** from the **bidder’s submission**. Its top-level structure is:

1. **Part 1 — Bidding Procedures:** Instructions to Bidders; Bid Data Sheet; Evaluation and Qualification Criteria; Bidding Forms; Eligible Countries.
2. **Part 2 — Employer’s Requirements:** specifications, drawings, and supplementary information.
3. **Part 3 — Conditions of Contract and Contract Forms:** General Conditions; Particular Conditions/Contract Data; Contract Forms.

The bidder-facing requirements include a Letter of Bid and schedules, bid price and discounts, a technical proposal, qualification documents, bid validity, bid security where required, and signed submission materials. The document explicitly describes both admeasurement/unit-rate BOQ contracts and lump-sum activity-schedule contracts.

## Initial CivilDocs implication

CivilDocs Module 1 is a contractor-side **bid-package preparation aid**, not a replacement for the procuring entity’s complete ZPPA solicitation. The compliance cross-check will therefore distinguish: (a) bidder-submission sections that Module 1 should generate; (b) employer-issued sections that the tool should reference but never fabricate; and (c) the priced BOQ / activity schedule structure the tool can render.

## Bidder-submission requirements found in the template

The official Small Works template requires a bidder submission to include a Letter of Bid; completed schedules (including the BOQ or schedules of prices); bid security or bid-securing declaration where the Bid Data Sheet requires it; signatory authority; qualification evidence; a technical proposal; JV documentation where applicable; and any BDS-specified documents. It states that required Section IV forms must be completed without altering their text.

For a unit-rate/admeasurement contract, the bidder must enter rates and prices for all BOQ items. Its technical proposal must cover **work methods, equipment, personnel, schedule**, and any required Section IV information. The published Technical Proposal form headings specifically include **Personnel, Equipment, Site Organization, Method Statement, Mobilization Schedule, Construction Schedule, and Others**. The template also carries qualification forms for bidder information, JV parties, contract non-performance, work in progress, financial position, annual turnover, financial resources, general and specific experience, personnel, and equipment.

## Current ZPPA bidder guidance

ZPPA’s current public `Basics in bidding` guidance says bidders should read the document in full, pay particular attention to the Instructions to Bidders/data sheet, conditions of contract, and specifications/delivery schedules; isolate mandatory requirements; prepare an orderly bid in the required format with supporting documents; include a covering letter and contents listing; and counter-check against a checklist before submission.

| Source | Key guidance captured | Accessed |
|---|---|---|
| https://www.zppa.org.zm/basics-in-bidding | Review tender documents in full; identify mandatory requirements; use the required format and supporting documents; include a covering letter, contents list, and submission checklist | 2026-08-16 |

## Confirmed Module 1 gaps before correction

| Official bidder requirement | Current CivilDocs state | Required correction |
|---|---|---|
| Letter of Bid using employer-issued particulars | Only a short tenderer-confirmation signature block | Render a clearly marked bidder-completion Letter of Bid checklist/form with tender identifiers, validity, discount, representative, declarations, and signatory fields; never invent employer/BDS particulars. |
| Contents list and submission checklist | Absent | Add an ordered bidder-package contents page and a mandatory-documents/attachments checklist. |
| Technical proposal: personnel, equipment, site organization, method statement, mobilisation and construction schedules | Only executive summary, methodology, and generic qualifications | Expand the data contract and PDF to all official technical-proposal headings, using bidder-provided or clearly marked completion-required content. |
| Qualification evidence and attachments | Generic qualifications narrative only | Add a cross-reference checklist for qualification forms and evidence without fabricating financial, experience, personnel, equipment, or JV evidence. |
| BOQ schedules and total bid price / discounts | BOQ is present; price summary automatically adds contingency and VAT | Preserve the BOQ, but distinguish total measured works, optional discounts, and tender price. State that rates/prices must include taxes/levies as required by the employer-issued document; do not imply that fixed contingency/VAT lines are universally part of the employer’s form. |

