# CivilDocs Current-State Readiness Report

**Assessment date:** 21 August 2026  
**Current public release:** `c87d6afc`, with final handoff record `feaa19b7`  
**Intended use:** Controlled testing by the six invited engineers

## Executive conclusion

**CivilDocs is ready for a controlled, invitation-only test with your six engineers.** The core six workflows have working pilot implementations, the selected live module scenarios were generated and reviewed on the published domain, the two discovered PDF-content defects were repaired and revalidated, and the current build passes **48 test files / 180 tests**, TypeScript checking, and a production build. [1] [2]

It is **not** ready for an unrestricted paid SaaS launch. The product intentionally has no active account system, no purchase flow, browser-local rather than account-synchronised drafts, incomplete durable abuse controls and observability, and outstanding legal, privacy, support, and commercial operations work. Those are business and operational release blockers, not a reason to postpone a small, supervised pilot. [3]

> **Recommended decision:** Give the current link to the six engineers, ask them to use it on representative work, and collect structured feedback. Do not yet take paid subscriptions or describe it as a fully launched commercial SaaS.

## What works now

| Area | Current capability | Readiness for six-engineer test |
|---|---|---|
| Access gate | The public page shows a disabled orange **Use for free** button until the Pilot Terms checkbox is accepted. Document modules are hidden before entry. | Ready. |
| Document access protection | A document workspace will not open without both the browser-local current Terms acceptance and the current pilot session. | Ready. |
| CD-01: Bid Package Builder | Generates a ZPPA-style bid-package draft, including BOQ, tender cover letter, and drawings/technical-reference checklist. | Ready for pilot use and targeted stress testing. |
| CD-02: Interim Payment Certificate | Produces valuation and certification drafts, including the established normal-value arithmetic scenario. | Ready for pilot use and boundary testing. |
| CD-03: Variation and EOT Claims | Produces variation/EOT claim drafts with reviewed cost and time-impact handling. | Ready for pilot use and combined-claim testing. |
| CD-04: NCC Portfolio | Produces an NCC-grade-upgrade portfolio draft and reconciles supplied project values. | Ready for pilot use and eligibility-boundary testing. |
| CD-05: Escalation Clause Builder | Produces material escalation calculations and schedule drafts; the confirmed four-material baseline reconciled to **K145,317.50**. | Ready for pilot use; this should receive the deepest tester scrutiny. |
| CD-06: Site Inspection and Defect Log | Produces inspection/defect drafts with contractor responsibility, corrective action, due-date, and evidence fields. | Ready for pilot use and larger-item-count testing. |
| Draft safety | Form values save in the browser as users type, restore after reload, and remain available after a controlled generation failure. | Ready, with browser-local limitation. |
| Failure recovery | Failure UI explains the reason, what happened, why, and next action; it provides manual retry and one bounded four-minute automatic retry. | Ready. |
| Export | Current and saved drafts can be downloaded as PDF and Word-compatible documents without sending export content to the server. | Ready. |
| Accessibility and mobile | Visible focus states, labelled controls, live-status messaging, Escape dialog dismissal with focus return, touch-friendly controls, and a reviewed 375×812 phone layout. | Suitable for pilot; external screen-reader testing remains outstanding. |
| Security baseline | Server-side Gemini secret, prompt-size cap, timeout/model fallback, CSP and browser-security headers, request ID, and privacy-safe outcome logging. | Suitable for controlled pilot. |

## Evidence and quality level

The core functional evidence is encouraging. A production-browser validation exercised all six modules and inspected the resulting PDFs. All six selected priority workflows passed after two identified document-quality defects were corrected: the bid package lacked complete tender sections and the site-inspection defect log lacked clear responsibility and a dedicated corrective-action register. Both were repaired, regression-tested, redeployed, and rechecked on the public site. [1]

The latest user-facing release also has direct evidence for the entry gate. In a clean browser state, the orange free-entry action was disabled and the document-module list did not appear. Accepting the Terms enabled the action; selecting it revealed the six-module register. Clearing the acceptance/session then attempting a document route returned to the gate rather than opening the form. The same entry experience was reviewed on desktop and a 375×812 phone viewport. [2]

| Validation layer | Latest available result | Interpretation |
|---|---|---|
| Automated regression suite | **48 files / 180 tests passed** | Strong regression signal for the implemented behaviours, calculations, UI controls, security handling, and exports. |
| Type checking | Passed | No detected TypeScript compile errors. |
| Production build | Passed | The deployable build completed. |
| Live selected module flows | **6 of 6 passed** after repairs | Confirms the core pilot paths work on the published application. |
| Desktop and phone visual reviews | Passed | The gate, unavailable states, rate tiers, and entry flow remained usable at the reviewed layouts. |
| Full attached pre-handoff stress matrix | **Not yet executed in full** | This remains the principal next validation step, not a known functional failure. |

