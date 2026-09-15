import { describe, expect, it } from "vitest";
import { PDF_CONTENT_BOTTOM_Y, maxPdfBodyLines, paginatePdfTextLines } from "./pdf-layout-utils.js";

describe("PDF section pagination", () => {
  it("calculates the remaining whole text lines without crossing the footer-safe boundary", () => {
    expect(maxPdfBodyLines(267, 4.4)).toBe(2);
    expect(maxPdfBodyLines(PDF_CONTENT_BOTTOM_Y, 4.4)).toBe(0);
  });

  it("moves long section text to a continuation page before it crosses the footer-safe boundary", () => {
    const lines = Array.from({ length:20 }, (_, index) => `line ${index + 1}`);
    const pages = paginatePdfTextLines(lines, 267, 28);

    expect(pages).toHaveLength(2);
    expect(pages[0]).toMatchObject({ startY:267, endY:275.8 });
    expect(pages[0].lines).toHaveLength(2);
    expect(pages[1].lines).toHaveLength(18);
    expect(pages.every(page => page.endY <= PDF_CONTENT_BOTTOM_Y)).toBe(true);
  });
});

