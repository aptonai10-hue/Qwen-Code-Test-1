# CivilDocs — Final Pre-Handoff Stress Test Suite

Purpose: catch anything the automated test suite and prior spot-checks missed, before the 6 engineers get their hands on it. Every test below should be run on the **published production domain**, not preview, and each result should be checked against its "expected" column before being marked passed — not just "it generated a PDF."

Known defect patterns to watch for across every test (found and fixed earlier in this build — confirm none have resurfaced):
1. Business-logic validation missing (a bounded value silently exceeding its limit)
2. Duplicated figures generated independently instead of from one source (same number stated twice, disagreeing)
3. Line-item quality degrading near boundary conditions
4. Inconsistent date formatting/wrong year across runs
5. Field mislabeling / wrong semantic type

---

## Module 1 — Bid Package Builder (15 tests)

| # | Scenario | Expected result |
|---|---|---|
| 1.1 | Realistic mid-size drainage project, budget matches scope | Sensible BOQ, whole-number quantities on discrete items, no budget mismatch note |
| 1.2 | Budget stated far below realistic scope cost | BOQ stays realistic, does NOT shrink quantities to fit — shows a clear budget-mismatch note instead |
| 1.3 | Budget stated far above realistic scope cost | BOQ stays realistic, no padding/inflating of quantities to use up budget |
| 1.4 | Very small project (e.g. single-room repair) | Small, proportionate BOQ — not a bloated generic one |
| 1.5 | Very large project (35+ line items, multi-phase) | Multi-page PDF renders correctly, all sections/subtotals present, "To Collection" totals correct |
| 1.6 | Mixed discrete + continuous units (bags, m³, tonnes, litres, each) | Discrete items are whole numbers; continuous items use sensible real-world increments |
| 1.7 | Minimum required fields only, everything else blank | No crash, no "undefined"/"NaN," AI doesn't hallucinate excessive unstated detail |
| 1.8 | Unusual/ambiguous project type (e.g. "general repairs," no clear category) | AI produces a reasonable generic BOQ rather than failing or producing nonsense |
| 1.9 | Currency formatting check across entire document | Every value two-decimal, consistent K formatting, VAT/contingency lines calculate correctly |
| 1.10 | ZPPA structural compliance check | Section headings and bidder-package structure match the official ZPPA small-works template |
| 1.11 | Repeat test 1.1 twice with identical input | Both runs produce internally consistent output (same totals, same date format) — no run-to-run drift |
| 1.12 | Trigger a deliberate API failure mid-generation (airplane mode / throttle) | Entered form data is preserved; clear human error message shown; retry works without retyping |
| 1.13 | Double-click "Generate" rapidly | Only one generation request fires, no duplicate PDFs or race condition |
| 1.14 | Refresh the page mid-form-fill (before generating) | Entered data restores automatically (if auto-save implemented) or a clear warning appears before navigating away |
| 1.15 | Extremely high contract value (9+ figures, e.g. K150,000,000+) | Decimal precision holds to the cent; no scientific notation, no rounding errors |

---

## Module 2 — Interim Payment Certificate (18 tests)

| # | Scenario | Expected result |
|---|---|---|
| 2.1 | Normal mid-project certificate, cumulative well under contract sum | Correct cumulative, retention, and net payment math; no warning |
| 2.2 | Cumulative exceeds contract sum (e.g. Contract K500k, Previous K480k, This Period K50k) | Over-certification warning shown clearly, on form AND on PDF |
| 2.3 | Cumulative exactly equal to contract sum (boundary) | Confirm whether warning fires at the exact boundary or only when exceeded — check this is intentional, not accidental |
| 2.4 | Negative "Value of Work This Period" (a correction/deduction) | Cumulative decreases correctly; Net Payment Due shows clearly as a deduction/refund, not just a confusing negative number |
| 2.5 | Sparse input — only required fields filled, minimal free text | No crash; AI doesn't invent people/details not provided; math still correct |
| 2.6 | Retention percentage set to 0% | Retention Deduction = K0.00 exactly, Net Payment = Gross Value This Period |
| 2.7 | Retention percentage set to an unusually high value (e.g. 25%) | Math still calculates correctly, no cap silently applied without disclosure |
| 2.8 | Previous Certified Amount = 0 (first certificate on the project) | Cumulative = This Period only; no error from a zero starting value |
| 2.9 | Very high contract value (9+ figures) with decimals | Cumulative and retention hold precision to the cent |
| 2.10 | Repeat the same input twice, same day | Both runs produce identical date formatting — no "2024" vs "2026" type drift |
| 2.11 | Line-item quality check at a value very close to the contract sum boundary | Line items remain sensible and varied, not degraded into arbitrary equal splits |
| 2.12 | Line-item quality check well within normal range | Confirm baseline quality is good, for comparison against 2.11 |
| 2.13 | Certificate number sequencing (Certificate 1, then Certificate 2 for same project) | Previous Certified on Cert 2 correctly reflects Cert 1's cumulative, if the tool carries this forward, or clearly requires manual entry if not |
| 2.14 | Payment Due date field, run twice with identical input | Consistent format both times — always a calculated date, never sometimes a relative string like "14 days from issue" |
| 2.15 | Trigger deliberate API failure mid-generation | Form data preserved, clear error, retry works |
| 2.16 | Double-click Generate | Single request only, no duplicate certificates |
| 2.17 | Extremely long/unusual project or client name (50+ characters) | Renders correctly in PDF without breaking layout |
| 2.18 | Missing/blank Work Completed field where required | Validation blocks submission with a clear message (matches confirmed existing behavior) — re-confirm still works |

