# Cloudflare Hosting Handoff

CivilDocs is a browser-first Vite application with a protected server-side Gemini proxy. It cannot be safely deployed as static files alone because the browser must never contain the Gemini API key. This handoff includes a Cloudflare Worker (`cloudflare/worker.mjs`) that serves the static application and exposes the compatible `/api/gemini` endpoint.

> **Recommended option:** Keep the published CivilDocs version on its current managed hosting for the pilot, where the existing server proxy and rate controls are already active. Use the Cloudflare package when you need ownership of the deployment pipeline or a Cloudflare-managed domain. The Worker handoff needs a Gemini key and a Cloudflare account before it can generate documents.

## Included Components

| Component | Purpose |
|---|---|
| `cloudflare/worker.mjs` | Serves the compiled app, keeps `GEMINI_API_KEY` on the server side, applies the release security headers, and emits privacy-safe request outcome records. |
| `wrangler.toml` | Configures the Worker, static assets, SPA fallback, and `/api/*` routing. |
| `cloudflare-dist/` *(created for the export ZIP)* | Compiled frontend files and local copies of the CivilDocs visual assets. |
| `Cloudflare_Handoff.md` | Deployment checklist and important operational limitations. |

## Deployment Steps

1. Install a current Node.js version and authenticate to Cloudflare with `npx wrangler login`.
2. From the exported source folder, run `pnpm install` and `pnpm build`.
3. Build the portable static directory by copying `dist/public/` into `cloudflare-dist/`, then copy the two brand files from `handoff-assets/` into `cloudflare-dist/manus-storage/` using their original filenames:

   ```text
   civildocs-mark_dbb49e77.png
   civildocs-blueprint-panel_24e2db1f.jpg
   npx wrangler secret put GEMINI_API_KEY

