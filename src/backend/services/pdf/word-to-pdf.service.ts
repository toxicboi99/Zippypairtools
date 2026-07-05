import type { FileLike } from "@/backend/lib/upload";
import type { PDFResponse } from "@/backend/types/pdf";
import {
  convertOfficeToPDF,
  getWordValidationOptions,
} from "./office-conversion.service";

export async function convertWordToPDF(
  file: FileLike,
): Promise<PDFResponse> {
  return convertOfficeToPDF({
    file,
    label: "Word to PDF",
    validation: getWordValidationOptions(),
  });
}
