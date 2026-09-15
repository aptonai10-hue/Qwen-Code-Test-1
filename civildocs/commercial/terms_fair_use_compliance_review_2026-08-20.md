# CivilDocs Terms and Fair-Use Policy: Compliance Review

**Review date:** 20 August 2026  
**Scope:** Current `terms_and_conditions_draft.md`, `fair_use_policy.md`, and the public Pricing & Fair Use screen  
**Status:** Working legal-risk review — **not formal legal advice**. A qualified Zambian lawyer should confirm the final wording, entity structure, tax treatment, privacy roles, registration position, consumer-law application, and dispute clauses before CivilDocs accepts payment or markets subscriptions.

## Executive conclusion

The documents have a sound commercial foundation. They correctly present CivilDocs output as an **editable draft**, require professional review, avoid claiming that pilot allowances are account-level paid entitlements, and reserve statutory rights that cannot lawfully be excluded. The most important launch risk is not a missing disclaimer: it is the gap between a draft policy and the operational facts required to support it.

CivilDocs should **not accept paid subscriptions yet**. Before paid launch, it needs a verified operator identity and contact route; a completed privacy notice and data-processing model; Data Protection Act registration analysis and action; transparent tax-inclusive or tax-exclusive checkout disclosure; account-level metering that matches the promised monthly reset; an affirmative recorded acceptance flow; and final counsel review of liability, indemnity, cancellation, marketing and consumer-rights wording.

> **Risk scale:** Critical means do not launch paid service before closure. High means close before accepting ordinary customers. Medium means close before scale or before a disputed transaction becomes likely. Low means sensible refinement rather than an immediate blocker.

