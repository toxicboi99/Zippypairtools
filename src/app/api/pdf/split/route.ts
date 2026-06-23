import { getRequiredFormFile } from "@/lib/upload";
import { splitPDF } from "@/services/pdf/split.service";
import {
  parseSplitOptions,
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
    const options = parseSplitOptions(formData);

    return splitPDF(payload.file, options);
  });
}
