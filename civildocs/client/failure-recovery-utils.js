export const AUTOMATIC_RETRY_DELAY_MS = 4 * 60 * 1000;

export function describeGenerationFailure(error, { online = true } = {}) {
  if (!online) return {
    reason: "Connection unavailable",
    whatHappened: "CivilDocs could not send your request while this device is offline.",
    why: "The document service needs an internet connection to receive the request.",
    nextAction: "Your form is saved on this device. Reconnect, then try again when you are ready.",
    canAutoRetry: false,
  };

  if (error?.code === "UPSTREAM_CAPACITY") return {
    reason: "Servers are busy",
    whatHappened: "The AI did not receive a completed request, so no new document was made.",
    why: "The document service is temporarily handling more work than it can accept.",
    nextAction: "Your form is saved. CivilDocs will retry once automatically in four minutes, or you can try again now.",
    canAutoRetry: true,
  };

  if (error?.code === "CLIENT_REQUEST_TIMEOUT" || error?.code === "UPSTREAM_TIMEOUT") return {
    reason: "The request took too long",
    whatHappened: "CivilDocs stopped waiting safely before a document could be confirmed.",
    why: "The AI service did not complete its response within the available time.",
    nextAction: "Your form is saved. CivilDocs will retry once automatically in four minutes, or you can try again now.",
    canAutoRetry: true,
  };

  if (error?.code === "RATE_LIMITED") return {
    reason: "Too many recent requests",
    whatHappened: "The AI request was paused before a new document was created.",
    why: "A short protection limit prevents repeated requests from overwhelming the service.",
    nextAction: "Your form is saved. Wait a minute, then use Try again when you are ready.",
    canAutoRetry: false,
  };

  if (error?.code === "PROMPT_TOO_LARGE") return {
    reason: "The request is too large",
    whatHappened: "The document request could not be accepted in its current size.",
    why: "The AI service has a limit on the amount of information it can process in one request.",
    nextAction: "Your form is saved. Shorten the scope or reduce the line items, then try again.",
    canAutoRetry: false,
  };

  return {
    reason: "The document could not be generated",
    whatHappened: "CivilDocs did not receive a usable document response.",
    why: "The service returned an unexpected or incomplete response.",
    nextAction: "Your form is saved. Review the details if needed, then try again.",
    canAutoRetry: false,
  };
}

export function retryCountdownLabel(remainingMs) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