---

## Module 3 — Variation Order & EOT Claims (15 tests)

| # | Scenario | Expected result |
|---|---|---|
| 3.1 | Variation only (cost impact, no time impact) | Cost figure consistent between Item row and Requested Action; no phantom EOT days appear |
| 3.2 | EOT only (time impact, no cost impact) | Day count consistent between Item row and Requested Action; no phantom cost appears |
| 3.3 | Combined "Both" claim | Cost AND day figures both match between Item row and Requested Action — the previously-fixed defect |
| 3.4 | Zero-day EOT paired with a real cost variation | Confirm a K0/0-day claim doesn't get silently dropped or misrepresented |
| 3.5 | Very large day impact (e.g. 180+ days) | Revised Completion Date calculates correctly from Original + day count, no overflow/wraparound bug |
| 3.6 | Very large cost impact (8+ figures) | Precision holds, revised contract value sums correctly |
| 3.7 | Multiple claims on the same project (reconciliation) | Running totals across claims stay internally consistent |
| 3.8 | Original and Revised Completion Date — verify they're never identical on an EOT claim | Revised date must shift by the stated day impact, never stay equal to Original |
| 3.9 | Vague/thin delay description (one short sentence) | AI generates reasonable contractual language without inventing unstated facts |
| 3.10 | Detailed delay description with specific dates/instructions | AI correctly incorporates the specific details rather than generic boilerplate |
| 3.11 | Contractual basis left blank (AI to determine) vs explicitly stated | Both paths produce a sensible, real contractual clause reference |
| 3.12 | Repeat same combined claim twice | Same numbers both times — no independent re-generation drift |
| 3.13 | Negative cost impact (Employer-favorable variation, cost decrease) | Renders clearly as a deduction/credit, not a confusing negative |
| 3.14 | Trigger deliberate API failure mid-generation | Form data preserved, clear error, retry works |
| 3.15 | Double-click Generate | Single request only |

---

## Module 4 — NCC Grade Upgrade Portfolio Builder (15 tests)

| # | Scenario | Expected result |
|---|---|---|
| 4.1 | Portfolio that genuinely meets the target grade's requirements | Clean application generated, no warning |
| 4.2 | Portfolio that does NOT meet the target grade's requirements (too few qualifying projects) | Clear warning that eligibility isn't met, not a polished application that hides the shortfall |
| 4.3 | Exactly at the eligibility boundary (minimum qualifying projects/value) | Confirm behavior at the exact threshold is intentional |
| 4.4 | Two projects, high value (repeat of confirmed CD-04 style test) | Sum reconciles to the cent, as previously confirmed |
| 4.5 | Single project only | Confirm the tool handles a minimal portfolio without crashing, and correctly flags if it's insufficient |
| 4.6 | Large portfolio (10+ projects) | All projects retained and correctly summed, PDF handles multi-page cleanly |
| 4.7 | Very high individual project value (9+ figures) | Precision holds to the cent across the whole portfolio |
| 4.8 | Certificate/evidence references included for every project | All references preserved verbatim in the output, none dropped |
| 4.9 | Certificate/evidence references missing for one project | Tool flags the gap rather than silently omitting or inventing one |
| 4.10 | Grade jump spanning multiple levels (e.g. Grade 6 to Grade 3) | Tool handles a larger jump sensibly, doesn't assume only single-grade jumps |
| 4.11 | Years in operation very low (e.g. 1-2 years) paired with a high target grade | Tool flags this as a potential eligibility concern if operating-years is a real NCC criterion |
| 4.12 | Repeat same portfolio input twice | Identical totals and eligibility conclusion both times |
| 4.13 | Long company/project names, special characters | PDF renders without breaking layout |
| 4.14 | Trigger deliberate API failure mid-generation | Form data preserved, clear error, retry works |
| 4.15 | Double-click Generate | Single request only |

---

## Module 5 — Escalation Clause Builder (17 tests)

This module had the most recently fixed defect (missing quantity/rate schedule data) — test it hardest.

