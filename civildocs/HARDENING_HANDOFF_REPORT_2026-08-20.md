# CivilDocs AI Workflow Hardening Handoff

**Release checkpoint:** `589c0830`  
**Published domain:** [civildocs-zuztwkvm.manus.space](https://civildocs-zuztwkvm.manus.space/)  
**Prepared for:** Experienced civil engineers and technical reviewers  
**Date:** 20 August 2026

## Executive status

CivilDocs has completed a substantial hardening pass across the six-document engineering workflow. The release now validates AI response structure before normalization or PDF rendering, preserves deterministic behavior for repeated CD-01 inputs, protects the Gemini proxy from oversized prompts, gives actionable failure messages, sanitizes stale or invalid dates and numeric controls in key modules, and cancels active requests when the user navigates away.

The automated regression baseline is **124 passing tests across 28 test files**, and the production build completes successfully. The published deployment responds over HTTPS. A direct request to the public `/api/gemini` endpoint with an empty prompt returned **HTTP 400**, confirming that the required-input boundary is active without using a live Gemini generation request.

This is a strong release candidate, but it should not be described as a mathematically or operationally “100% foolproof” system. AI-generated engineering documents remain drafts that require review, source-record checking, and professional certification by the responsible engineer.

## Hardening completed

| Area | Implemented control | Verification |
|---|---|---|
| AI response structure | Shared validator rejects malformed objects, invalid arrays, unsafe physical quantities, and oversized item lists before review/PDF generation. | Dedicated response-validation tests plus full suite. |
| JSON extraction | Parser can ignore surrounding prose and select a later schema-valid JSON object instead of accepting the first malformed object. | Three focused parser tests plus production build. |
| CD-01 repeat stability | Exact-input local cache returns the last successful normalized result for identical Bid Package Builder inputs, avoiding a second Gemini call and preventing repeat drift. | Repeat-stability regression tests and existing CD-01 evidence. |
| CD-02 repeat stability | Exact-input local cache now returns the last successful payment-certificate candidate for identical values, preventing a second Gemini call from changing valuation-line splits. | New module-isolated cache test; 124/124 full suite passes; published asset inspection confirms the branch is live. |
| Prompt safety | Proxy rejects prompts over 50,000 characters before contacting Gemini. | Server proxy test; public empty-prompt boundary returned HTTP 400. |
| Proxy errors | Capacity, timeout, model-not-found, empty response, invalid response, rate limiting, and oversized prompt states have separate user-facing messages. | Proxy and client error-message tests. |
| Proxy security | API key remains server-side; browser code contains neither the Gemini key name nor the direct Google endpoint. Responses are marked non-cacheable and basic security headers are applied. | Credential/source inspection and production build. |
| Date integrity | Payment issue/due dates, Variation submission dates, NCC compilation dates, and escalation assessment dates are derived from the current date or explicit user input rather than stale model output. | Date-focused module tests and prior published date evidence. |
| Numeric integrity | Negative project values, invalid years, invalid escalation percentages, negative duration, invalid notice periods, and invalid floor values are sanitized. | Grade and escalation regression tests. |
| Navigation safety | Active AI requests are cancelled when switching modules or returning home, preventing late responses from corrupting the next screen. | Build and full regression suite. |
| Portable endpoint safety | A template Replit runtime URL now falls back to the same-origin proxy instead of breaking the live Manus browser; a genuine HTTPS Replit URL remains usable after Cloudflare deployment. | Three focused endpoint tests plus full regression/build validation. |
| Loading and recovery | Existing staircase loading, timeout, offline, draft preservation, retry, before-unload, and review safeguards remain covered. | Request-lifecycle tests and prior published safety evidence. |

## Automated verification

The current local verification result is summarized below. The expected timeout-related error logs from the proxy tests are diagnostic output from deliberately stalled upstream simulations; the tests themselves pass.

| Measure | Result |
|---|---:|
| Test files | 28 passed |
| Tests | 124 passed |
| Production build | Passed |
| TypeScript diagnostics | No errors reported by the managed development service |
| Published root response | HTTP 200 |
| Published empty-prompt proxy boundary | HTTP 400 |
| Published proxy probes | CD-01, CD-02, CD-03, CD-04, CD-05, and CD-06 each returned HTTP 200 after throttle handling |
| Current release checkpoint | `6e3efc3a` |

## Published evidence and limits

The broader adversarial campaign remains governed by the evidence matrix in `research/final_stress_execution_matrix_2026-08-19.md`. A renewed public-browser pass closed the CD-01 repeat, small-project, currency, ZPPA-structure, ambiguity, refresh, and controlled-failure cases; CD-02 baseline quality and real failure recovery; and the controlled public recovery cases for CD-03 through CD-06. A newly observed CD-02 line-split divergence was corrected with the same bounded cache pattern as CD-01; the published asset was verified to contain it. The remaining unresolved observations are five explicit pending checks—post-fix CD-02 browser repeat/date, CD-02 sequencing, CD-03 contractual-basis comparison, CD-03 repeat, and S.6 sub-second loading—plus four external blocks: CD-01 large 35-item request, CD-02 near-boundary quality, CD-04 low-years criterion, and the matrix’s historic provider block. They remain non-passes.

Previously captured published evidence covers the major professional-risk areas, including contract-sum overrun detection, negative valuation corrections, date arithmetic, practical material quantities, rate overrides, cap/floor disclosure, large inspection item counts, multi-page PDFs, draft restoration, offline recovery, before-unload protection, timeout handoff, and monotonic loading-state transitions. The latest public-browser pass added two text-identical four-page CD-01 PDFs from the same input—11 lines and K24,788.15 each—plus an ambiguous 13-line repair BOQ totaling K61,597.40. A normal CD-02 certificate retained four distinct civil-work lines and reconciled K200,000.00 previous plus K75,000.00 current to K275,000.00, with K7,500.00 retention and K67,500.00 net; its PDF shows 2026-08-20 issue and 2026-09-03 due date. Controlled public network-failure checks retained complete drafts and exposed Retry for CD-01 through CD-06. The six-module proxy probe also returned HTTP 200 candidates for every module after throttle handling; these remain proxy-generation evidence rather than substitute PDF passes.

> **Engineering-use condition:** Every generated document remains a draft until the responsible engineer checks the source records, contract conditions, drawings/specifications, measured quantities, rates, approvals, dates, and certification authority.

## Known operational considerations

The Gemini service can still return transient 429 or 503 capacity responses. CivilDocs now reports those states clearly, applies bounded retries and model fallback on the server, protects the shared proxy with basic per-IP throttling, and preserves the user’s draft for retry. These controls improve reliability but cannot guarantee upstream availability.

The local CD-01 repeat cache improves stability for an engineer repeating exactly the same input on the same browser. It is intentionally bounded and local-only; it is not a shared server cache and does not make different inputs equivalent.

The rate-reference table is a documented estimate and must be checked against current supplier quotations, agreed contract indices, and project-specific procurement records before commercial use. It is not a substitute for a signed rate schedule.

## Handoff recommendation

Use the current checkpoint as the release candidate. The corresponding upload archive must be rebuilt after this evidence update. It should exclude `.project-config.json`, `.env` files, dependencies, generated output, and logs, and pass a source credential audit. Distribute it only with the deployment guide and environment template. Configure `GEMINI_API_KEY` on the Replit backend, set the Cloudflare Pages runtime proxy endpoint to the Replit URL, configure the allowed frontend origin, and never place the Gemini credential in Cloudflare-served JavaScript or repository files.

For the six-engineer trial, ask reviewers to record the project inputs, generated review values, edited values, final PDF values, and any source-record discrepancy. The most valuable feedback will be concrete: module, input field, expected engineering result, observed result, PDF page or section, and whether the issue is a calculation, date, source, wording, or usability defect.

## References

[1]: https://civildocs-zuztwkvm.manus.space/ "CivilDocs published domain"
[2]: https://ai.google.dev/gemini-api/docs "Google Gemini API documentation"

