import type { FileLike } from "@/backend/lib/upload";
import type { PDFResponse } from "@/backend/types/pdf";
import { convertPDFWithLibreOffice } from "./office-conversion.service";

export async function convertPDFToPowerPoint(
  file: FileLike,
): Promise<PDFResponse> {
  return convertPDFWithLibreOffice(file, "pptx", "PDF to PowerPoint");
}
