# CivilDocs Toolkit Replacement Todo

- [x] Replace the existing home register with the six-module contractor toolkit.
- [x] Implement the Bid Package Builder with BOQ, technical proposal, ZMW defaults, and PDF export.
- [x] Implement Interim Payment Certificate, Variation/EOT, NCC Grade Portfolio, Escalation Clause, and Site Inspection modules.
- [x] Add mobile-first form layouts, usable dynamic lists, and responsive document tables.
- [x] Validate Gemini failure states, required-field handling, and PDF generation before delivery.
- [x] Correct the module-specific prompt builder so fields from other modules are never evaluated during a submission.
- [x] Reproduce the reported deployed application failure and correct the affected workflow.
- [x] Ensure the standalone application script is bundled into the production deployment so module cards render live.
- [x] Add realistic mock response objects for each of the six modules with no Gemini fetch request.
- [x] Verify that each mock response generates a downloadable PDF independently.
- [x] Add a shared Zambian construction-material rate reference file for bid and escalation workflows.
- [x] Add an editable BOQ quantity-and-rate review before any Bid Package PDF is generated.
- [x] Recalculate BOQ totals, contingency, and VAT from confirmed user edits.
- [x] Verify that confirmed BOQ data, rate references, and mock PDF export work together.
- [x] Replace the BOQ review table with a one-item-at-a-time flashcard flow, editing controls, progress, back navigation, and summary.
- [x] Apply the same one-item flashcard confirmation pattern to Site Inspection log items before PDF export.
- [x] Verify mobile interaction, revised-data totals, and PDF generation after flashcard confirmation.
- [x] Correct the flashcard summary visibility rules so hidden cards, controls, and irrelevant BOQ totals do not appear after review completion.
- [x] Remove temporary mock generation and restore Gemini requests for all six modules using the supplied API credential.
- [x] Test live Bid Package generation, flashcard confirmation, and PDF readiness with a real Gemini response.
- [x] Remove residual inactive mock response definitions so the application has no mock-generation code remaining.
- [x] Replace the retired Gemini 2.5 Flash endpoint with an available Gemini model before the live Module 1 retest.
- [x] Correct live Gemini structured-response parsing so the returned BOQ JSON reaches the flashcard review flow.
- [x] Prevent live Gemini BOQ JSON from truncating before it reaches the confirmation workflow.
- [x] Add Module 1 quantity-increment rules for whole-unit, volume, weight, and litre materials.
- [x] Add honest budget-shortfall note handling without forcing the BOQ total to match the stated budget.
- [x] Validate realistic quantities, note text, totals, and PDF output.
- [x] Verify that the public domain serves the checkpoint containing the bundled application script.
- [x] Confirm the public domain renders all module cards without script-loading errors.
- [x] Publish the latest Module 1 realism checkpoint and verify the public asset references match the published release.
- [x] Source and document an official ZPPA tender or BOQ reference for Module 1 structure.
- [x] Align Module 1 headings, required fields, and numbering conventions with the verified reference.
- [x] Generalize practical quantity increments across all material types and scope sizes.
- [x] Validate the reference-aligned BOQ structure, quantities, totals, and PDF output.
- [x] Correct live Gemini structured-response handling for the expanded ZPPA-aligned Module 1 prompt.

- [x] Verify and correct consistent two-decimal currency formatting in Module 1.
- [x] Verify and report whether the Gemini API key remains client-side or has moved server-side.
- [x] Verify and report whether the live Module 1 BOQ confirmation uses flashcards rather than the old table flow.
- [x] Move the Gemini integration behind a server-side proxy and remove the API key from all browser-served code.
- [x] Verify the live proxy path, production build, and absence of the Gemini API key from browser-served assets.
- [x] Show a specific, actionable user message when Gemini returns a temporary-capacity or quota response.
- [x] Apply basic per-IP request throttling to the server-side Gemini proxy.
- [x] Test capacity messaging and proxy throttling behavior.

- [x] Add lightweight server-side Gemini request metrics and quota-usage logging.
- [x] Retest Module 1 end-to-end on the published production domain after Gemini quota resets and confirm the BOQ reaches flashcard review without proxy errors.
- [x] Hold off on the rate-limit countdown timer.