| # | Scenario | Expected result |
|---|---|---|
| 5.1 | Repeat the exact verified 4-material scenario (Cement, Steel, Diesel, Aggregate) that confirmed K145,317.50 | Total still reconciles to K145,317.50 exactly — confirms the fix is stable, not a one-off |
| 5.2 | Single material, above threshold | Correct per-line calculation, correct total |
| 5.3 | Single material, below threshold (no trigger) | K0.00 adjustment, clearly labeled "within threshold," not silently omitted |
| 5.4 | Single material, price DECREASE above the -5% threshold | Correctly calculates a credit to the Employer, not treated the same as a price increase |
| 5.5 | Material movement that would exceed the 20% cap | Adjustment correctly capped at 20%, not paid in full above the cap |
| 5.6 | Material movement that would exceed the -10% floor (large price drop) | Adjustment correctly floored at -10%, contractor keeps benefit below that |
| 5.7 | Large materials schedule (10+ materials) | All materials retained, all calculated correctly, PDF handles the longer table cleanly |
| 5.8 | Mix of user-override rates and reference-table rates in the same schedule | Both types calculate correctly side by side, source labeled correctly per line |
| 5.9 | A material not in the reference table and no user override given | Tool flags "verify supplier quotation" rather than inventing a price (previously confirmed behavior — re-verify) |
| 5.10 | Zero quantity for one material in an otherwise normal schedule | That line contributes K0.00 without breaking the total calculation |
| 5.11 | Very large quantities (e.g. 10,000+ tonnes) | Precision holds, no overflow or rounding drift |
| 5.12 | Very small threshold/cap/floor values entered (e.g. 1% threshold) | Tool respects custom values rather than defaulting to standard 5/20/-10 |
| 5.13 | Repeat test 5.1 on the published domain a second time, different day | Confirms stability isn't a one-time fluke tied to a specific session |
| 5.14 | Base date and current date very close together (e.g. 7 days apart) | Tool doesn't error on a short escalation period |
| 5.15 | Base date and current date very far apart (e.g. 5+ years) | Tool handles a long-duration contract without date errors |
| 5.16 | Trigger deliberate API failure mid-generation | Form data (including the full materials schedule) preserved, clear error, retry works |
| 5.17 | Double-click Generate | Single request only, no duplicate/conflicting PDFs |

---

## Module 6 — Site Inspection & Defect Log Generator (16 tests)

| # | Scenario | Expected result |
|---|---|---|
| 6.1 | Single inspection item | Handles a minimal inspection without breaking the flashcard flow |
| 6.2 | 8 items (matches previously confirmed CD-06 scenario) | All 8 retained and reviewed, as previously verified |
| 6.3 | 15 items | All 15 retained (previously fixed cap bug — re-confirm) |
| 6.4 | 20 items | Confirm the cap doesn't resurface at a new, higher threshold |
| 6.5 | 25 items | Same check at an even higher count |
| 6.6 | All items Compliant (no defects) | Tool doesn't force-invent defects; a clean inspection is representable |
| 6.7 | All items Critical severity | Color-coding and urgency remain clear and distinct even when every item is high-severity |
| 6.8 | Mixed severities (Compliant, Requires Attention, Non-Compliant, Critical) | All severity levels visually distinct, correctly assigned per item |
| 6.9 | Due dates calculated from a range of severities | More severe items get sooner due dates than minor ones, logically ordered |
| 6.10 | Sparse input — minimal description per item | No crash, no hallucinated excessive detail |
| 6.11 | Detailed input — long description with specific measurements per item | AI correctly extracts and uses the specific figures rather than generic language |
| 6.12 | Mixed quantity units across items (m², m³, tonnes, count) | Each item's unit renders correctly and sensibly for its type |
| 6.13 | Missing quantity for one item | Tool handles gracefully — flags or omits sensibly rather than inventing a fake number |
| 6.14 | Multi-page PDF check (15+ items) | Page breaks correctly, footers/numbering correct across all pages |
| 6.15 | Trigger deliberate API failure mid-generation | Form data preserved, clear error, retry works |
| 6.16 | Double-click Generate | Single request only |

---

## Cross-Module Safety Valve Tests (run on at least 2 modules each, not all 6 individually needed)

| # | Scenario | Expected result |
|---|---|---|
| S.1 | Go offline (airplane mode) mid-generation | Clear "you're offline" message, not a cryptic fetch error |
| S.2 | Simulate a slow/hanging response (30-45+ seconds) | "Taking longer than usual" message with manual retry appears, doesn't spin forever |
| S.3 | Refresh the page mid-form-fill | Entered data restores automatically, or a clear warning appears before losing it |
| S.4 | Navigate away (back button/close tab) with unsaved changes | Browser warns before leaving |
| S.5 | Successful generation | Clear "Your PDF is ready" confirmation with a re-download option, not a silent download |
| S.6 | Loading state under 1 second | No jarring flash of a loading skeleton for near-instant responses |
| S.7 | Loading state 1-10 seconds | Skeleton screen shown, matching the real output's shape |
| S.8 | Loading state 10+ seconds | Progress bar with real status text, always moving forward, never stalling or looping fake progress |

---

## Reporting requirement

For every test above, report the actual input values used and the actual output values observed for anything involving a calculation — not just "passed." Any test that fails should be matched against the 5 known defect patterns listed at the top, so the fix targets the right root cause. Do not mark this stress-test suite complete until every row above has a real, published-domain result — not a unit test result alone.

