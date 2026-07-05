import type { FileLike } from "@/backend/lib/upload";
import type { PDFResponse } from "@/backend/types/pdf";
import {
  convertOfficeToPDF,
  getPowerpointValidationOptions,
} from "./office-conversion.service";

export async function convertPowerPointToPDF(
  file: FileLike,
): Promise<PDFResponse> {
  return convertOfficeToPDF({
    file,
    label: "PowerPoint to PDF",
    validation: getPowerpointValidationOptions(),
  });
}
