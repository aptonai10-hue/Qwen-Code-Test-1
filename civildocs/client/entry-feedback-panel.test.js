import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");

describe("post-route feedback prompt", () => {
  it("adds an optional no-auto-send feedback form to the document workspace", () => {
    expect(html).toContain('id="entry-feedback-panel"');
    expect(html).toContain('id="entry-feedback-form"');
    expect(html).toContain("Nothing is sent automatically");
    expect(html).toContain('id="entry-feedback-dismiss"');
  });

  it("shows the prompt from document routing and supports saving or dismissing it", () => {
    expect(app).toContain("showEntryFeedback(id)");
    expect(app).toContain("saveEntryFeedback(window.localStorage");
    expect(app).toContain("dismissEntryFeedback()");
  });
});

