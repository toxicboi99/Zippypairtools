import { handlePDFRequest } from "@/backend/utils/pdf-request";
import { getRequiredFormFile } from "@/backend/lib/upload";
import { removePDFPages } from "@/backend/services/pdf/remove-pages.service";
import {
  parseRemovePagesOptions,
  singlePdfRequestSchema,
} from "@/backend/validators/pdf.validator";

export function removePagesPdfController(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });
    const options = parseRemovePagesOptions(formData);

    return removePDFPages(payload.file, options.pages);
  });
}
