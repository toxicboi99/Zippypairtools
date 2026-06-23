import {
  WORD_UPLOAD_EXTENSIONS,
  type FileLike,
  sanitizeFileName,
  validateUploadFile,
  wordUploadMimeTypes,
} from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { createPdfResponse } from "./pdf-utils";

export async function convertWordToPDFPlaceholder(
  file: FileLike,
): Promise<PDFResponse> {
  const { fileName, size } = validateUploadFile(file, {
    allowedMimeTypes: wordUploadMimeTypes,
    allowedExtensions: WORD_UPLOAD_EXTENSIONS,
  });

  return createPdfResponse({
    message:
      "Word to PDF is validated and ready for integration with a dedicated conversion provider.",
    files: [],
    meta: {
      status: "placeholder",
      providerRequired: true,
      fileName: sanitizeFileName(fileName),
      size,
    },
  });
}
