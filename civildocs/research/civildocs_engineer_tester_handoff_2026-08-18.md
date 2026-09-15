# CivilDocs — Six-Engineer Pre-Demo Handoff

**Release context.** CivilDocs is the published Zambian contractor toolkit at [civildocs-zuztwkvm.manus.space](https://civildocs-zuztwkvm.manus.space/). It provides six document workflows for civil-engineering project administration. This handoff is intended for six experienced engineers who will review the product before wider use. The current production release has been reconfirmed through secured public-domain generation, review, PDF download, and file-level reconciliation for Modules 2–6 after the renewed real-world audit.

> **Recommended working principle:** CivilDocs creates a structured engineering draft and performs deterministic reconciliation of the values entered or confirmed by the user. It does not replace the engineer’s contractual, measurement, statutory, or certification judgment. Review the generated draft before issuing it externally.

## Release acceptance summary

| Module | Document workflow | Fresh published acceptance evidence | Review flow | PDF readiness |
|---|---|---|---|---|
| CD-01 | Bid Package Builder | Three live stress scenarios already evidenced: constrained-budget Kanyama BOQ, Mumbwa mixed-unit discounted BOQ, and Chimwemwe municipal-drainage BOQ | One-item BOQ flashcards with editable description, unit, quantity, and rate | Passed in prior published campaign |
| CD-02 | Interim Payment Certificate | Renewed public IPC-15: adjusted contract sum K10,500,000.00; cumulative K9,880,000.00; current deductions K145,000.00; net proposed K635,000.00; 28-day term | Four one-item valuation cards with reconciliation and over-contract warning control | Two-page PDF text checked, including roles, statement reference, due date, deductions, and draft language |
| CD-03 | Variation & EOT Claims | Renewed public combined claim: K180,000.00 variation plus 21-day EOT; instruction `ENG-INS-2026-44`; Recommended status; revised completion 2026-11-05 | Two claim items reviewed individually: cost and time remain separate | Two-page PDF text checked for records, approval warning, K1,860,000.00 revised value, and date calculation |
| CD-04 | NCC Grade Upgrade Portfolio | Renewed public Grade 4 to Grade 2 application-support portfolio with evidence-backed projects at K125,000,000.55 and K88,900,000.00 | Portfolio evidence and eligibility safeguards | Two-page PDF text checked for K213,900,000.55 exact total, evidence, and NCC non-decision language |
| CD-05 | Escalation Clause Builder | Renewed public four-material schedule: total base K1,595,900.00; current K1,818,825.00; raw movement K222,925.00; net payable escalation K145,317.50 | Structured schedule preserves quantity, unit, base/current rate, source, per-line adjustment, threshold/cap/floor logic | Two-page PDF text checked for Cement, steel, Diesel, and aggregate calculations plus reconciliation total |
| CD-06 | Site Inspection & Defect Log | Renewed public Chisamba clinic/access-works inspection with eight items across Critical, High, Medium, Low, Compliant, and Requires Attention states | Eight one-item inspection flashcards; full summary reached 100% | Two-page PDF text checked for quantities, evidence, target dates, close-out state, and safe-use warning |

## What engineers should test

Each tester should select one module and run the normal path with a realistic project. Enter contractual or project facts rather than generic prose. Where the module presents a review screen, inspect every item, use **Change** on at least one item, confirm the summary, and only then generate the PDF. Check that headings, dates, currency, status, and source references match the entered facts.

For Modules 1 and 2, specifically check that quantities are practically purchasable, currency values show two decimals, and the final totals are mathematically reconcilable. For Module 2, test both an ordinary certificate and a cumulative value at or above the contract sum; the warning must be visible and the payment-due date must be calculated from the submitted issue date and payment terms. For Module 3, check that variation and EOT items remain separate, that a zero-cost EOT does not create a false monetary impact, and that notice reference, approval status, milestone, and supporting records are retained. For Module 4, check project-by-project evidence and the target-grade eligibility warning rather than relying only on the headline portfolio value. For Module 5, use a real or anonymised supplier schedule and check each quantity, unit, base/current rate, source, threshold, cap/floor, per-line adjustment, raw movement, and net payable total. For Module 6, check severity, status, affected quantity, action required, due date, evidence references, close-out state, and verifier; confirm that critical and high items remain visibly distinct from compliant items.

## Known release safeguards

The Gemini credential is held server-side behind the secured proxy; no client-side API key is used. Upstream model requests have bounded timeouts and a stable-model fallback. Temporary capacity responses are translated into a retryable user message instead of leaving the form in an indefinite loading state. Basic per-IP throttling and lightweight request metrics are active. Currency display uses exactly two decimal places across the professional modules. Dates are generated from the current browser date where document dates are required, while revised dates and payment due dates are calculated deterministically.

## Source and professional-standard context

Module 1’s structure was cross-checked against a current official ZPPA tender/bidding document and the resulting compliance matrix is retained in the research directory. The wider modules were reviewed against Zambian public-procurement administration conventions, NCC portfolio evidence expectations, and contract-administration patterns commonly used in FIDIC-style and employer-administered works. The generated PDFs are drafts for review; the project-specific contract, employer’s requirements, tender data, statutory forms, and signed records remain controlling.

## Acceptance evidence retained in the project

The project research directory contains the Module 2 professional-standard audit, the Modules 3–6 parity audit, the eighteen-scenario production evidence register, the ZPPA cross-check, the rate-reference research, and the new fresh-deployment acceptance record for Modules 3–6. These records should be retained with the release checkpoint for traceability.

## Test baseline and limitations

The renewed release baseline is **86 passing Vitest tests across 20 files** and a successful production build. Earlier reports of 58, 79, or 85 tests refer to prior checkpoints. The 18-scenario historical production campaign is retained as coverage evidence; the current release additionally reran and file-checked one realistic published scenario for each of Modules 2–6, with Module 5 rerun after its structured-schedule correction. Live AI responses remain subject to transient upstream availability; the application bounds and explains these failures, but engineers should not treat an AI-generated draft as self-certifying. No paid-tier or billing change was made in this release.

## Suggested demo order

Begin with CD-01 or CD-02 because they demonstrate the strongest numerical reconciliation and review controls. Follow with CD-03 to show approval traceability and separate cost/time impacts. Use CD-04 to show high-value portfolio reconciliation and eligibility warnings. Demonstrate CD-05 with a user-provided rate override so source precedence is visible. Finish with CD-06 using a mixed-severity inspection to show the flashcard review and defect close-out logic.

## Feedback protocol

Please record the module, scenario, exact input, expected result, observed result, and whether the issue appeared in the form, review summary, PDF, or download action. Screenshots or the downloaded PDF are more useful than a general “try again” report. Avoid entering confidential client information during the demonstration; use anonymised project values where necessary.

## References

[1]: https://www.zppa.org.zm/ — Zambia Public Procurement Authority, official procurement resources.

[2]: https://www.ncc.org.zm/ — National Council for Construction, official contractor-registration context.

[3]: https://www.fidic.org/books — FIDIC contract-administration reference materials.

[4]: https://civildocs-zuztwkvm.manus.space/ — CivilDocs published production domain.

