const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"];
const MAX_PROMPT_CHARS = 50_000;
const SYSTEM_INSTRUCTION = "You are a professional construction and civil engineering documentation expert working in Zambia. You understand ZPPA tender requirements, NCC contractor grading, and standard Zambian construction industry practice. Respond ONLY with a valid JSON object. No markdown. No backticks. No explanation. No preamble. Just raw JSON matching the exact structure requested.";

const SECURITY_HEADERS = {
  "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self';",
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function requestId(candidate) {
  const value = typeof candidate === "string" ? candidate.trim() : "";
  return /^[a-zA-Z0-9._-]{8,80}$/.test(value) ? value : crypto.randomUUID();
}

function responseHeaders(headers, id) {
  return { ...SECURITY_HEADERS, "x-request-id": id, ...headers };
}

function json(body, status = 200, headers = {}, id) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }, id),
  });
}

function logOutcome(id, status, startedAt, code) {
  // Never log the prompt, document content, client IP, secret, or upstream body.
  console.log(JSON.stringify({ event: "civildocs.gemini.request", requestId: id, status, durationMs: Math.max(0, Math.round(Date.now() - startedAt)), ...(code ? { code } : {}) }));
}

function responseCode(body) {
  return typeof body?.code === "string" ? body.code : undefined;
}

function securedAssetResponse(response, id) {
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers: responseHeaders(Object.fromEntries(response.headers), id) });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);
  if (!origin || (!allowed.length ? origin === new URL(request.url).origin : allowed.includes(origin))) return { "access-control-allow-origin": origin || "*", vary: "Origin" };
  return {};
}

async function geminiRequest(prompt, apiKey) {
  let lastStatus = 502;
  let lastBody = { error: "Unable to reach Gemini." };

  for (const model of MODELS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40_000);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 12288, responseMimeType: "application/json" },
        }),
      });
      const body = await response.json().catch(() => ({ error: "Gemini returned an invalid upstream response." }));
      if (response.ok) return { status: 200, body };
      lastStatus = response.status || 502;
      lastBody = body;
      if (![429, 500, 503, 404].includes(lastStatus)) break;
    } catch (error) {
      lastStatus = error?.name === "AbortError" ? 504 : 502;
      lastBody = { error: lastStatus === 504 ? "Gemini request timed out." : "Unable to reach Gemini." };
    } finally {
      clearTimeout(timeout);
    }
  }

  const capacityLimited = [429, 503].includes(lastStatus);
  return {
    status: lastStatus,
    body: {
      code: capacityLimited ? "UPSTREAM_CAPACITY" : lastStatus === 404 ? "UPSTREAM_MODEL_NOT_FOUND" : lastStatus === 504 ? "UPSTREAM_TIMEOUT" : "GEMINI_UPSTREAM_ERROR",
      error: capacityLimited ? "AI is temporarily at capacity. Please try again in a few minutes." : "Gemini request failed.",
    },
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = requestId(request.headers.get("x-request-id"));
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders({ ...cors, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type, x-request-id" }, id) });

    if (url.pathname === "/api/gemini") {
      const startedAt = Date.now();
      const respond = (body, status) => {
        logOutcome(id, status, startedAt, responseCode(body));
        return json(body, status, cors, id);
      };
      if (request.method !== "POST") return respond({ error: "Method not allowed." }, 405);
      const payload = await request.json().catch(() => null);
      const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
      if (!prompt) return respond({ code: "PROMPT_REQUIRED", error: "A document prompt is required." }, 400);
      if (prompt.length > MAX_PROMPT_CHARS) return respond({ code: "PROMPT_TOO_LARGE", error: "The document request is too large. Shorten the description or reduce the number of line items and try again." }, 413);
      if (!env.GEMINI_API_KEY) return respond({ code: "GEMINI_NOT_CONFIGURED", error: "Gemini service is not configured." }, 500);
      const result = await geminiRequest(prompt, env.GEMINI_API_KEY);
      return respond(result.body, result.status);
    }

    return securedAssetResponse(await env.ASSETS.fetch(request), id);
  },
};

