import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

const CRON_OPEN_ID_PREFIX = "cron_";
const USER_INFO_PATH = "/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt";

type SessionPayload = {
  openId?: unknown;
  appId?: unknown;
  name?: unknown;
  exp?: unknown;
  nbf?: unknown;
};

type CronUserInfo = {
  openId?: unknown;
  name?: unknown;
  taskUid?: unknown;
};

export type CronIdentity = {
  isCron: true;
  taskUid: string;
  name: string;
};

export class CronAuthenticationError extends Error {}

function readHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function sessionTokenFromRequest(req: Pick<Request, "headers">): string | undefined {
  const cookieHeader = readHeader(req.headers.cookie);
  const cookieValue = cookieHeader
    ?.split(";")
    .map(part => part.trim())
    .find(part => part.startsWith("app_session_id="))
    ?.slice("app_session_id=".length);

  if (cookieValue) return decodeURIComponent(cookieValue);
  const authorization = readHeader(req.headers.authorization);
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
}

function parseJsonSegment(segment: string): Record<string, unknown> {
  try {
    const decoded = Buffer.from(segment, "base64url").toString("utf8");
    const value = JSON.parse(decoded);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("not an object");
    return value as Record<string, unknown>;
  } catch {
    throw new CronAuthenticationError("Malformed session token.");
  }
}

export function verifyCronSessionToken(token: string, secret: string): SessionPayload {
  const [encodedHeader, encodedPayload, encodedSignature, ...extra] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature || extra.length > 0) {
    throw new CronAuthenticationError("Malformed session token.");
  }

  const header = parseJsonSegment(encodedHeader);
  if (header.alg !== "HS256") throw new CronAuthenticationError("Unsupported session token algorithm.");

  const expectedSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
  const actualBuffer = Buffer.from(encodedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new CronAuthenticationError("Invalid session token signature.");
  }

  const payload = parseJsonSegment(encodedPayload) as SessionPayload;
  const now = Math.floor(Date.now() / 1000);
  if ((typeof payload.exp === "number" && payload.exp < now) || (typeof payload.nbf === "number" && payload.nbf > now)) {
    throw new CronAuthenticationError("Expired or inactive session token.");
  }
  return payload;
}

function userInfoEndpoint(baseUrl: string): string {
  return new URL(USER_INFO_PATH, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString();
}

export async function authenticateCronRequest(
  req: Pick<Request, "headers">,
  fetchImplementation: typeof fetch = fetch,
): Promise<CronIdentity> {
  const token = sessionTokenFromRequest(req);
  const secret = process.env.JWT_SECRET;
  const oauthBaseUrl = process.env.OAUTH_SERVER_URL;
  const projectId = process.env.VITE_APP_ID;
  if (!token || !secret || !oauthBaseUrl || !projectId) {
    throw new CronAuthenticationError("Scheduled callback authentication is not configured.");
  }

  const session = verifyCronSessionToken(token, secret);
  if (typeof session.openId !== "string" || !session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
    throw new CronAuthenticationError("Scheduled callbacks require a cron identity.");
  }

  let upstream: Response;
  try {
    upstream = await fetchImplementation(userInfoEndpoint(oauthBaseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwtToken: token, projectId }),
    });
  } catch {
    throw new CronAuthenticationError("Unable to verify scheduled callback identity.");
  }
  if (!upstream.ok) throw new CronAuthenticationError("Scheduled callback identity was rejected.");

  const userInfo = (await upstream.json()) as CronUserInfo;
  if (typeof userInfo.openId !== "string" || !userInfo.openId.startsWith(CRON_OPEN_ID_PREFIX) || typeof userInfo.taskUid !== "string" || !userInfo.taskUid) {
    throw new CronAuthenticationError("Scheduled callback is missing its task identity.");
  }
  return { isCron: true, taskUid: userInfo.taskUid, name: typeof userInfo.name === "string" ? userInfo.name : "Manus Scheduled Task" };
}