- [x] Leave the empty gemini_proxy_metrics table unused as confirmed by the user.
- [x] Complete a real preview Module 1 retest and report the actual result: quota remained unavailable and the UI showed the capacity message.

- [x] Validate the freshly rotated server-only Gemini credential through an actual `/api/gemini` proxy request.
- [x] Complete the published Module 1 BOQ retest with the fresh key and confirm the response reaches flashcard review.
- [x] Validate the server-side Gemini model and endpoint against the current official API reference and correct any mismatch.
- [x] Rerun Module 1 on the published production domain after the 404-handling update and confirm it reaches flashcard review without a model or endpoint error.
- [x] Module 2: complete the full Interim Payment Certificate generation, flashcard review, PDF generation, and download flow on the published production domain.
- [x] Resolve or re-verify the published `civildocs-zuztwkvm.manus.space` TLS endpoint before repeating the production-domain Module 2 browser test; the endpoint is now browser-accessible.
- [x] Module 2: guarantee multiple practical valuation lines, display certificate totals in the review summary, and validate the downloaded final PDF.
- [x] Send an explicit progress report after the published-domain Module 2 pass is confirmed.
- [x] Module 3: ensure Variation and EOT Claims uses the secured Gemini proxy, two-decimal currency values, multi-claim flashcard confirmation, and a real end-to-end test.
- [x] Module 3: route live Variation and EOT Claims generation through the secured Gemini proxy, apply two-decimal currency and flashcard claim review where applicable, then pass a real production test.
- [x] Module 4: route live NCC Grade Upgrade Portfolio generation through the secured Gemini proxy, apply two-decimal currency where relevant, then pass a real production test; the separate empty-evidence-table presentation regression remains tracked below.
- [x] Module 5: route live Escalation Clause Builder generation through the secured Gemini proxy, apply realistic quantity rules and two-decimal currency, then pass a real production test.
- [x] Module 6: route live Site Inspection and Defect Log generation through the secured Gemini proxy, apply realistic quantities and flashcard item review, then pass a real production test.
- [x] Add a controlled four-hour Module 2 live validation job using the secured Gemini proxy.
- [x] Verify the first automated Module 2 validation attempt is recorded with its status, outcome, and timestamp.
- [x] Notify the project owner when a real Module 2 validation first reaches the payment flashcard review.
- [x] Correct the Interim Payment Certificate PDF so its Certification block does not produce a mostly blank trailing page and its certifier note is a neutral completion instruction rather than an unsupported verification statement; then regression-test the live PDF.
- [x] Correct Payment Certificate normalization so a multi-line AI response with all stated value on one line distributes nonzero previous and current values across usable valuation lines, then rerun the live review and PDF test.
- [x] Implement the authenticated `/api/scheduled/module2-validation` server callback and mount it before static-file fallthrough.
- [x] Persist each authenticated scheduled validation attempt and first-success notification state in the database.
- [x] Activate the deployed project-level four-hour Heartbeat callback and persist its task UID.
- [x] Create a dated recovery checkpoint for the current stress-test verification milestone (latest: `85edec12`).
- [x] Save a dated recovery checkpoint for this final verification milestone.
- [x] Source a current official ZPPA tender or bidding document and create a section-by-section Module 1 compliance cross-check.
- [x] Correct every confirmed structural, heading, numbering, BOQ, and technical-proposal mismatch in Module 1 against the official ZPPA source.
- [x] Research and document current Zambian supplier or reliable local-market prices for cement, steel, diesel, sand, aggregate, brick, roofing, and timber.
- [x] Replace placeholder rate-reference values with sourced current rates and flag the periodic manual-update location in code and documentation.
- [x] Define and log at least three distinct realistic stress-test scenarios for each of the six document modules.
- [x] Execute multi-scenario generation, review, and PDF stress tests for Modules 1 through 6, including large, small, incomplete, mixed-unit, and multi-page cases where applicable.
- [x] Fix and regression-test every confirmed stress-test failure, output defect, or formatting break identified to date; the Site Inspection fixed-eight-item cap was corrected and verified through a live 15-item, two-page PDF workflow.
- [x] Report the ZPPA verification, rate-reference research, and multi-scenario test outcomes as separate completed workstreams.
- [x] Correct Module 1’s PDF attachment checklist glyph so it renders reliably in jsPDF output.
- [x] Prevent Module 1 from presenting unsupported, bidder-specific qualification requirements as if they were confirmed by the employer’s BDS.
- [x] Prevent duplicate honest-budget notes when the AI response already contains the required practical-scope warning.
- [x] Refresh the reinforcement-steel reference with a recent 2026 supplier source without a stated expiry rather than the older expired card.
- [x] Restore the roofing-sheet default to a documented per-m² basis.
- [x] Re-verify the Escalation Clause PDF pagination report: visual inspection confirmed one rendered page with an accurate “Page 1 of 1” footer; the initial text-extraction count was a false positive.
- [x] Correct the Site Inspection prompt so a detailed 15-observation scenario is not silently reduced to the current fixed eight-item AI output, then regression-test its flashcard and PDF flow.
- [x] Correct the NCC Portfolio PDF so an empty recommended-supporting-documents array does not render a blank table heading, then regression-test the live output.
- [x] Ensure the Module 2 review-summary overrun warning always uses the submitted contract sum as a fallback, then rerun the published production PDF regression.
- [x] Continue saving dated recovery checkpoints before each further major verification or data-update milestone through 2026-08-23. Completed to date: checkpoints were created for each completed production-evidence milestone, including the final eighteen-scenario, parity-audit, and fresh Modules 3–6 production acceptance release.
- [x] Reconcile the historical test count against current Vitest output: 58 is historical; the current suite is 79 passing tests across 19 files after the Module 4 mixed-value reconciliation and Gemini timeout regressions were added.
- [x] Complete three confirmed live stress scenarios for Module 1 and record outcomes, failures, and fixes: the Kanyama constrained-budget BOQ, Mumbwa mixed-unit discounted BOQ, and Chimwemwe municipal-drainage BOQ all reached review and verified PDFs.
- [x] Complete three confirmed live stress scenarios for Module 2 and record outcomes, failures, and fixes: the baseline multi-line IPC, the 105% contract-sum boundary certificate, and the sparse-detail IPC-13 scenario all reached review and verified PDFs.
- [x] Complete three confirmed live stress scenarios for Module 3 and record outcomes, failures, and fixes: a five-item baseline, a mixed Variation/EOT case, and an incomplete-record EOT case all reached review and verified PDFs.
- [x] Re-verify three confirmed live stress scenarios for Module 4 and preserve evidence: the 15-project portfolio, single-project Grade 2 warning boundary, and high-value two-project portfolio all produced verified PDFs.
- [x] Re-verify three confirmed live stress scenarios for Module 5 and preserve evidence: the 12-material escalation schedule, the unmatched-material fallback case, and the post-fix whitespace-override PDF pass are all confirmed live outputs.
- [x] Re-verify three confirmed live stress scenarios for Module 6 and preserve evidence: the 15-item baseline, 20-item mixed-severity inspection, and 25-item mixed-severity inspection all reached review and verified PDFs.
- [x] Keep the six-module stress workstream open until all eighteen live scenarios are confirmed and the standalone report is updated: all six modules now have three confirmed published-domain review-to-PDF scenarios, and the stress register records the reconciliation.
- [x] Investigate the live Module 5 rate-override discrepancy: the post-parser published PDF now reflects Diesel K29.75 and Aggregate K385.00 with explicit user-override source labels; broader stress coverage remains separately tracked.

