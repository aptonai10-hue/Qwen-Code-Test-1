# Multi-Scenario Stress-Test Status Report

**Status:** In progress — deterministic coverage complete; selected live workflows complete; remaining live AI retries are capacity-limited.  
**Test date:** 2026-08-16

## Coverage completed

The automated suite contains **18 scenario-specific tests** across all six modules. Together with the broader suite, the current project has **69 passing tests across 19 files** and a clean production build. The suite covers practical purchasing increments, negative payment adjustments, mixed variation/EOT claims, portfolio precision, escalation rate precedence, inspection quantities, and validation blocking.

| Module | Deterministic scenario coverage | Live browser / PDF evidence | Current status |
|---|---|---|---|
| 1. Bid Package Builder | 35-line BOQ, mixed units, constrained budget | Earlier real drainage-tender generation, flashcard review, and PDF validation completed; later constrained-budget and large mixed-unit retries returned temporary capacity. | Three-scenario live coverage remains pending. |
| 2. Interim Payment Certificate | Negative adjustment and sparse-input validation | The over-limit IPC regression passed; subsequent negative-adjustment and detailed multi-line baseline retries returned temporary capacity or did not reach review. | Three-scenario live coverage remains pending. |
| 3. Variation & EOT Claims | Multi-claim reconciliation and mixed “Both” claim handling | Three published flows completed: a five-item baseline, a mixed two-item claim, and a limitation-preserving EOT claim. All reached review and verified two-page PDFs. | **Three-scenario live coverage complete.** |
| 4. NCC Portfolio | 15-project portfolio and high-value precision | A real 15-project, ZMW 15,000,000.00 PDF was verified; a blank evidence-table heading was corrected. A later high-value two-project retry returned temporary capacity. | Three-scenario live coverage remains pending. |
| 5. Escalation Clause | 12-material schedule and user-rate precedence | Live Kanyama Flood Mitigation PDF verified. | Passed live test; larger schedule retry remains optional evidence. |
| 6. Site Inspection | 15 items, mixed quantities, sparse input | Live 15-item flashcard flow and two-page PDF verified. | Passed live test after fixing the AI prompt’s prior eight-item cap. |

## Confirmed fixes

The stress campaign identified one confirmed live-output defect: Site Inspection requests with 15 distinct numbered observations were capped at eight AI items. The prompt now requires a separate item for each numbered observation, with unit coverage for a 15-item instruction. The corrected live workflow preserved all 15 items, retained 1.3m³, 5-sheet, and 2.5-tonne quantities, and generated a two-page PDF with correct page footers.

The campaign also found an NCC Portfolio presentation issue when the AI returned no evidence recommendations. The normalizer now inserts a neutral bidder-completion instruction rather than allowing an empty PDF table. Unit tests and production build pass; visual confirmation is queued behind the temporary Gemini-capacity responses.

> Temporary Gemini capacity responses are operational outcomes, not product validation failures. They preserve form inputs, show a specific retry message, and are being logged separately from confirmed defects. The active four-hour Module 2 validator will continue the payment-certificate retry independently.

## Evidence locations

The full matrix and result record remain in `research/module_stress_test_plan_2026-08-16.md`. The scheduled Module 2 validation state and first-run handover are recorded in `research/module2_validation_log.md` and the durable database tables.

## 2026-08-17 audit and background retry status

The earlier **58 passing tests** figure is historical: it was recorded before the later Module 2 payment-date, normalization, review-warning, and Module 5 rate-override regression coverage was added. The current direct Vitest run reports **69 passing tests across 19 test files**, with zero failures, zero pending tests, and a successful production build. The two figures therefore refer to different project checkpoints rather than conflicting current results.

The live stress workstream remains **open**. A project-level four-hour background retry has been activated through 2026-08-23 to revisit the pending live scenarios. A scenario will count only when the published Gemini-backed flow reaches review and produces a downloadable PDF; deterministic/unit tests and temporary-capacity responses remain insufficient. Module 3 has now completed its requested three-scenario live coverage; Modules 1, 2, and 4–6 remain open until each has three such confirmations.

## Capacity audit

Recent proxy metrics show intermittent upstream behavior rather than a persistent local failure: successful Gemini requests were recorded on 2026-08-17 between 08:28 and 09:23, while the recurring unsuccessful live stress attempts return `429` with the normalized `UPSTREAM_CAPACITY` code in approximately two seconds. This supports retaining spaced retries and capacity logging, rather than repeatedly re-running the same scenario at short intervals or misclassifying the outcome as an application defect.

The durable Module 2 validation table confirms that scheduled validation is continuing: the project Heartbeat recorded successful review/PDF-ready multi-line certificates at 00:10, 04:10, 08:05, and 08:20 UTC on 2026-08-17. Its 12:07 UTC run recorded `capacity` with the same bounded retry instruction. These are genuine scheduled operational results, but the generic Module 2 validation scenario is retained as supporting evidence rather than being used to substitute for the separately logged three-scenario stress matrix.

