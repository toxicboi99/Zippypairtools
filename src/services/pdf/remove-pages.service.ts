import { PDFDocument } from "pdf-lib";

import type { FileLike } from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { ApiError } from "@/utils/api-error";
import {
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
  parsePageSelection,
} from "./pdf-utils";

export async function removePDFPages(
  file: FileLike,
  pages: string,
): Promise<PDFResponse> {
  const { fileName, pdfDocument, pageCount } = await loadPdfFile(file);
  const pagesToRemove = new Set(parsePageSelection(pages, pageCount));

  if (pagesToRemove.size >= pageCount) {
    throw new ApiError("At least one page must remain in the PDF.", 400);
  }

  const keepPageIndexes = Array.from({ length: pageCount }, (_, index) => index)
    .filter((pageIndex) => !pagesToRemove.has(pageIndex + 1));
  const outputDocument = await PDFDocument.create();
  const copiedPages = await outputDocument.copyPages(
    pdfDocument,
    keepPageIndexes,
  );

  for (const page of copiedPages) {
    outputDocument.addPage(page);
  }

  const bytes = await outputDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
  });

  return createPdfResponse({
    message: "Pages removed successfully.",
    files: [
      createPdfOutputFile({
        bytes,
        fileName: `${getBaseName(fileName)}-pages-removed.pdf`,
        pageCount: keepPageIndexes.length,
      }),
    ],
    meta: {
      originalPages: pageCount,
      removedPages: pagesToRemove.size,
      remainingPages: keepPageIndexes.length,
    },
  });
}
