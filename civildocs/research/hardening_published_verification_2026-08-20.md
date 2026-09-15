# Hardening Published Verification — 2026-08-20

The published URL `https://civildocs-zuztwkvm.manus.space/` was opened successfully. The extracted page title was CivilDocs and the visible text included “Field register / select document”, “Choose a document to begin.”, and “Prepare a draft, review the figures, then generate a PDF.” This confirms the public deployment responds and serves the CivilDocs shell.

A follow-up browser inspection was attempted to inspect the dynamic six-card register and runtime state, but the browser session reported `Browser not available`. Therefore, no claim is made here about interactive card behavior from this attempt. The local preview screenshot and automated build remain available as supporting evidence.

## Direct HTTP evidence

At 2026-08-20 03:52 UTC, the published root returned HTTP 200 through Cloudflare and served the current Vite JavaScript asset `/assets/index-Dl8c-tV-.js` plus `/runtime-config.js`. A POST to `/api/gemini` with an empty prompt returned HTTP 400, confirming the public proxy rejects the required-input boundary without consuming an upstream generation request. No live Gemini generation was used in this verification step.

## Six-module published proxy probe

At 2026-08-20 04:01:58 UTC, six realistic prompts were sent sequentially to the published `/api/gemini` endpoint. CD-01 returned HTTP 200 with a candidate payload of 6,233 text characters in 24,483 ms. CD-02 returned HTTP 200 with a 490-character candidate in 3,887 ms. CD-03 returned HTTP 200 with a 1,463-character candidate in 4,301 ms. CD-04, CD-05, and CD-06 returned HTTP 429 with code `RATE_LIMITED` after the proxy's three-request-per-minute per-IP limit was reached; no upstream candidate was returned for those three calls. This is evidence that the public proxy can generate for Modules 1–3 and that the throttle is active. It is not a review/PDF pass for any module and does not convert the remaining stress cases into passes.

The throttle-window follow-up completed at 2026-08-20 04:04:13 UTC. CD-04 returned HTTP 200 with a 3,895-character candidate in 31,791 ms; CD-05 returned HTTP 200 with a 2,374-character candidate in 6,044 ms; CD-06 returned HTTP 200 with a 2,561-character candidate in 4,943 ms. These are successful published-proxy generation results, not review/PDF acceptance results.

## Post-fallback published proxy and browser check

At 2026-08-20 08:13 UTC, after the browser endpoint fallback fix was published, a real POST to the same-origin public `/api/gemini` endpoint returned HTTP 200, one candidate, and the requested JSON content `{"status":"civil-docs-proxy-ok"}`. Response headers included `cache-control: no-store`, `x-content-type-options: nosniff`, and `x-manus-proxy-mode: transparent/1`. This proves the public server-side Gemini proxy remains reachable after the endpoint fix.

An interactive CD-01 form submission was initiated with the previously captured small-project control input. The initial run, before the fallback release, exposed the placeholder endpoint defect as the UI correctly preserved the draft and showed Retry. After release, the browser session became unavailable during a reload/inspection attempt (`Browser not available`). Consequently, public review-card and PDF completion evidence cannot be claimed from this browser session. The limitation is classified as a test-environment block, not a pass or an application failure.

## Renewed browser evidence

The published browser session recovered later on 20 August. Two identical CD-01 small-project submissions were successfully reviewed and exported. Both runs had 11 BOQ lines, K24,788.15 tender price after discount, and four-page PDFs with identical extracted text. The public PDF includes the expected ZPPA-style bidder components and two-decimal currency values.

A normal-range CD-02 Certificate 2 run successfully completed review and PDF export. It retained four distinct descriptions—excavation/earthworks, reinforced concrete drains, stone pitching, and manholes/reinstatement—and reconciled K200,000.00 previous plus K75,000.00 current to K275,000.00 cumulative. The K7,500.00 retention produced K67,500.00 net. Its PDF dated the certificate 2026-08-20 and payment due 2026-09-03 (14 days).

The subsequent near-boundary CD-02 Certificate 3 input (K420,000.00 previous and K60,000.00 current) entered the same public request lifecycle but reached the clear retry-ready Gemini failure state. The complete populated form remained visible after failure. This provides public failure-recovery evidence but not a line-item-quality pass for the near-boundary case.

A prepared CD-03 combined claim was also subjected to a deliberate browser-side network failure. The live public page retained the Mongu project, contract MFD/2026/017, Both claim type, K375,000.00 impact, 45-day impact, EI-MFD-2026-17 reference, dates, and rationale while displaying the explicit failure message and Retry button. The normal browser fetch implementation was restored after the controlled test.

A public CD-04 portfolio failure simulation retained Kafue Infrastructure Contractors Ltd, Grade 5-to-Grade 4 target, registration/application references, eight years in operation, staff and equipment narrative, and the full K12,500,000.00 completed-project evidence row. The same clear Gemini failure copy and Retry control appeared, after which normal fetch was restored.

A public CD-05 failure simulation retained the complete escalation data: Kapiri–Ndola project, K32,000,000.00 contract value, dates, threshold/cap/floor controls, notice period, risk allocation, and a Cement 850-bag schedule with K160.00 base and K202.00 current rate. The clear error and Retry state appeared and fetch was restored.

A public CD-06 failure simulation retained the complete Ndola inspection context and four detailed severity observations, including the supplied 6 m², 18 m³, and 24 m² quantities. The explicit failure and Retry state appeared; normal browser fetch was then restored.

The restored CD-01 form displayed its device-draft confirmation and retained all tender particulars. A deliberately altered project title bypassed the bounded repeat cache; the public controlled network failure retained all form content and exposed the clear error and Retry control. Normal browser fetch was restored after the test.

An ambiguous public CD-01 scope (`general repairs`) completed review and PDF generation. The 13-line generic BOQ remained recognizably municipal-repair work, retained whole discrete units, used the rate-reference/BDS verification language, and reconciled to K61,597.40. This is a quality pass for an intentionally broad scope, not a substitute for engineer-defined quantities.

After the CD-02 repeat-instability fix was published, the fresh public JavaScript asset was retrieved directly and verified to contain both the module-scoped `repeat-cache.v1` implementation and the `identical payment certificate inputs` cache branch. The browser session became unavailable before an interactive second cache-enabled Certificate 2 run could be captured; therefore the code and build are verified publicly, while the post-fix interactive repeat remains a browser-environment follow-up rather than a claimed pass.

