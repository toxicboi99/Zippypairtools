import sharp from "sharp";

import type { FileLike } from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { ApiError } from "@/utils/api-error";
import {
  JPEG_OUTPUT_MIME_TYPE,
  MAX_RENDERED_PAGES,
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
  parsePageSelection,
} from "./pdf-utils";

export interface PDFToJPGOptions {
  pages?: string;
  quality?: number;
}

export async function convertPDFToJPG(
  file: FileLike,
  options: PDFToJPGOptions = {},
): Promise<PDFResponse> {
  const { fileName, buffer, pageCount } = await loadPdfFile(file);
  const selectedPages = options.pages
    ? parsePageSelection(options.pages, pageCount)
    : Array.from(
        { length: Math.min(pageCount, MAX_RENDERED_PAGES) },
        (_, index) => index + 1,
      );

  if (selectedPages.length > MAX_RENDERED_PAGES) {
    throw new ApiError(
      `Convert up to ${MAX_RENDERED_PAGES} pages at a time.`,
      413,
    );
  }

  if (!options.pages && pageCount > MAX_RENDERED_PAGES) {
    throw new ApiError(
      `This PDF has ${pageCount} pages. Enter a page range with up to ${MAX_RENDERED_PAGES} pages.`,
      413,
    );
  }

  const baseName = getBaseName(fileName);

  try {
    const outputs = await Promise.all(
      selectedPages.map(async (pageNumber) => {
        const imageBuffer = await sharp(buffer, {
          density: 144,
          page: pageNumber - 1,
        })
          .jpeg({
            quality: options.quality ?? 85,
            mozjpeg: true,
          })
          .toBuffer();

        return createPdfOutputFile({
          bytes: imageBuffer,
          fileName: `${baseName}-page-${pageNumber}.jpg`,
          mimeType: JPEG_OUTPUT_MIME_TYPE,
          pageRange: `${pageNumber}`,
        });
      }),
    );

    return createPdfResponse({
      message: "PDF converted to JPG successfully.",
      files: outputs,
      meta: {
        inputPages: pageCount,
        outputFiles: outputs.length,
      },
    });
  } catch {
    throw new ApiError(
      "PDF rendering is unavailable on this server. The PDF passed validation, but the JPG renderer could not process it.",
      501,
    );
  }
}
