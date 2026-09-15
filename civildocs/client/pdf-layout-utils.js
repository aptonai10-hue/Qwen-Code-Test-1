export const PDF_CONTENT_BOTTOM_Y = 276;

export function maxPdfBodyLines(startY, lineHeight = 4.4, bottomY = PDF_CONTENT_BOTTOM_Y) {
  return Math.max(0, Math.floor((bottomY - startY) / lineHeight));
}

export function paginatePdfTextLines(lines, startY, continuationStartY, lineHeight = 4.4, bottomY = PDF_CONTENT_BOTTOM_Y) {
  const remaining = [...lines];
  const pages = [];
  let y = startY;

  while (remaining.length) {
    const capacity = Math.max(1, maxPdfBodyLines(y, lineHeight, bottomY));
    const pageLines = remaining.splice(0, capacity);
    pages.push({ lines:pageLines, startY:y, endY:y + pageLines.length * lineHeight });
    y = continuationStartY;
  }

  return pages;
}

