# Gemini API Tier 1 Billing Checklist

**Status:** Assessment only — no billing action was taken.  
**Checked:** 20 August 2026

> I am an AI, not a financial advisor; this is an operational billing assessment, not financial advice. You control the payment and billing decision.

## Current requirement

Google’s current documentation states that **Tier 1** is reached by setting up and linking an active billing account. The billing page states that moving from Free to Paid requires linking billing and adding a minimum of **US$10 or the local-currency equivalent** in paid credits, although Google may assign an account to Prepay or Postpay during the current billing-plan transition.[1] The rate-limit page lists Tier 1’s billing-tier cap as **US$250** and a spend-based rate limit of **US$10 per rolling ten-minute window**.[2]

Tier 1 does not guarantee unlimited capacity or a specific requests-per-minute limit. Google states that RPM, TPM, and RPD vary by model and project and must be checked in AI Studio; actual capacity can still vary.[2]

## User-controlled steps

| Step | Action | Confirmation point |
|---|---|---|
| 1 | Open the affected Gemini project in [Google AI Studio Projects](https://aistudio.google.com/projects) or the API Keys page. | Confirm the project is the one whose key is configured on the backend. |
| 2 | Select **Set up billing** for that project. | Review the Google Cloud billing account and project shown before continuing. |
| 3 | Add or confirm contact details and payment method. | Confirm the payment instrument and country. |
| 4 | Choose the offered billing plan, or accept the assigned plan. | Review whether the project is Prepay or Postpay. |
| 5 | If prompted, prepay at least US$10 or local equivalent. | Confirm the exact amount before submitting. |
| 6 | Check AI Studio Billing, Projects, Usage, and Rate Limit pages. | Confirm Paid/Tier 1 status, positive balance if Prepay, and visible limits. |
| 7 | Only after confirmation, run the prioritized pending CivilDocs batch. | Keep the existing CivilDocs per-IP throttle and collect review/PDF evidence. |

## Safeguards before confirmation

Do not paste the API key into chat, source files, Cloudflare public variables, or the ZIP. Google’s API-key guidance recommends environment variables or a secret store, prohibits exposing keys client-side, and recommends restricting keys to the Gemini API.[3] For CivilDocs, the key belongs in the Replit backend secret named `GEMINI_API_KEY`; Cloudflare Pages should receive only the public proxy URL.

Set a Google usage alert and, if using Prepay, consider a low auto-reload ceiling. Google notes that Prepay credits are consumed by Gemini API usage and that service stops when the positive balance reaches zero; billing-pipeline latency can create limited overage exposure.[1]

## What I can verify after the user confirms

I can verify the project’s public proxy response, rate-limit behavior, model response status, and the resulting CivilDocs review/PDF outputs. I cannot see or disclose the billing account, payment instrument, balance, or secret key from the public deployment. Tier 1 status must be confirmed by the user in AI Studio.

## References

[1]: https://ai.google.dev/gemini-api/docs/billing "Google AI for Developers — Billing"
[2]: https://ai.google.dev/gemini-api/docs/rate-limits "Google AI for Developers — Rate limits"
[3]: https://ai.google.dev/gemini-api/docs/api-key "Google AI for Developers — Using Gemini API keys"

