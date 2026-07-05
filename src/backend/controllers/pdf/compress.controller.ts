import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getRequiredFormFile } from "@/backend/lib/upload";
import { compressPDF } from "@/backend/services/pdf/compress.service";
import {
  parseCompressionLevel,
  singlePdfRequestSchema,
} from "@/backend/validators/pdf.validator";

export function compressPdfController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });
    const compressionLevel = parseCompressionLevel(
      formData.get("compressionLevel"),
    );

    return compressPDF(payload.file, compressionLevel);
  });
}
