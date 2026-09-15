import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CronAuthenticationError, verifyCronSessionToken } from "./cron-auth";

function signedToken(payload: Record<string, unknown>, secret = "test-secret") {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

describe("cron session verification", () => {
  it("accepts a correctly signed active token", () => {
    const token = signedToken({ openId: "cron_module2", appId: "app", name: "Heartbeat", exp: Math.floor(Date.now() / 1000) + 60 });
    expect(verifyCronSessionToken(token, "test-secret")).toMatchObject({ openId: "cron_module2" });
  });

  it("rejects a signature generated with a different secret", () => {
    const token = signedToken({ openId: "cron_module2", appId: "app", name: "Heartbeat" });
    expect(() => verifyCronSessionToken(token, "wrong-secret")).toThrow(CronAuthenticationError);
  });
});

