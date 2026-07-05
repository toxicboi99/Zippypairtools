import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getRequiredFormFile } from "@/backend/lib/upload";
import { convertPDFToJPG } from "@/backend/services/pdf/pdf-to-jpg.service";
import {
  parsePdfToJpgOptions,
  singlePdfRequestSchema,
} from "@/backend/validators/pdf.validator";

export function pdfToJpgController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });
    const options = parsePdfToJpgOptions(formData);

    return convertPDFToJPG(payload.file, options);
  });
}
