/*
 * CivilDocs browser runtime configuration.
 *
 * This file contains no secrets. Set the public URL of the Replit/Node proxy
 * before deploying the static frontend to Cloudflare Pages. Keep the Gemini
 * API key only in the backend environment (for example, Replit Secrets).
 */
window.CIVILDOCS_CONFIG = Object.assign({}, window.CIVILDOCS_CONFIG, {
  geminiProxyEndpoint: "https://YOUR-REPLIT-APP.replit.app/api/gemini",
  // Optional public support address for the pilot-feedback form. This is safe to
  // expose because it is a contact route, not a credential. Leave blank until
  // a verified CivilDocs support inbox is ready.
  supportEmail: "",
});