| Priority | Finding | Current wording / operational fact | Why it matters | Required action before paid launch |
|---|---|---|---|---|
| **Critical** | Operator identity and support route are incomplete | The Terms still contain `[Legal Entity Name]`, physical address and legal-contact placeholders. The feedback feature has no configured public support email. | Electronic and consumer-facing sales need a clearly identifiable counterparty and reliable notice/cancellation route. A contract with blank operator details is commercially and evidentially weak. | Insert the registered entity name, physical/business address, support email, legal-notice email, company/TPIN/VAT details where applicable, and a working cancellation route. Test them publicly. |
| **Critical** | No production privacy notice or documented data-role model | Clause 7 says a privacy notice will exist before commercial launch; it does not yet say who is controller versus processor, which providers receive data, or how people exercise rights. | The Data Protection Act applies to automated processing and requires lawful, fair, transparent, purpose-limited, proportionate and secure processing. It recognises controller/processor responsibilities and data-subject rights.[1] | Publish a separate privacy notice before collecting paid-account or feedback data. Map data flows, specify controller/processor roles, document model/hosting providers and transfer locations, retention, security, rights requests and complaints contact. |
| **Critical** | Registration and processor compliance are deferred | The Terms say to “confirm” registration/licensing obligations. The regulator FAQ says public and private organisations and individuals processing personal data must register with the ODPC under the Act and Regulations.[2] | A terms disclaimer does not cure an unresolved regulatory registration requirement. | Obtain written Zambia-law advice on the applicable controller/processor registration position and complete any required registration before commercial processing. Keep evidence of the decision and registration. |
| **Critical** | The paid fair-use promise cannot yet be enforced account-wide | The screen explicitly says the tracker is device-local. It can be cleared, does not identify a named user, and does not aggregate across browsers/devices. | A 30-generation “per named user” or 150-generation “per Firm account” entitlement needs named-user authentication and server-side metering. Otherwise the customer-facing promise and actual enforcement differ. | Keep the feature labelled pilot/local only. Do not sell or invoice plans based on these caps until named-user accounts, firm-seat controls, server-side usage records, resets and support adjustment procedures are live. |
| **High** | Local-month wording conflicts with the policy’s Central Africa Time reset | The app says the tracker resets in a new **local calendar month**. The policy says 00:00 Central Africa Time. | A customer outside Zambia, or a device with another timezone, could see a different reset and dispute a cap. | For the pilot, say “this browser’s local calendar month” everywhere. For paid service, meter on the server in Central Africa Time and display the next reset timestamp. |
| **High** | Pricing lacks a tax status and final checkout disclosure | The pricing page displays ZMW 199, ZMW 299 and ZMW 1,199. The Terms state prices exclude legally applicable taxes, but the public price page does not. | The ECTA applies to electronic transactions and supports electronically accessible, retained agreement terms; transparent price and supplier information are central to electronic-commerce compliance.[3] Consumer-protection law also addresses unfair terms and unfair trading conduct.[4] | Put “VAT inclusive” or “VAT excluded; VAT added where applicable” beside each price. At checkout show the total charge, currency, tax, recurring frequency, renewal date, cancellation method, allowance, overage rules and payment receipt. |
| **High** | Acceptance evidence is too general | Clause 1 allows acceptance through use after notice, payment, or a click. It does not require an affirmative acceptance record or preserve the exact terms version shown. | The ECTA gives legal effect to data messages and recognises electronic signatures/expressions of intent, while accessible and retainable agreement material supports incorporation and evidence.[3] | Use an unticked acceptance control linked to the exact terms, privacy notice and fair-use version. Save user/account, timestamp, IP/session evidence, order price, version hash and a downloadable copy. Do not rely solely on “use after notice” for material paid terms. |
| **High** | AI-provider and cross-border disclosure is too vague | The Terms say AI processing “may involve authorised hosting and model providers.” | Users need meaningful transparency about recipients, countries/transfer safeguards, sensitive-data restrictions and retention. Generic disclosure is not a substitute for a data-flow explanation. | Name provider categories and locations where reasonably possible; specify that project inputs may be processed by the selected model provider; prohibit sensitive data unless a reviewed lawful basis and safeguards exist; set out the transfer mechanism in the privacy notice. |
| **High** | Liability and indemnity are commercially broad | The liability cap is three months’ fees and the indemnity covers “final use of a generated document.” | Consumer-protection rules may restrict unfair or overly one-sided terms. A broad indemnity for all final use could be disputed and is not aligned to a customer’s controllable conduct. | Obtain counsel review. Narrow indemnity to third-party claims caused by the customer’s breach, unlawful inputs or infringement; add process, notice and defence-control rules; decide express carve-outs for fraud, wilful misconduct, confidentiality/data-protection breaches and non-excludable statutory liability. |
| **High** | Refund/cancellation wording needs a consumer-law and payment-flow check | Clause 4 says started billing periods are non-refundable except where law requires otherwise. | The wording preserves mandatory law, but the actual cancellation, refund, renewal and payment workflow is not yet implemented. A clear practical remedy path is needed. | Have counsel confirm the treatment of business users and any consumer rights. Publish a plain-language cancellation/refund procedure, deadline, contact route and response time. Do not promise automatic renewal until billing can implement it. |
| **High** | Marketing controls are absent from the commercial-policy set | A Founding Engineer conversion email exists, while the terms/fair-use materials do not state marketing preference or unsubscribe handling. The ECTA includes rules for commercial communications, and the DPA regulates consent and objection to personal-data processing.[1] [3] | Pilot conversion outreach can create a privacy and electronic-marketing compliance issue even where it is not a product feature. | Before sending marketing campaigns, obtain advice on the applicable consent/opt-out model; include a clear unsubscribe or preference route, suppress opted-out contacts, record source/consent, and separate service notices from marketing. |
| **Medium** | “Completed generation” is not completely aligned with technical behavior | The policy says a completed candidate counts; the app increments after a successful model response but before PDF rendering. A PDF-render failure could therefore count even though the user may receive no usable final document. | The policy promises that technical-failure retries do not count. A mismatch invites billing disputes. | Define the billable event as a successful, usable document candidate; build a server-side adjustment/retry rule. Until then, provide a clear support credit path and log generation outcomes. |
| **Medium** | Sensitive data is not expressly excluded by product policy | The Terms prohibit submission without authority, but construction documents may include contact, health, access-control, employment or other sensitive material. | The DPA places heightened restrictions around sensitive personal data and requires clear lawful processing.[1] | Add an explicit “do not submit sensitive personal data, children’s data, passwords, bank details, IDs or security-sensitive drawings unless CivilDocs has separately approved the workflow and safeguards” rule. |
| **Medium** | Retention, deletion and export are under-specified | The Terms state that drafts/PDFs are not retained indefinitely, but provide no retention schedule or post-termination export/deletion mechanics. | A customer needs to know whether data is browser-only, server logged, sent to a provider, or retained for support/security. | Publish retention periods by data type in the privacy notice. Add a paid-account export/deletion request process and clarify what is held in browser storage versus on the service. |
| **Medium** | Term-change wording should provide a choice for paid users | Clause 14 postpones material adverse paid changes to renewal in most cases. | This is relatively customer-friendly, but a fixed-term customer should have a practical notice and cancellation path if a non-essential material change is adverse. | Add email/in-app notice, version archive, effective date, and a cancellation/credit remedy for a material adverse change that cannot wait for renewal. |
| **Low** | Policy references need exact versioning | The Terms incorporate the fair-use policy but do not identify a specific version/effective date in the order flow. | A change dispute is easier when every accepted policy version is identifiable. | Include the policy version, effective date and URL in the acceptance record, order confirmation and customer receipt. |

## Strengths that should be retained

