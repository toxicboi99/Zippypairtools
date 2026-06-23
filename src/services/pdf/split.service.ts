import { PDFDocument } from "pdf-lib";

import type { FileLike } from "@/lib/upload";
import type { PDFResponse, SplitMode } from "@/types/pdf";
import {
  createPdfOutputFile,
  createPdfResponse,
  createSinglePageRanges,
  getBaseName,
  loadPdfFile,
  parsePageRanges,
} from "./pdf-utils";

export interface SplitPDFOptions {
  mode?: SplitMode;
  ranges?: string;
}

export async function splitPDF(
  file: FileLike,
  options: SplitPDFOptions = {},
): Promise<PDFResponse> {
  const { fileName, pdfDocument, pageCount } = await loadPdfFile(file);
  const baseName = getBaseName(fileName);
  const selectedRanges =
    options.mode === "ranges" && options.ranges
      ? parsePageRanges(options.ranges, pageCount)
      : createSinglePageRanges(pageCount);

  const outputs = await Promise.all(
    selectedRanges.map(async (range) => {
      const outputDocument = await PDFDocument.create();
      const copiedPages = await outputDocument.copyPages(
        pdfDocument,
        range.pages.map((pageNumber) => pageNumber - 1),
      );

      for (const page of copiedPages) {
        outputDocument.addPage(page);
      }

      const bytes = await outputDocument.save({
        addDefaultPage: false,
        useObjectStreams: true,
      });

      return createPdfOutputFile({
        bytes,
        fileName: `${baseName}-pages-${range.label}.pdf`,
        pageCount: range.pages.length,
        pageRange: range.label,
      });
    }),
  );

  return createPdfResponse({
    message: "PDF split successfully.",
    files: outputs,
    meta: {
      inputPages: pageCount,
      outputFiles: outputs.length,
    },
  });
}
