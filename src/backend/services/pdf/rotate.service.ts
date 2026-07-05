import { degrees } from "pdf-lib";

import type { FileLike } from "@/backend/lib/upload";
import type { PDFResponse, PDFRotateOptions } from "@/backend/types/pdf";
import {
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
  parsePageSelection,
} from "./pdf-utils";

export async function rotatePDFPages(
  file: FileLike,
  options: PDFRotateOptions,
): Promise<PDFResponse> {
  const { fileName, pdfDocument, pageCount } = await loadPdfFile(file);
  const selectedPages = options.pages
    ? parsePageSelection(options.pages, pageCount)
    : Array.from({ length: pageCount }, (_, index) => index + 1);
  const selectedSet = new Set(selectedPages);

  pdfDocument.getPages().forEach((page, pageIndex) => {
    const pageNumber = pageIndex + 1;

    if (!selectedSet.has(pageNumber)) {
      return;
    }

    const currentAngle = page.getRotation().angle;
    page.setRotation(degrees(normalizeAngle(currentAngle + options.angle)));
  });

  const bytes = await pdfDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
  });

  return createPdfResponse({
    message: "Pages rotated successfully.",
    files: [
      createPdfOutputFile({
        bytes,
        fileName: `${getBaseName(fileName)}-rotated.pdf`,
        pageCount,
      }),
    ],
    meta: {
      inputPages: pageCount,
      rotatedPages: selectedPages.length,
      angle: options.angle,
    },
  });
}

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}
