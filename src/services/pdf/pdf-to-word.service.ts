import type { FileLike } from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { createPdfResponse, loadPdfFile } from "./pdf-utils";

export async function convertPDFToWordPlaceholder(
  file: FileLike,
): Promise<PDFResponse> {
  const { fileName, pageCount } = await loadPdfFile(file);

  return createPdfResponse({
    message:
      "PDF to Word is validated and ready for integration with a dedicated conversion provider.",
    files: [],
    meta: {
      status: "placeholder",
      providerRequired: true,
      fileName,
      pageCount,
    },
  });
}
