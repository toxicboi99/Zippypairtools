import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getFormFiles } from "@/backend/lib/upload";
import { convertJPGToPDF } from "@/backend/services/pdf/jpg-to-pdf.service";
import { jpgToPdfRequestSchema } from "@/backend/validators/pdf.validator";

export function jpgToPdfController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = jpgToPdfRequestSchema.parse({
      files: getFormFiles(formData),
    });

    return convertJPGToPDF(payload.files);
  });
}
