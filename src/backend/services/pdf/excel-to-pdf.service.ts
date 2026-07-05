import type { FileLike } from "@/backend/lib/upload";
import type { PDFResponse } from "@/backend/types/pdf";
import {
  convertOfficeToPDF,
  getExcelValidationOptions,
} from "./office-conversion.service";

export async function convertExcelToPDF(file: FileLike): Promise<PDFResponse> {
  return convertOfficeToPDF({
    file,
    label: "Excel to PDF",
    validation: getExcelValidationOptions(),
  });
}