The following choices are sound and should remain in the final documents. First, the repeated professional-review statement is appropriately specific for an engineering drafting product; it does not imply that an AI-generated certificate, claim or BOQ is professionally approved. Second, the pilot wording correctly avoids presenting a future paid allowance as a current account entitlement. Third, the policy does a good job distinguishing a PDF download and user revision from a new AI request. Fourth, the service-protection clause recognises that an unused allowance is not a promise of unlimited throughput. Finally, the Terms retain mandatory rights rather than purporting to waive them.

## Recommended wording changes

The following are **working drafting recommendations**, not jurisdiction-specific legal conclusions. Counsel should adapt them to the final entity, payment provider and actual data flow.

### 1. Add a paid-launch gate

> **No paid launch until operational controls are live.** CivilDocs will not accept a paid subscription, charge an overage, or represent a usage allowance as an account-level entitlement until the applicable operator details, payment controls, named-user account controls, server-side metering, usage records, cancellation route and privacy information are live and have been communicated to the Customer.

### 2. Replace the data-role sentence with a clearer allocation

> **Data roles.** CivilDocs acts as a controller for account, billing, security, support, marketing-preference and service-usage data. For project data that a Customer submits on behalf of another person or organisation, CivilDocs will act only in the role identified in the applicable data-processing arrangement. The parties will document the required controller/processor responsibilities before the Customer uploads personal data for a paid use case.

This must only be used after counsel confirms the intended role allocation. It should not be published if CivilDocs is actually determining the purposes/means of project-data processing in a way inconsistent with a processor role.

### 3. Make the local tracker’s status unambiguous

> **Pilot browser tracker.** During the pilot, the displayed counter is a browser-local reminder only. It records completed generations in the current browser and may reset if browser data is cleared or the browser’s local month changes. It is not a billing record, named-user account balance, Firm balance, or cross-device enforcement mechanism.

### 4. Replace the fair-use reset clause once paid metering exists

> **Paid-account reset.** For paid plans, the allowance resets at 00:00 Central Africa Time on the first day of each calendar month, according to CivilDocs’ server-side usage record. CivilDocs will display the current balance and next reset time in the account. If the Customer reasonably believes a technical failure was counted, the Customer may request a review within [14] days using [support address].

### 5. Add a concise sensitive-data restriction

> Do not submit special-category or sensitive personal data, children’s data, passwords, bank-account or card data, government identifiers, biometric data, health information, security credentials, or highly restricted site/security drawings unless CivilDocs has expressly approved the workflow in writing and the required safeguards are in place.

### 6. Replace the broad indemnity trigger

> The Customer will indemnify CivilDocs against a third-party claim to the extent it arises from the Customer’s unlawful or unauthorised Customer Data, infringement caused by Customer Data, or material breach of these Terms. CivilDocs will give prompt notice, permit the Customer to control the defence where legally appropriate, and reasonably cooperate. This does not apply to the extent a claim is caused by CivilDocs’ breach, wilful misconduct or liability that cannot lawfully be excluded.

### 7. Add a customer-facing pricing statement

> **Price and taxes.** Prices are stated in Zambian kwacha. [Prices include VAT / Prices exclude VAT, which will be added where legally applicable.] Before you pay, CivilDocs will show the total amount due, billing frequency, next renewal date, included allowance, any overage price, cancellation method and the applicable terms version.

## Go/no-go checklist

| Item | Paid launch status |
|---|---|
| Registered legal entity, business address, customer support and legal-notice contacts displayed | **No-go until complete** |
| Counsel confirms Data Protection Act role, registration, provider and cross-border posture | **No-go until complete** |
| Privacy notice, retention schedule and rights/complaint process live | **No-go until complete** |
| Payment checkout shows total, taxes, recurring terms, cancellation and receipt | **No-go until complete** |
| Server-side named-user/Firm metering matches the stated cap and reset timezone | **No-go until complete** |
| Versioned affirmative acceptance record and downloadable terms retained | **No-go until complete** |
| Consumer/refund/liability/indemnity wording reviewed by Zambian counsel | **No-go until complete** |
| Marketing consent/opt-out process configured before bulk conversion email | **No-go until complete** |
| Pilot-only labels remain visible while the above are incomplete | **Required now** |

## References

[1]: https://zambialii.org/akn/zm/act/2021/3 "Data Protection Act, 2021 — Act 3 of 2021 (ZambiaLII)"
[2]: https://www.dataprotection.gov.zm/faq/ "Data Protection and Privacy Office — Frequently Asked Questions"
[3]: https://zambialii.org/akn/zm/act/2021/4 "Electronic Communications and Transactions Act, 2021 — Act 4 of 2021 (ZambiaLII)"
[4]: https://zambialii.org/akn/zm/act/2010/24/eng@2014-01-01 "Competition and Consumer Protection Act, 2010 — Act 24 of 2010 (ZambiaLII)"
[5]: https://zambialii.org/akn/zm/act/2023/21/eng@2023-12-26 "Competition and Consumer Protection (Amendment) Act, 2023 — Act 21 of 2023 (ZambiaLII)"

