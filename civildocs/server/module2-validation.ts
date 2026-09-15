import type { Request, Response } from "express";
import { authenticateCronRequest, CronAuthenticationError } from "./cron-auth";
import { recordGeminiRequest } from "./gemini-metrics";
import { requestGeminiFromServer } from "./gemini-proxy";
import { notifyOwner } from "./owner-notification";
import { markModule2OwnerNotified, recordModule2Attempt } from "./module2-validation-store";
import { assessModule2Payload, buildModule2ValidationPrompt, extractModule2Payload } from "./module2-validation-utils";

export async function module2ValidationHandler(req: Request, res: Response): Promise<void> {
  let cron;
  try {
    cron = await authenticateCronRequest(req);
  } catch (error) {
    const detail = error instanceof CronAuthenticationError ? error.message : "Scheduled callback authentication failed.";
    res.status(403).json({ ok: false, error: "cron-only", detail });
    return;
  }

  const startedAt = Date.now();
  try {
    const gemini = await requestGeminiFromServer({ prompt: buildModule2ValidationPrompt() });
    const proxyCode = typeof gemini.body === "object" && gemini.body !== null && "code" in gemini.body ? String(gemini.body.code) : undefined;
    recordGeminiRequest(gemini.status, Date.now() - startedAt, proxyCode);

    let status = "upstream_error";
    let success = false;
    let lineItemCount = 0;
    let flashcardReviewReady = false;
    let pdfHandoffReady = false;
    let detail = `Gemini proxy returned HTTP ${gemini.status}.`;
    if (gemini.status === 200) {
      const assessment = assessModule2Payload(extractModule2Payload(gemini.body));
      status = assessment.ok ? "success" : "invalid_payload";
      success = assessment.ok;
      lineItemCount = assessment.lineItemCount;
      flashcardReviewReady = assessment.flashcardReviewReady;
      pdfHandoffReady = assessment.pdfHandoffReady;
      detail = assessment.detail;
    } else if (proxyCode === "UPSTREAM_CAPACITY") {
      status = "capacity";
      detail = "Gemini is temporarily at capacity; this run will be retried at the next scheduled interval.";
    }

    const persisted = await recordModule2Attempt({ taskUid: cron.taskUid, status, success, lineItemCount, flashcardReviewReady, pdfHandoffReady, detail });
    let ownerNotified = false;
    if (persisted.ownerNeedsNotification) {
      ownerNotified = await notifyOwner({
        title: "CivilDocs Module 2 validated",
        content: `The scheduled Interim Payment Certificate validation succeeded with ${lineItemCount} valuation lines and is ready for the payment flashcard and PDF flow.`,
      });
      if (ownerNotified) await markModule2OwnerNotified(cron.taskUid);
    }

    const result = { ok: true, taskUid: cron.taskUid, status, success, lineItemCount, flashcardReviewReady, pdfHandoffReady, firstSuccess: persisted.firstSuccess, ownerNotified, timestamp: new Date().toISOString(), detail };
    console.log("[module2-validation]", JSON.stringify(result));
    res.json(result);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const failure = { ok: false, error: "module2-validation-failed", detail, context: { url: req.originalUrl, taskUid: cron.taskUid }, timestamp: new Date().toISOString() };
    console.error("[module2-validation]", JSON.stringify(failure));
    res.status(500).json(failure);
  }
}

