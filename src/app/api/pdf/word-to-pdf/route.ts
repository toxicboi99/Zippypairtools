import { getRequiredFormFile } from "@/lib/upload";
import { convertWordToPDFPlaceholder } from "@/services/pdf/word-to-pdf.service";
import { singleWordRequestSchema } from "@/validators/pdf.validator";
import { handlePDFRequest } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = singleWordRequestSchema.parse({
      file: getRequiredFormFile(formData),
    });

    return convertWordToPDFPlaceholder(payload.file);
  });
}
