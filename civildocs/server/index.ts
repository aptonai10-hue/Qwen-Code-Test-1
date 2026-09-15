import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { clientIpFromHeaders, geminiRateLimiter, requestGeminiFromServer } from "./gemini-proxy";
import { getGeminiMetrics, recordGeminiRequest } from "./gemini-metrics";
import { module2ValidationHandler } from "./module2-validation";
import { isAllowedOrigin, parseAllowedOrigins } from "./cors-utils";
import { civilDocsSecurityHeaders, shouldExposeGeminiMetrics } from "./security-headers";
import { buildGeminiOutcomeLog, createRequestId, logGeminiOutcome } from "./operational-logging";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  const server = createServer(app);

  app.use((req, res, next) => {
    Object.entries(civilDocsSecurityHeaders).forEach(([header, value]) => res.setHeader(header, value));
    res.setHeader("Cache-Control", "no-store");
    const requestId = createRequestId(req.headers["x-request-id"]);
    res.locals.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
  });

  const allowedOrigins = parseAllowedOrigins(process.env.FRONTEND_ORIGINS);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isAllowedOrigin(origin, allowedOrigins)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    }
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });
  app.use(express.json({ limit: "150kb" }));
  app.get("/api/gemini/metrics", (_req, res) => {
    if (!shouldExposeGeminiMetrics(process.env.NODE_ENV)) {
      res.status(404).json({ error: "Not found." });
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.json(getGeminiMetrics());
  });
  app.post(["/api/gemini", "/api", "/gemini"], async (req, res) => {
    const startedAt = Date.now();
    const recordOutcome = (status: number, code?: string) => {
      logGeminiOutcome(buildGeminiOutcomeLog(res.locals.requestId, status, Date.now() - startedAt, code));
    };
    const rateLimit = geminiRateLimiter.check(clientIpFromHeaders(req.headers, req.socket.remoteAddress || "unknown"));
    if (!rateLimit.allowed) {
      res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
      const body = {
        code: "RATE_LIMITED",
        error: "Too many AI requests. Please wait before trying again.",
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      };
      recordGeminiRequest(429, Date.now() - startedAt, body.code);
      recordOutcome(429, body.code);
      res.status(429).json(body);
      return;
    }
    try {
      const result = await requestGeminiFromServer(req.body);
      const code = typeof result.body === "object" && result.body !== null && "code" in result.body ? String(result.body.code) : undefined;
      recordGeminiRequest(result.status, Date.now() - startedAt, code);
      recordOutcome(result.status, code);
      res.status(result.status).json(result.body);
    } catch {
      const body = { code: "GEMINI_INTERNAL_ERROR", error: "The document service had an unexpected error. Please try again." };
      recordGeminiRequest(500, Date.now() - startedAt, body.code);
      recordOutcome(500, body.code);
      res.status(500).json(body);
    }
  });
  app.post("/api/scheduled/module2-validation", module2ValidationHandler);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