## How well it is working

For a focused pilot, the product is working **well enough to test real workflows**. It has a clear entry rule, protects form access behind Terms acceptance, preserves local work during normal reloads and controlled service failures, and supports a useful end-to-end loop: choose a workflow, complete the form, review the result, and export it. The UI is deliberately honest about unavailable account, sign-up, Google sign-in, purchase, and plan-tier controls.

The greatest remaining uncertainty is not whether the basic flows work; it is **how robust the document outputs are at the widest boundaries**. The attached pre-handoff matrix correctly concentrates on high-value scenarios, long lists, extreme values, repeated inputs, negative/zero boundaries, document pagination, and unusual language. Those cases were not all executed individually, so testers should treat this pilot as an evidence-gathering exercise rather than a substitute for professional project controls.

## Known limitations and conditions for testing

| Limitation | What it means for testers | Current mitigation |
|---|---|---|
| No user accounts | There is no sign-in, password recovery, organisation role, or cross-device workspace. | Sign-in/sign-up controls are visibly unavailable; use the same browser/device during a test session. |
| Browser-local drafts | Clearing browser data, changing device, or using a different browser can remove drafts and profile defaults. | Export important work as PDF or Word before device/browser changes. |
| No active payment flow | Rate tiers are illustrative for the pilot only. | Purchasing controls are unavailable. |
| AI-generated content | Outputs can require factual, legal, contractual, and engineering review. | The interface requires professional review before use; do not submit unreviewed drafts. |
| Operational scale controls | Distributed rate limiting, durable monitoring, and formal on-call support are not complete. | Keep access limited to the six invited engineers and monitor feedback manually. |
| Accessibility validation | Internal keyboard and layout checks are complete; representative external screen-reader validation is not yet recorded. | Ask at least one tester to report keyboard, zoom, and assistive-technology issues. |
| Full stress validation | The full comprehensive matrix has not been run individually on the production domain. | Use the supplied suite as the pilot test plan and record pass/fail evidence. |

## Recommended pilot method for the six engineers

Run the pilot as a controlled evaluation. Give each engineer the public link and ask them to begin by accepting the Pilot Terms, selecting **Use for free**, and working through one or two representative documents on their own device. They should export any draft worth retaining before clearing browsing data. They should not use an AI-generated output as an approved tender, certificate, variation, payment, NCC submission, or inspection record without the appropriate professional and contractual review.

The best test allocation is to assign each engineer one primary module and one cross-module safety check. Prioritise CD-05 escalation calculations, CD-02 certificate boundary values, CD-03 combined variation/EOT reconciliation, CD-04 eligibility limits, CD-06 long inspection lists and PDF pagination, and CD-01 BOQ scale and ZPPA structure. The most useful feedback will include the module, the scenario, the exact input values, the visible result, the exported PDF/Word result, and whether the draft stayed intact after a retry or refresh.

## Go / no-go decision

| Decision | Status | Rationale |
|---|---|---|
| Invite the six engineers to test | **GO** | Current workflows, pilot gate, local draft safety, exports, error recovery, responsive layout, and primary live validation evidence support a small controlled pilot. |
| Use for real work with professional review | **GO, with caution** | Treat outputs as editable draft material; independently check all quantities, rates, dates, terms, approvals, and signatures. |
| Open to unrestricted public users | **NO** | Durable operational controls, support ownership, and full boundary testing are not complete. |
| Turn on paid subscriptions | **NO** | Accounts, storage, billing, legal/privacy, support, and abuse-control requirements remain incomplete. |

## Immediate next actions

First, run the provided pre-handoff stress suite against the published domain and maintain a pass/fail log with exported-document checks. Second, prioritise fixes for any calculation inconsistency, missing line item, unpreserved draft, pagination issue, misleading error, or accessibility barrier found by the engineers. Third, only after that evidence is complete should the team decide whether to extend the pilot, introduce accounts and shared storage, or begin paid-launch preparation.

## References

[1]: ./CivilDocs_Pilot_Validation_Report.md "CivilDocs Pilot Validation Report"
[2]: ./Pilot_Entry_Gate_2026-08-21.md "CivilDocs Terms-Gated Pilot Entry Verification"
[3]: ./SaaS_Readiness_Review_2026-08-20.md "CivilDocs SaaS Readiness Review"