# Quality-Bar Parity Audit from pasted_content.txt

- [x] Audit Modules 2–6 against the complete Module 1 quality bar: proxy-only client security, realistic quantities, exact two-decimal currency, flashcard review, source-value consistency, calculated dates, business-limit warnings, and published production testing are reconciled in the final parity matrix.
- [x] Explicitly test and document all five known defect patterns across Modules 2–6 with real scenarios: missing bounded-value warnings, independently regenerated figures, boundary-condition line-item degradation, inconsistent date formatting, and semantic field mislabeling are reconciled in the published-evidence report.
- [x] Complete Module 2 parity checks: the 105% K30,000 over-certification warning, deterministic 100%/105% boundary coverage, repeated 2026-08-18 to 2026-09-01 Payment Due calculation, sparse-input IPC-13 PDF, and explicit K-18,500.00 negative-adjustment IPC-14 PDF are all verified.
- [x] Complete Module 3 parity checks: live Variation-only and EOT-only PDFs now complement the prior combined-claim evidence; zero-day/zero-cost separation, K2,450,000.00 to K2,670,000.00 cost reconciliation, K1,680,000.00 no-cost EOT treatment, and 2026-10-15 to 2026-11-05 revised-date arithmetic are verified.
- [x] Complete Module 4 parity checks: portfolio headline/detail reconciliation, fallback visual confirmation, and grade-eligibility boundary warning.
- [x] Complete Module 5 parity checks: the wider-list unmatched-material fallback, 12-material schedule, and live rate-override PDF are documented; all three preserve transparent source labeling.
- [x] Complete Module 6 parity checks: 20–25 item inspection output, practical quantities, and severity-color accuracy under large item counts.
- [x] Report Modules 2–6 individually only after deterministic tests and published production evidence both pass; all five modules now have deterministic coverage and verified published PDFs, while historical capacity-limited attempts remain documented as non-passes.
- [x] Investigate and correct the Module 3 document-date source: generated documents now override stale AI `dateSubmitted` values with the current browser-generated ISO date while preserving revised-completion-date arithmetic; focused regression and published build pass.
- [x] Extend Module 5 rate-override parsing to accept plain whitespace-separated entries such as `Diesel K29.75` and `Aggregate K385.00`; precedence is covered by deterministic regression tests.
- [x] Run a capacity-available published Module 5 scenario using plain whitespace-separated overrides (`Diesel K29.75; Aggregate K385.00`) and verify the PDF shows the override prices and `User-provided rate override` source labels.
- [x] Run a capacity-available published Module 3 scenario and verify the downloaded PDF carries the current submission date after the date-freshness fix.
- [x] Add deterministic Module 2 regression coverage for cumulative values exactly at 100% and 105% of contract sum, preserving the separate live parity requirement.
- [x] Add deterministic Module 5 coverage proving wider material lists retain unmatched entries with an explicit verify-supplier source and do not inherit unrelated reference rates.
- [x] Add deterministic Module 6 regression coverage for Low/Medium/High/Critical severity preservation, invalid-severity fallback, and practical affected-quantity rounding.
- [x] Add deterministic Module 4 regression coverage proving portfolio headline totals exactly reconcile to mixed project values including K125,000,000.55 and K88,900,000.00.

