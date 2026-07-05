import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getRequiredFormFile } from "@/backend/lib/upload";
import { splitPDF } from "@/backend/services/pdf/split.service";
import {
  parseSplitOptions,
  singlePdfRequestSchema,
} from "@/backend/validators/pdf.validator";

export function splitPdfController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });
    const options = parseSplitOptions(formData);

    return splitPDF(payload.file, options);
  });
}
