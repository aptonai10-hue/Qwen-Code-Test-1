# CivilDocs Loading Staircase and Data-Safety Validation

**Test date:** 2026-08-19  
**Scope:** CD-01 through CD-06 shared generation workflow  
**Result:** Passed before publication

## Implemented safeguards

The shared request controller now uses elapsed request time rather than simulated completion. Nothing is displayed for the first 300 ms. At 300 ms it presents a compact inline spinner; at 1 second it presents a module-shaped skeleton; and after 10 seconds it presents a monotonic request-status bar. The status bar advances only at documented elapsed-request stages while the request remains unresolved. It clears immediately on either success or failure.

| Elapsed request time | User-visible state | Behaviour |
|---:|---|---|
| 0–300 ms | No loader | Prevents a loading flash for fast responses. |
| 300 ms–1 s | Inline spinner | Shows a minimal contact state. |
| 1–10 s | Output-shaped skeleton | Preserves each module’s table column count and expected row structure. |
| 10 s+ | Status bar | Moves only forward at elapsed-request milestones; it is not a fake completion indicator. |
| 42 s | Retry-ready terminal state | Aborts the client request, removes every loader, preserves the draft, and presents a retry action. |

The form workflow persists non-empty entries locally by module, restores the saved draft after a refresh or failed request, disables repeated submission while active, detects offline state, warns before leaving unsaved work, and gives an explicit PDF-ready/re-download confirmation after successful generation.

## Failure and recovery validation

Two preview-only controlled 1.4-second failures were used solely to exercise the actual browser UI; this hook is restricted to preview/localhost hostnames and matching QA query flags, so it cannot run on the public domain.

| Module | Controlled condition | Observed loader path | Terminal state | Draft preserved |
|---|---|---|---|---|
| CD-02 Interim Payment Certificate | Delayed preview-only request rejection | Inline spinner → payment-certificate skeleton with five table columns | Loader removed; error copy and Retry button shown | Yes; every entered valuation field remained visible. |
| CD-06 Site Inspection & Defect Log | Delayed preview-only request rejection | Inline spinner → inspection skeleton with ten table columns and eight expected rows | Loader removed; error copy and Retry button shown | Yes; a browser reload restored the saved project, observations, weather, and inspection data. |

The offline event was also simulated in the CD-06 preview. The form presented the offline recovery message, disabled generation, retained the saved draft, and was returned to online state after verification.

## Deterministic regression evidence

`client/request-lifecycle-utils.test.js` covers the requested staircase thresholds, a deliberately slow Payment Certificate request that reaches a terminal timeout, and a deliberately failed Site Inspection request that reaches error before later progress stages can appear. The final full suite passed **89 tests across 21 files**, and the production build completed successfully.

