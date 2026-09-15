# CivilDocs Operator and Deployment Manual

**Release record:** `c87d6afc` application release, with final public-verification record `29985782`  
**Prepared:** 21 August 2026  
**Author:** Manus AI

> **Important distinction:** The accompanying source archive preserves the CivilDocs code, documentation, deployment configuration, and engineering visual asset. It **does not** back up pilot users’ browser-local drafts, consent records, profile details, feedback, or downloaded PDFs. Before moving hosting or clearing browser data, each pilot user should export any draft they need to keep as PDF or Word from their own device.

## 1. Handoff purpose and current release state

CivilDocs is a browser-first, Zambia-oriented contractor-documentation pilot. It creates editable drafting outputs for professional review; it is not an engineering certification, payment approval, procurement approval, or substitute for appointed professional judgement. The current public pilot is available at [https://civildocs-zuztwkvm.manus.space](https://civildocs-zuztwkvm.manus.space). The codebase can also be deployed under your own Cloudflare account using the included Worker handoff. [1] [2]

The latest entry flow is deliberately protected. The public page shows an orange **Use for free** button, but it stays unavailable until the user affirmatively accepts the Pilot Terms. No document modules are shown before entry. After acceptance and a deliberate click of **Use for free**, the six-module workspace becomes available. The code additionally prevents a document form from opening if the browser-local Terms acceptance or pilot session is missing. [3]

| Item | Current state | Operator implication |
|---|---|---|
| Controlled pilot access | Live and verified | Use for invitation-only testing, not unrestricted paid sales. |
| Sign in, Sign up, Google sign-in | Visible but unavailable | Do not advertise them as functional accounts. |
| Pricing tiers | Visible but unavailable | Do not collect payment until the paid-launch requirements in Section 8 are complete. |
| User drafts and profiles | Browser-local | Users must export important work before device/browser changes. |
| Gemini API key | Server-side only | Never place the key in browser JavaScript, HTML, `runtime-config.js`, or a committed `.env` file. |
| Current validation | 48 test files / 180 tests, type check, production build | Re-run this validation before any material code or hosting change. [3]

## 2. What is already implemented

The live pilot includes six contractor-document workflows. Each workflow is designed to create an editable draft and supports a final professional review before external use. The bid-package and site-inspection outputs received dedicated corrective fixes during the pilot validation cycle. [4]

| Code | Module | Delivered capability |
|---|---|---|
| CD-01 | Bid Package Builder | ZPPA-style bid package, BOQ review, tender cover letter, and drawings checklist. |
| CD-02 | Interim Payment Certificate | Contract valuation and certification draft. |
| CD-03 | Variation and EOT Claims | Variation and extension-of-time drafting workflow. |
| CD-04 | NCC Grade Upgrade Portfolio | Contractor portfolio and grade-upgrade evidence workflow. |
| CD-05 | Escalation Clause Builder | Materials and price-escalation clause drafting workflow. |
| CD-06 | Site Inspection and Defect Log | Defect log with corrective-action responsibility and evidence fields. |

The pilot usability and resilience work is also complete. It provides browser-local profile defaults, per-keystroke local draft saving, a structured failure panel that explains the reason, what happened, why, and the next action, manual retry, and one bounded four-minute automatic retry. Saved drafts can be downloaded in PDF and Word-compatible formats without sending the export operation to the server. [3] [5]

## 3. Contents of the final source archive

The source archive is intended to be retained in a private, access-controlled location such as your organisation’s encrypted cloud drive or private Git repository. It excludes installed dependencies, build output, repository metadata, and local logs so that it stays portable. Install dependencies again with `pnpm install --frozen-lockfile` after extraction.

| Path | Purpose |
|---|---|
| `client/` | Browser application, screens, styles, client-side draft/export logic, and regression tests. |
| `server/` | Express Gemini proxy, security headers, structured outcome logging, and server-side tests. |
| `cloudflare/worker.mjs` | Cloudflare Worker that serves static assets and protects the Gemini key. |
| `wrangler.toml` | Worker name, static-asset binding, SPA fallback, and `/api/*` Worker routing. |
| `CivilDocs_Operator_Manual_2026-08-21.md` | This manual. |
| `Cloudflare_Handoff.md` | Original Cloudflare-specific deployment guidance. |
| `DEPLOYMENT_REPLIT_CLOUDFLARE.md` | Alternative Cloudflare Pages + separately hosted proxy guidance. |
| `handoff-assets/civildocs-engineering-field-sketch.png` | The restrained engineering visual used by the public entry screen. |
| Validation and review Markdown files | The pilot, export, security, UI, and latest entry-gate evidence records. |

## 4. Pilot operator instructions

For a normal pilot tester, the correct path is simple. They should read the Pilot Terms, tick the acceptance checkbox, select **Use for free**, choose one of the six document workflows, complete the form, review every fact, and export a draft. The Terms acceptance and working draft are stored only in that browser, so the user should download a PDF or Word copy whenever the document needs to be retained.

The pilot access screen intentionally keeps sign-in, sign-up, Google sign-in, and purchasing unavailable. These controls are present to communicate the expected future service shape without pretending that account or billing operations are already active. The three rate tiers are likewise informational during the pilot. [3]

When an AI request fails, instruct the user not to erase their form. CivilDocs preserves the entered values locally. The failure panel explains the issue and provides **Try again now** plus one automatic retry after four minutes. If the user keeps editing, the automatic retry is cancelled so a stale request is not submitted. [2]

## 5. Local development and verification

Use a current Node.js release with the package-manager version declared in `package.json`. From the extracted project directory, install dependencies and use the commands below. The development server will use the local Vite setup; production output is created in `dist/`. [6]

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm build
pnpm dev
pnpm install --frozen-lockfile
pnpm build
rm -rf cloudflare-dist
mkdir -p cloudflare-dist/manus-storage
cp -R dist/public/. cloudflare-dist/
cp handoff-assets/civildocs-engineering-field-sketch.png \
  cloudflare-dist/manus-storage/civildocs-engineering-field-sketch_89e1ea21.png
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
# Edit wrangler.toml: ALLOWED_ORIGINS = "https://your-domain.example"
npx wrangler deploy

