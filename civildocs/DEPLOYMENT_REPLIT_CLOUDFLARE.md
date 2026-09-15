# CivilDocs deployment: Replit backend plus Cloudflare Pages frontend

This package is arranged so the browser application can be hosted on Cloudflare Pages while the Gemini proxy runs on Replit. The Gemini key remains server-side. The browser never receives `GEMINI_API_KEY`.

## 1. Replit backend

Import the repository ZIP into a new Node.js Replit project. In Replit Secrets, create `GEMINI_API_KEY` with the Gemini credential. Do not paste the key into `client/app.js`, `client/runtime-config.js`, HTML, or any file that will be served to browsers.

Set `FRONTEND_ORIGINS` to the exact Cloudflare Pages origin, for example `https://civildocs.pages.dev`. If a custom domain is used, include it as a comma-separated second origin. Replit supplies `PORT`; the server already reads `process.env.PORT` and must not be changed to a fixed production port.

The Replit run command is:

```text
pnpm install --frozen-lockfile && pnpm run build && NODE_ENV=production node dist/index.js
pnpm install --frozen-lockfile && pnpm run build
window.CIVILDOCS_CONFIG = {
  geminiProxyEndpoint: "https://YOUR-REPLIT-APP.replit.app/api/gemini",
};
npx wrangler pages deploy dist/public --project-name civildocs

