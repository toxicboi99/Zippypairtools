import { getRequiredFormFile } from "@/lib/upload";
import { convertPDFToWordPlaceholder } from "@/services/pdf/pdf-to-word.service";
import { singlePdfRequestSchema } from "@/validators/pdf.validator";
import { handlePDFRequest } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singlePdfRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });

    return convertPDFToWordPlaceholder(payload.file);
  });
}