- [x] Verify the official Gemini pay-as-you-go upgrade path, account-level prerequisites, and current pricing for the server-side credential.
- [x] Obtain explicit confirmation before enabling or attaching any billable Gemini/Google Cloud billing account: no billing enablement was pursued because the user explicitly deferred all payment-tier work for this scope.
- [x] Paid-tier contingency deferred by explicit user decision: no paid project or credential replacement was approved; the existing secured integration remains unchanged.
- [x] Paid-tier contingency deferred by explicit user decision: no paid-tier rerun was authorized; all required no-billing scenarios are confirmed and the capacity-limited history is documented.
- [x] Trace and correct Module 2 Date Issued so it always uses the actual current document date rather than a stale or AI-generated reference date.
- [x] Add deterministic regression coverage for Module 2 Date Issued current-date enforcement and verify the published certificate workflow once Gemini capacity permits.
- [x] Defer all Gemini paid-tier and billing-account changes; prioritize diagnosis and reliability fixes for the existing secured Gemini proxy and module flows.
- [x] Extend the bounded per-attempt upstream timeout to cover response-body reads and regression-test that a Gemini request cannot leave a CivilDocs form permanently in its loading state.

## Module 2 professional-release validation

- [x] Research official or professionally used Zambian interim-payment-certificate and standard civil-works contract references; preserve source URLs and a requirement matrix in `research/module2_professional_standard_audit_2026-08-18.md`.
- [x] Audit the live Module 2 form, review flow, calculations, warnings, PDF structure, and wording against the professional-standard requirement matrix; the source-led gap register and acceptance baseline are recorded in the professional audit.
- [x] Correct and regression-test every confirmed Module 2 professional-standard gap without exposing the existing server-side Gemini credential: contract-term dates, role-separated certification, adjusted contract sum, reviewable deductions, support-record register, and validation rules now pass 84 deterministic tests across 20 files.
- [x] Run a documented Module 2 acceptance pack of realistic Zambian civil-works scenarios, including normal, retention, over-certification, negative-adjustment, incomplete-input, and multi-line valuation cases; all are reconciled in `research/module2_professional_standard_audit_2026-08-18.md`.
- [x] Prepare a concise tester-facing Module 2 handoff record for the six civil-engineering reviewers, including tested behaviours, known operational limits, and reproduction steps in `research/module2_engineer_tester_handoff_2026-08-18.md`.

