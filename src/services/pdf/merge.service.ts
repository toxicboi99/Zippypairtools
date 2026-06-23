import { PDFDocument } from "pdf-lib";

import type { FileLike } from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { ApiError } from "@/utils/api-error";
import {
  createPdfOutputFile,
  createPdfResponse,
  loadPdfDocument,
  validatePdfFiles,
} from "./pdf-utils";

export async function mergePDFs(files: FileLike[]): Promise<PDFResponse> {
  const fileInfo = validatePdfFiles(files, { minFiles: 2 });
  const mergedDocument = await PDFDocument.create();
  let totalPages = 0;

  for (const [index, file] of files.entries()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const sourceDocument = await loadPdfDocument(
      buffer,
      fileInfo[index]?.fileName ?? file.name,
    );
    const pages = await mergedDocument.copyPages(
      sourceDocument,
      sourceDocument.getPageIndices(),
    );

    for (const page of pages) {
      mergedDocument.addPage(page);
    }

    totalPages += pages.length;
  }

  if (totalPages === 0) {
    throw new ApiError("No pages were found in the uploaded PDFs.", 422);
  }

  const bytes = await mergedDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
  });

  return createPdfResponse({
    message: "PDFs merged successfully.",
    files: [
      createPdfOutputFile({
        bytes,
        fileName: "zippypair-merged.pdf",
        pageCount: totalPages,
      }),
    ],
    meta: {
      inputFiles: files.length,
      pageCount: totalPages,
    },
  });
}
