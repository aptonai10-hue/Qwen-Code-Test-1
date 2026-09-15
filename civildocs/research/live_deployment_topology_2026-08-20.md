# Live Deployment Topology Check — 2026-08-20

## Finding

The published domain `https://civildocs-zuztwkvm.manus.space/` is currently serving the CivilDocs frontend and `/api/gemini` endpoint through the Manus-hosted deployment, not through a verified Replit backend plus Cloudflare Pages split.

## Evidence

The public `/runtime-config.js` returned HTTP 200 and contains:

```js
window.CIVILDOCS_CONFIG = Object.assign({}, window.CIVILDOCS_CONFIG, {
  geminiProxyEndpoint: "https://YOUR-REPLIT-APP.replit.app/api/gemini",
});

