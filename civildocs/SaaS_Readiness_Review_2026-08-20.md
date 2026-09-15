# CivilDocs SaaS Readiness Review

**Review standard:** High-bar pilot and pre-commercial SaaS assessment  
**Review date:** 20 August 2026  
**Scope:** Mobile usability, onboarding, accessibility, reliability, security posture, performance, observability, and support operations.  
**Release status:** **Ready for controlled pilot testing; not yet ready for an unrestricted paid SaaS launch.**

## Executive Assessment

CivilDocs now provides a coherent, mobile-first controlled-pilot workflow. The test gate prevents misleading account or payment expectations, affirmative acceptance of the current pilot terms is stored locally before entry, form values are stored locally as they are entered, and the generation flow provides a precise recovery path rather than deleting work. The review also adds browser-facing security headers and removes operational Gemini metrics from production exposure.

The largest remaining launch risks are not presentation defects. They are the absence of real account identity, durable multi-instance rate limiting and metrics, formal incident/support operations, an independently reviewed privacy/terms package, and commercial billing controls. Those areas should be completed before accepting general paid customers or positioning the service as a fully operational high-value SaaS.

| Area | Status | Severity | Direct evidence | Required action before unrestricted paid launch |
|---|---|---|---|---|
| Mobile UX | Pass | Low | Final 375×812 review shows a task-led document register, stacked administrative context, readable controls, 46px mobile fields, safe-area spacing, and no clipped primary actions. | Test on physical iOS and Android devices before public launch. |
| Onboarding | Pass for pilot | Low | Free-entry pilot gate, visible Founding Engineer, Professional, and Firm pilot plan cards with unavailable purchase controls, unavailable login/sign-up/Google states, six-form register, and versioned affirmative local pilot-terms acceptance. | Add real authentication, verified organisation onboarding, and server-recorded consent capture for paid access. |
| Draft safety | Pass for pilot | Low | Per-keystroke browser-local drafts, restoration, and preserved failure inputs were exercised in the UX validation record. | Add encrypted server-side account sync and an export/retention policy for paid users. |
| Failure recovery | Pass for pilot | Low | Failure panel supplies reason, what happened, why, next action, a manual retry, cancellation, and one four-minute automatic retry. | Add server-side job status and durable retry/queue handling for account-based production. |
| Accessibility | Substantial pass | Medium | Labels, semantic buttons, live status areas, visible focus styles, reduced-motion handling, and mobile font sizing are in place. | Run screen-reader and keyboard-only testing with external users; resolve any findings. |
| Security headers | Improved | Medium | CSP, clickjacking denial, feature restrictions, content-type protection, referrer policy, and cross-origin opener policy are now applied. | Add automated deployment-level header verification and review CSP reports after launch. |
| API abuse controls | Partial | High | Prompt-size limit, request timeout, CORS allow-list support, and an in-memory IP limiter exist. | Replace in-memory limiting with a durable distributed limiter/WAF policy before scaling across instances. |
| Secrets | Pass in current hosting | Medium | Gemini key remains server-side; Cloudflare handoff requires an encrypted Worker secret. | Rotate launch keys, limit secret access, and establish a documented rotation process. |
| Performance | Pass for pilot | Low | Reconciled production build: JavaScript **134.03 kB** / **38.85 kB gzip** and CSS **31.93 kB** / **6.93 kB gzip**; built in 268 ms. | Add real-user performance monitoring and test slow 3G/low-memory devices. |
| Observability | Improved but partial | High | Request metrics and owner notification paths exist; public metrics exposure is removed in production; each AI outcome now emits a request-correlated, privacy-safe structured server log without prompt, project data, client IP, API key, or upstream body. | Send those logs/metrics/errors to a durable monitored service with alert thresholds and an on-call owner. |
| Support operations | Partial | High | Pilot pricing page prepares a feedback message without transmitting it automatically. | Publish verified support contact, response-time commitments, incident process, and user-facing service-status page. |
| Legal/commercial readiness | Partial | High | Pilot terms explicitly say paid launch needs legal entity, privacy, and legal review. | Complete legal review, privacy notice, data processing terms, tax/invoicing, refunds, billing, and subscription enforcement. |

## Fixes Included in This Review Loop