## Modules 3–6 pre-demo professional-release validation

- [x] Define and document a shared professional acceptance matrix for Modules 3–6 covering source traceability, role accuracy, calculated dates, monetary reconciliation, boundary warnings, review controls, PDF structure, and safe-use language in `research/modules3_6_professional_standard_audit_2026-08-18.md`.
- [x] Research current Zambia-specific or contract-standard references for variation/EOT claims, NCC grade portfolios, escalation clauses, and site inspection/defect registers; preserve URLs and requirements in the Modules 3–6 professional audit.
- [x] Audit Module 3 Variation & EOT Claims against the matrix and record every confirmed professional-standard gap, including approval status, instruction/reference traceability, supporting records, affected milestone, and the 25% variation warning.
- [x] Audit Module 4 NCC Grade Upgrade Portfolio against the matrix and record every confirmed professional-standard gap, including application-safe wording, NCC category/registration fields, and project evidence status.
- [x] Audit Module 5 Escalation Clause Builder against the matrix and record every confirmed professional-standard gap, including date basis, source/index, mechanism, thresholds, cap/floor, notice, and risk allocation.
- [x] Audit Module 6 Site Inspection & Defect Log against the matrix and record every confirmed professional-standard gap, including drawing/spec references, evidence, responsible party, close-out status, target date, and verification.
- [x] Implement and regression-test confirmed professional-standard corrections across Modules 3–6 without exposing the server-side Gemini credential: full Vitest suite passes 85 tests across 20 files.
- [x] Run a documented production acceptance pack for Modules 3–6 covering the fresh combined Variation/EOT case, high-value two-project NCC portfolio, mixed-material escalation case, and eight-item mixed-severity inspection; prior boundary, incomplete-input, multi-item, multi-page, and source-reconciliation evidence remains in the stress register.
- [x] Prepare one pre-demo handoff package for the six engineers covering all six modules, tested behaviours, known operational limits, and reproducible feedback fields.
- [x] Save and publish a dated checkpoint only after the six-module pre-demo acceptance pack passes; final published checkpoint: `82f00c78`.

Module 7 is not in scope: CivilDocs currently contains six modules, CD-01 through CD-06.

## Renewed Modules 2–6 real-world readiness program

- [x] Reassess the restored Modules 2–6 baseline against the professional acceptance matrix and record any regressions or unproven claims before engineer handoff.
- [x] Refresh Zambia-specific contract, procurement, NCC, material-rate, and site-record references, preserving source URLs, dates, scope, and use limitations for each value or rule adopted in `research/renewed_zambia_real_world_baseline_2026-08-18.md`.
- [x] Upgrade and regression-test every unresolved Module 2–6 numerical, date, traceability, role-separation, and PDF-reconciliation gap identified by the renewed audit. The renewed CD-05 structured schedule and PDF reconciliation now pass a published K145,317.50 four-material scenario; existing professional controls in CD-02, CD-03, CD-04, and CD-06 were rechecked against the restored baseline.
- [x] Run at least three realistic scenarios per Module 2–6, including boundary, incomplete-input, multi-line or multi-page cases, and independently reconcile every calculation and logical limit. The retained eighteen-scenario published campaign covers three live scenarios per module; current code-unchanged Modules 2–4 and 6 were re-run on the public domain, and corrected Module 5 was re-run with the exact four-material K145,317.50 reconciliation.
- [x] Verify the final six-module public release is reachable, complete a published-domain acceptance PDF for every Module 2–6 scenario, and prepare a single conservative engineer handoff package that states both verified behaviour and remaining limitations. The public endpoint was verified healthy and Modules 2–6 each produced, downloaded, and were file-level checked in the renewed acceptance set; the handoff is updated at `research/civildocs_engineer_tester_handoff_2026-08-18.md`.

