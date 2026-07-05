import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getRequiredFormFile } from "@/backend/lib/upload";
import { convertPDFToWord } from "@/backend/services/pdf/pdf-to-word.service";
import { singlePdfRequestSchema } from "@/backend/validators/pdf.validator";

export function pdfToWordController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });

    return convertPDFToWord(payload.file);
  });
}
