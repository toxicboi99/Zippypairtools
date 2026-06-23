import { PDFDocument } from "pdf-lib";

import {
  IMAGE_UPLOAD_EXTENSIONS,
  imageUploadMimeTypes,
  type FileLike,
  fileToBuffer,
  validateUploadFiles,
} from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { ApiError } from "@/utils/api-error";
import { createPdfOutputFile, createPdfResponse } from "./pdf-utils";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const PAGE_MARGIN = 36;

export async function convertJPGToPDF(files: FileLike[]): Promise<PDFResponse> {
  validateUploadFiles(files, {
    allowedMimeTypes: imageUploadMimeTypes,
    allowedExtensions: IMAGE_UPLOAD_EXTENSIONS,
    minFiles: 1,
  });

  const pdfDocument = await PDFDocument.create();

  for (const file of files) {
    const buffer = await fileToBuffer(file);
    let embeddedImage;

    try {
      embeddedImage =
        file.type === "image/png"
          ? await pdfDocument.embedPng(buffer)
          : await pdfDocument.embedJpg(buffer);
    } catch {
      throw new ApiError(`${file.name} is not a valid image file.`, 422);
    }

    const page = pdfDocument.addPage([A4_WIDTH, A4_HEIGHT]);
    const fit = embeddedImage.scaleToFit(
      A4_WIDTH - PAGE_MARGIN * 2,
      A4_HEIGHT - PAGE_MARGIN * 2,
    );

    page.drawImage(embeddedImage, {
      x: (A4_WIDTH - fit.width) / 2,
      y: (A4_HEIGHT - fit.height) / 2,
      width: fit.width,
      height: fit.height,
    });
  }

  const bytes = await pdfDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
  });

  return createPdfResponse({
    message: "Images converted to PDF successfully.",
    files: [
      createPdfOutputFile({
        bytes,
        fileName: "zippypair-images.pdf",
        pageCount: files.length,
      }),
    ],
    meta: {
      inputFiles: files.length,
      pageCount: files.length,
    },
  });
}