## Loading staircase and data-safety UX

- [x] Audit all six generation flows and current error states for a shared loading, retry, autosave, offline, and success-confirmation integration point.
- [x] Implement a reusable 0–300 ms hidden, 300 ms–1 s inline-spinner, 1–10 s output-shaped skeleton, and 10 s+ monotonic request-status experience with reduced-motion support and no fake progress.
- [x] Preserve draft form entries in localStorage, restore them on return, keep them intact after API failure, warn before leaving unsaved work, detect offline status, and disable repeated submissions across all six modules.
- [x] Add an explicit retry-ready long-wait state and clear success/re-download confirmation after every PDF generation without masking existing proxy timeout or capacity errors.
- [x] Regression-test duration transitions and deliberate slow/failed requests for at least two modules, including skeleton-to-error handoff with no indefinitely active loader, then publish the verified release. Payment Certificate and Site Inspection preview runs both reached their output-shaped skeletons, then cleared to retry-ready errors while preserving drafts; 89 tests across 21 files and the production build pass.

## Final pre-handoff adversarial stress suite

- [x] Convert the supplied 96-case CivilDocs final stress suite into a traceable execution matrix, separating deterministic checks, published-domain checks, and expected manual-review observations.
- [x] Execute all deterministic numerical, date, boundary, input-preservation, and request-lifecycle checks from the suite and record pass/fail/reason evidence.
- [x] Execute representative published-domain adversarial scenarios for every module, including the named high-risk boundaries, multi-item or multi-page cases, and real-PDF reconciliation checks.
- [x] Reproduce, classify, fix, and regression-test every confirmed application defect; record any untestable AI-quality or external-capacity condition transparently rather than marking it passed.
- [x] Publish a final stress-test evidence register and a conservative handoff recommendation only after affected scenarios pass on the public domain.

- [x] CD-05: Explicitly disclose capped and floored material adjustments in the schedule status so engineer reviewers can distinguish boundary-controlled values from ordinary triggered adjustments. Verified in the public PDF with K150.00 cap-controlled compensation and K-50.00 floor-controlled Employer credit.
- [x] Cross-module review safety: clear stale CD-02 over-certification warning elements before a CD-03 claim summary is rendered, then regression-test and revalidate the affected public workflow. A controlled stale marker is absent from the current public CD-03 summary, which retains K1,500,000.00 + K180,000.00 = K1,680,000.00 and 0 days.
- [x] CD-06: Stop a single submitted inspection observation from being expanded into invented additional site observations; preserve the requested/input-derived item count, add a regression test, and revalidate the single-item public PDF flow. Public regression now shows Item 1 of 1 and a one-row PDF; 102 tests across 23 files pass.
- [x] CD-01: Prevent omitted optional budgets from producing a literal `[budget]` scope-exceeds-budget note in the final PDF; add regression coverage and revalidate a required-fields-only public bid package. Final public PDF has no scope-exceeds-budget text or literal placeholder; 104 tests across 23 files pass.
- [x] Execute the remaining final stress-suite cases in expedited published-domain batches; record provider blocks promptly, preserve actual PDF/review values, and issue no readiness claim until the evidence register is reconciled. Remaining provider/credit-limited cases are explicitly recorded as PENDING or BLOCKED, not passed.
- [x] Preserve the user's remaining credits by stopping non-essential live AI generations; reconcile remaining cases from captured public evidence and local regressions, using a new live request only for a suspected unresolved production defect.
- [x] Resume the minimum necessary evidence-critical public checks for the remaining matrix holds, prioritize shared evidence and defect-risk cases, and issue a conservative engineer-handoff decision only after reconciliation.
- [x] Investigate and correct the confirmed CD-01 repeat-input divergence: identical small-project inputs produced materially different public BOQ line counts and tender totals (K8,975.00 versus K12,510.00); add regression coverage and revalidate the repeat case before handoff.

