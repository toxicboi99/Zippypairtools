import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getFormFiles } from "@/backend/lib/upload";
import { mergePDFs } from "@/backend/services/pdf/merge.service";
import { mergeRequestSchema } from "@/backend/validators/pdf.validator";

export function mergePdfController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = mergeRequestSchema.parse({
      files: getFormFiles(formData),
    });

    return mergePDFs(payload.files);
  });
}
