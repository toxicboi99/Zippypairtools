import type { FileLike } from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
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