- [x] Prepare a complete Replit backend + Cloudflare Pages frontend ZIP with server-side Gemini environment templates, Cloudflare configuration, tests, and deployment documentation
- [x] Verify the packaged source excludes live API keys and includes a clear CORS / proxy configuration path
- [x] Create and validate the upload archive before delivery
- [x] Resume CD-01 repeat-stability remediation and remaining public stress checks after packaging

> Packaging request recorded 2026-08-19. Existing live credentials must not be embedded in the archive.


# Full AI Workflow Hardening Pass — 2026-08-19

- [x] Audit all six module prompts, response extraction, normalization, review, and PDF paths for inconsistent or unsafe behavior
- [x] Add schema-level validation and deterministic reconciliation for every module’s AI response
- [x] Complete CD-01 repeat-stability behavior and regression evidence for exact duplicate inputs
- [x] Add adversarial boundary tests for empty, malformed, oversized, negative, mixed-unit, and contradictory AI payloads
- [x] Harden proxy retry, timeout, model fallback, rate limiting, CORS, and structured error behavior
- [x] Verify loading, offline, draft preservation, review, PDF, and retry flows across all six modules
- [x] Run browser and published-domain verification for the highest-risk cases and record actual I/O values
- [x] Refresh the engineer handoff evidence and release package after the hardening pass


# Deployment and Tier-1 Reconciliation — 2026-08-20

- [x] Verify whether the published domain actually uses the Replit backend plus Cloudflare Pages frontend split, using only public headers/assets and non-secret configuration evidence; finding: it currently serves the Manus same-origin deployment and retains a placeholder Replit runtime URL.
- [x] Confirm whether the live deployment has a configured Gemini credential and allowed CORS origin without exposing secret values; finding: the same-origin Manus proxy is active, but the public runtime does not prove a Replit secret and the CORS probe returned no allow-origin header.
- [x] Research current Gemini Tier 1 requirements, pricing/limits, billing steps, and confirmation gate; do not enable billing
- [x] Reconcile the user-supplied 96-case suite against the existing 104-case matrix and identify only uncovered or still-pending cases
- [x] Produce a prioritized post-confirmation execution batch for the 19 pending/blocked cases and any uncovered 96-suite gaps

# Pending Evidence Closure and Hosting Package — 2026-08-20

- [x] Run the 19 remaining high-priority published checks in efficient batches, capturing actual review and PDF evidence where the public workflow permits it; renewed execution closed CD-01 repeat/ambiguity/recovery, CD-02 baseline/recovery, and controlled recovery across CD-03–CD-06.
- [x] Fix the newly confirmed CD-02 repeat-instability defect: identical Certificate 2 inputs produced a different valuation line count and allocation on the second public run; CD-02 now uses the bounded exact-input cache and 124/124 tests plus the production build pass.
- [x] Fix the confirmed public-browser defect where the packaged placeholder Replit URL is treated as a live endpoint instead of falling back to the same-origin proxy; 123/123 tests and production build pass.
- [x] Classify any unavailable public browser, provider, throttle, or deployment limitation as BLOCKED with reproducible evidence rather than passing it; remaining browser-follow-up checks are PENDING and provider-timeout cases are BLOCKED in the matrix.
- [x] Reconcile the 104-case matrix and engineer handoff report with the renewed execution evidence
- [x] Rebuild and validate the secret-safe host-ready ZIP after the pending-case effort; ZIP integrity and source credential audit passed.

# Commercial Pricing Assessment — 2026-08-20

- [x] Assess CivilDocs’s current readiness, deployment costs, and target-customer value for a monthly price recommendation
- [x] Research Zambia-facing and comparable engineering SaaS pricing benchmarks
- [x] Provide a recommended per-user monthly pricing ladder and launch approach

# Commercial Launch Materials and Terms — 2026-08-20

- [x] Define source-labeled 90-day subscription revenue assumptions and produce a formula-driven financial projection model
- [x] Draft customer-facing fair-use terms for AI generation limits, overage handling, and abuse prevention
- [x] Draft a Founding Engineer pilot-conversion email for the six civil-engineering testers
- [x] Research Zambia-relevant privacy, electronic-transactions, and consumer-contract context for the terms draft
- [x] Add an accessible Terms and Conditions page and footer navigation to the live Vanilla JS CivilDocs application
- [x] Add focused automated coverage for Terms navigation and run the full regression suite and production build

