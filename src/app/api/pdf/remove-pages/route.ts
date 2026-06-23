import { getRequiredFormFile } from "@/lib/upload";
import { removePDFPages } from "@/services/pdf/remove-pages.service";
import {
  parseRemovePagesOptions,
  singlePdfRequestSchema,
} from "@/validators/pdf.validator";
import { handlePDFRequest } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });
    const options = parseRemovePagesOptions(formData);

    return removePDFPages(payload.file, options.pages);
  });
}
