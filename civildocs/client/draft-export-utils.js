const DYNAMIC_LABELS = Object.freeze({
  completedProjects: "Completed projects",
  materialsSchedule: "Key materials at risk",
});

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function escapeDraftHtml(value) {
  return cleanText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function draftExportFilenameBase(module, values, date = new Date()) {
  const subject = cleanText(values?.projectName || values?.companyName || "Saved_Draft")
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_|_$/g, "") || "Saved_Draft";
  const datePart = date.toISOString().slice(0, 10);
  return `${module.short}_${subject}_Draft_${datePart}`;
}

export function savedDraftEntries(modules, readRecord) {
  return Object.entries(modules)
    .map(([id, module]) => ({ id, module, record: readRecord(id) }))
    .filter(({ record }) => Boolean(record?.values));
}

export function draftUpdatedLabel(timestamp) {
  return timestamp ? `Saved ${new Date(timestamp).toLocaleString()}` : "Saved locally";
}

export function renderDraftExportRegisterHtml(entries) {
  if (!entries.length) return `<p class="draft-export-empty">No saved drafts on this device yet. Begin any document and the export options will appear here.</p>`;
  return entries.map(({ id, module, record }) => `<article class="draft-export-card"><div class="draft-export-card__meta"><strong>${escapeDraftHtml(module.code)} · ${escapeDraftHtml(module.name)}</strong><span>${escapeDraftHtml(draftUpdatedLabel(record.updatedAt))} · stays on this device</span></div><div class="draft-export-card__actions"><button class="secondary-button" type="button" data-draft-export="pdf" data-draft-module="${id}">Draft PDF</button><button class="secondary-button" type="button" data-draft-export="word" data-draft-module="${id}">Draft Word</button></div></article>`).join("");
}

function fieldRows(module, values) {
  return module.fields.flatMap(([name, label, type]) => {
    if (type === "dynamic") return [];
    const value = cleanText(values?.[name]);
    return value ? [{ label, value }] : [];
  });
}

function dynamicRows(values) {
  const rows = [];
  for (const [key, label] of Object.entries(DYNAMIC_LABELS)) {
    const items = Array.isArray(values?.[key]) ? values[key] : [];
    if (!items.length) continue;
    const value = items.map((item, index) => {
      const parts = Object.entries(item || {})
        .filter(([, itemValue]) => cleanText(itemValue))
        .map(([itemKey, itemValue]) => `${itemKey.replace(/([A-Z])/g, " $1")}: ${cleanText(itemValue)}`);
      return `${index + 1}. ${parts.join("; ")}`;
    }).join("\n");
    rows.push({ label, value });
  }
  return rows;
}

export function buildDraftExportModel(module, values, exportedAt = new Date()) {
  const safeModule = module || { code: "CD", name: "CivilDocs Draft", short: "CivilDocs" , fields: [] };
  return {
    code: safeModule.code,
    title: `${safeModule.name} — Saved Draft`,
    exportedAt: exportedAt.toLocaleString(),
    filenameBase: draftExportFilenameBase(safeModule, values, exportedAt),
    rows: [...fieldRows(safeModule, values), ...dynamicRows(values)],
  };
}

export function buildDraftWordHtml(model) {
  const rows = model.rows.map(({ label, value }) => `<tr><th>${escapeDraftHtml(label)}</th><td>${escapeDraftHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeDraftHtml(model.title)}</title><style>body{font-family:Arial,sans-serif;color:#1a1a2e;margin:32px}h1{color:#1a3c5e;font-size:22pt;margin:0 0 6px}.meta{color:#5d6a79;margin:0 0 22px;font-size:10pt}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:8px;vertical-align:top;text-align:left;font-size:10pt}th{width:34%;background:#eef5fb;color:#1a3c5e;font-weight:bold}footer{margin-top:22px;color:#6b7280;font-size:8pt}</style></head><body><h1>${escapeDraftHtml(model.title)}</h1><p class="meta">${escapeDraftHtml(model.code)} · Exported ${escapeDraftHtml(model.exportedAt)} · Device-local draft</p><table><tbody>${rows || "<tr><td colspan=\"2\">No saved field values were found.</td></tr>"}</tbody></table><footer>Prepared in CivilDocs. This is a saved working draft and requires professional review before use.</footer></body></html>`;
}