The mobile baseline now protects against common phone-browser failure modes. Controls use touch-friendly sizing, inputs use a 16px mobile font size to avoid unintended browser zoom, the shell and footer respect device safe-area insets, and focus visibility is consistent for mouse, keyboard, and assistive-technology users. The entry masthead now uses a CSS-built structural mark rather than relying on an external image response, removing a production-discovered broken-logo dependency while retaining the engineering-document visual language.

The server now applies a restrictive Content Security Policy while allowing only the required first-party resources, Google Fonts, and the jsPDF CDN. It also sets frame, feature, content-type, referrer, and cross-origin opener protections. `GET /api/gemini/metrics` now returns a 404 in production, rather than exposing internal request activity to the public internet.

Every AI endpoint response now includes a request identifier. The server emits a structured outcome record containing only the request identifier, HTTP status, duration, and safe error code. The record deliberately excludes the prompt, generated document content, project details, client IP address, credentials, and upstream response body. This improves troubleshooting while maintaining the product’s device-local pilot privacy posture.

## Test Evidence

| Validation | Result |
|---|---|
| New security-header regression tests | 2 passing |
| TypeScript check after hardening | Passing |
| Reconciled full regression suite | 40 files / 158 tests passing |
| Pilot UX validation record | 10 documented scenarios passing |
| Phone screenshot review | 375×812 responsive entry experience reviewed |
| Desktop screenshot review | 1280×720 entry experience reviewed; document register is the visual primary object and account context is secondary |
| Final local mobile visual check | 375×812 review passed after replacing the production-broken image logo with a resilient CSS structural mark |
| Commercial-and-recovery mobile review | 375×812 review passed with the document register, plan cards, appearance control, unavailable purchase states, and terms gate visible without clipped primary actions |
| Controlled failure-recovery review | Preview-only simulated capacity error made no upstream AI request; it displayed Reason, What happened, Why, Next action, Try again now, Keep editing, a four-minute countdown, and preserved all entered values after manual retry |
| Published-client failure review | A browser-local simulated 503 response on the published escalation workflow made no upstream AI request; the live release displayed the same four-part recovery panel, manual retry, automatic-retry countdown, and preserved draft values. Normal browser networking was restored after the check. |
| Production build | Completed successfully in 268 ms; bundle sizes recorded above |

## Release Gates

> **Controlled pilot gate:** The current build is suitable for invitation-only evaluation with explicit professional-review notices and no payment collection.

> **Paid SaaS gate:** Do not open unrestricted paid subscriptions until the high-severity items above have durable solutions, a responsible operator is identified, and legal/privacy/commercial review is complete.

## Final Release Validation

The final public-domain review confirmed that the controlled pilot gate records affirmative browser-local terms acceptance and opens the six-document workspace. The published entry screen presents the document register as the primary task surface, with unavailable account controls demoted to administrative context. The final deployment also renders the masthead’s CSS structural mark without an external logo-image dependency.

The reconciled engineering validation passed **40 test files and 158 tests**, the TypeScript check, production build, Cloudflare Worker syntax check, desktop and 375×812 layout reviews, and the published pilot-entry interaction. The final controlled preview and safe browser-local published-client simulation deliberately exercised a capacity failure without sending a request upstream; both verified the four-part recovery panel, retained form values, manual retry, and bounded automatic retry countdown while the visible pilot plans and appearance control remained intact. The current release is therefore released for the stated controlled-pilot purpose; the unresolved high-severity paid-launch requirements remain explicitly blocked by the gate above.

### Post-release Reconciliation Note

The final published review retained the concurrent commercial additions: three visible pilot plan cards, unavailable purchase controls, a persistent light/dark appearance control, and clear Terms validation. A safe browser-local 503 simulation on the published escalation workflow was repeated through **Try again now**; the same values remained populated and the four-part recovery panel returned with a fresh bounded countdown. The normal browser networking function was restored immediately after the check, and no prompt was sent to the AI service.

The 375×812 release-build review confirmed that the pilot entry, register rows, Terms gate, administrative status, plan cards, touch targets, and footer flow stack without clipping. The public domain was separately checked for the entry and workspace interaction; this platform’s fixed browser viewport was supplemented with the release-build mobile renderer for the phone-specific layout verification.

## Recommended Next Review Cycle

First, introduce authentication with organisation roles and encrypted server-side draft storage. Next, move API rate limiting, request logs, and error alerts to durable managed services. Finally, complete billing, support, privacy, and incident-response operations before offering paid access beyond a tightly managed early-adopter group.

