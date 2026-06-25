import type { FileLike } from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { convertPDFWithLibreOffice } from "./office-conversion.service";

export async function convertPDFToPowerPoint(
  file: FileLike,
): Promise<PDFResponse> {
  return convertPDFWithLibreOffice(file, "pptx", "PDF to PowerPoint");
}