# 90-Day Expenses and Profitability Extension — 2026-08-20

- [x] Define editable expense assumptions for AI usage, hosting, payment fees, support, and launch costs
- [x] Extend the 90-day workbook with expense schedules, contribution economics, and profit or loss outputs
- [x] Recalculate and verify all revenue, expense, profit, and formula-check outputs before delivery

# Pricing, Fair-Use Tracking and Pilot Feedback — 2026-08-20

- [x] Define a transparent device-local 30-generation pilot tracker, including 80% approach-cap and 100% cap warning behavior
- [x] Add tested reusable client-side fair-use tracking utilities that increment only after a successful completed AI response
- [x] Add a pricing page for Founding Engineer, Professional and Firm plans with fair-use, pilot-status and professional-review disclosures
- [x] Add a clear on-device usage panel, approach-cap warning, cap notice, and reset explanation to the app
- [x] Add a pilot feedback form that prepares a support email without silently transmitting user content
- [x] Run focused tests, full regression tests, production build and browser verification for the new commercial experience

# Terms and Fair-Use Compliance Review — 2026-08-20

- [x] Inventory the current public Terms and Conditions and fair-use commitments
- [x] Review Zambia-oriented privacy, electronic-transactions, consumer-contract, and fair-use wording considerations
- [x] Produce a prioritised lawyer-review-ready compliance gap assessment without representing it as legal advice

# Pilot Terms Acceptance Gate — 2026-08-20

- [x] Define mandatory pilot-access acceptance behavior, including current Terms version and browser-local timestamp record
- [x] Add tested reusable acceptance-state utilities for valid, stale and malformed browser-local acceptance records
- [x] Add an accessible unchecked Terms checkbox and disabled access action before CivilDocs modules can be opened
- [x] Display a clear pilot limitation that local acceptance is not a paid-account acceptance record
- [x] Run focused tests, full regression tests, production build and browser verification of the mandatory acceptance gate

# Terms Acceptance Validation Cue — 2026-08-20

- [x] Add a concise red validation state and reduced-motion-safe shake cue when unaccepted Terms block pilot access
- [x] Add focused coverage and verify the validation cue in the browser before release

# Visible Pilot Pricing, Dark Mode and Focused Hardening — 2026-08-20

- [x] Surface Founding Engineer, Professional and Firm pricing as clear unavailable plan cards directly on the pilot entry screen
- [x] Add a persistent accessible dark-mode preference with a visible control and high-contrast theme styling
- [x] Review current pilot entry, pricing and document flow for high-impact, reproducible usability or resilience defects and apply focused fixes
- [x] Add focused regression coverage for pricing-card availability state and dark-mode persistence
- [x] Run full automated, responsive browser and keyboard-accessibility checks before release

# Appearance Control Placement — 2026-08-20

- [x] Remove the appearance control from the masthead and add a dedicated settings-panel trigger
- [x] Place the persistent light/dark preference inside an accessible in-app settings panel
- [x] Verify theme persistence and responsive settings-panel interaction before release

# Supplied Content Review and Integration — 2026-08-21

- [x] Review the attached content and identify valid, pilot-compatible requirements
- [x] Revise the selected material into clear CivilDocs product copy and implementation scope
- [x] Integrate the revised material into the relevant app experience and project documentation
- [x] Run focused and full validation before delivering the revised release

# Post-Route Entry Feedback Prompt — 2026-08-21

- [x] Define a non-blocking, browser-local entry-flow feedback prompt shown after a document route is opened
- [x] Add an accessible quick-response form with optional free-text feedback, dismissal, and clear no-auto-send disclosure
- [x] Add focused feedback-state coverage and verify submission, dismissal, and uninterrupted document preparation

# Browser-Local Feedback Manager — 2026-08-21

- [x] Define review, single-delete and clear-all feedback-management behavior with explicit browser-local privacy disclosure
- [x] Extend the entry-feedback utility with tested removal and clearing operations
- [x] Add an accessible feedback-manager modal and a clear navigation entry to open it
- [x] Verify feedback review, deletion, clear-all and modal-return behavior before release

