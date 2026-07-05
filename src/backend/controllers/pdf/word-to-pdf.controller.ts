import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getRequiredFormFile } from "@/backend/lib/upload";
import { convertWordToPDF } from "@/backend/services/pdf/word-to-pdf.service";
import { singleWordRequestSchema } from "@/backend/validators/pdf.validator";

export function wordToPdfController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singleWordRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });

    return convertWordToPDF(payload.file);
  });
}
