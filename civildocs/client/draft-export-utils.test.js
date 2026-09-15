import { describe, expect, it } from "vitest";
import { buildDraftExportModel, buildDraftWordHtml, draftExportFilenameBase, renderDraftExportRegisterHtml, savedDraftEntries } from "./draft-export-utils.js";

const module = {
  code: "CD-05",
  name: "Escalation Clause Builder",
  short: "Escalation_Clause",
  fields: [
    ["projectName", "Project Name", "text"],
    ["contractValue", "Contract Value", "number"],
    ["materials", "Key Materials at Risk", "dynamic"],
  ],
};

describe("saved draft export utilities", () => {
  it("creates a stable, readable export model including dynamic material rows", () => {
    const model = buildDraftExportModel(module, {
      projectName: "Chimwemwe & Sons",
      contractValue: 145317.5,
      materialsSchedule: [{ material: "Cement", quantity: 850, unit: "bag" }],
    }, new Date("2026-08-21T10:00:00Z"));

    expect(model.title).toBe("Escalation Clause Builder — Saved Draft");
    expect(model.rows).toEqual(expect.arrayContaining([
      { label: "Project Name", value: "Chimwemwe & Sons" },
      expect.objectContaining({ label: "Key materials at risk", value: expect.stringContaining("Cement") }),
    ]));
    expect(model.filenameBase).toBe("Escalation_Clause_Chimwemwe_Sons_Draft_2026-08-21");
  });

  it("renders a Word-compatible HTML document with escaped draft values", () => {
    const html = buildDraftWordHtml({
      code: "CD-01",
      title: "Bid Package — Saved Draft",
      exportedAt: "21/08/2026, 10:00",
      rows: [{ label: "Description", value: "Works <verified> & ready" }],
    });

    expect(html).toContain("Works &lt;verified&gt; &amp; ready");
    expect(html).toContain("Device-local draft");
  });

  it("uses a safe fallback name when a draft has no project or company name", () => {
    expect(draftExportFilenameBase(module, {}, new Date("2026-08-21T10:00:00Z"))).toBe("Escalation_Clause_Saved_Draft_Draft_2026-08-21");
  });

  it("returns no entries for an empty browser-local draft register", () => {
    expect(savedDraftEntries({ escalation: module }, () => null)).toEqual([]);
  });

  it("renders a clear empty-state message when the draft register has no entries", () => {
    expect(renderDraftExportRegisterHtml([])).toContain("No saved drafts on this device yet.");
  });
});

