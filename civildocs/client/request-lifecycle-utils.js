export const REQUEST_STAGES = Object.freeze([
  { at: 0, mode: "hidden", progress: 0, label: "" },
  { at: 300, mode: "spinner", progress: 0, label: "Contacting CivilDocs…" },
  { at: 1000, mode: "skeleton", progress: 18, label: "Building your document layout…" },
  { at: 10000, mode: "progress", progress: 52, label: "Generating your document…" },
  { at: 20000, mode: "progress", progress: 68, label: "Still receiving a secure response…" },
  { at: 30000, mode: "progress", progress: 82, label: "Almost done — checking the document data…" },
  { at: 35000, mode: "progress", progress: 92, label: "This is taking longer than usual. Your draft is safe." },
]);

export const CLIENT_REQUEST_TIMEOUT_MS = 42000;

export class ClientRequestTimeoutError extends Error {
  constructor() {
    super("The document request exceeded the client wait limit.");
    this.name = "ClientRequestTimeoutError";
    this.code = "CLIENT_REQUEST_TIMEOUT";
  }
}

export function loadingStageAt(elapsedMs) {
  return REQUEST_STAGES.filter(stage => stage.at <= elapsedMs).at(-1) || REQUEST_STAGES[0];
}

export function createStaircaseRequest({ request, onStage, onOutcome, setTimeoutFn = setTimeout, clearTimeoutFn = clearTimeout, timeoutMs = CLIENT_REQUEST_TIMEOUT_MS }) {
  const controller = new AbortController();
  let finished = false;
  const timers = [];

  const clearTimers = () => timers.splice(0).forEach(clearTimeoutFn);
  const finish = outcome => {
    if (finished) return;
    finished = true;
    clearTimers();
    onOutcome(outcome);
  };

  REQUEST_STAGES.forEach(stage => {
    if (stage.at === 0) onStage(stage);
    else timers.push(setTimeoutFn(() => { if (!finished) onStage(stage); }, stage.at));
  });
  timers.push(setTimeoutFn(() => {
    if (finished) return;
    controller.abort();
    finish({ kind: "timeout", error: new ClientRequestTimeoutError() });
  }, timeoutMs));

  Promise.resolve()
    .then(() => request(controller.signal))
    .then(value => finish({ kind: "success", value }))
    .catch(error => {
      if (!finished) finish({ kind: "error", error });
    });

  return {
    abort() {
      if (finished) return;
      controller.abort();
      finish({ kind: "error", error: new Error("Request cancelled.") });
    },
    get signal() { return controller.signal; },
  };
}

export function draftStorageKey(moduleId) {
  return `civildocs.draft.v1.${moduleId}`;
}

export function hasMeaningfulDraft(value) {
  if (Array.isArray(value)) return value.some(hasMeaningfulDraft);
  if (value && typeof value === "object") return Object.values(value).some(hasMeaningfulDraft);
  if (typeof value === "number") return value !== 0;
  const text = String(value ?? "").trim();
  return Boolean(text && !["ZMW", "USD", "0", "10", "14", "Rate difference", "Available"].includes(text));
}

