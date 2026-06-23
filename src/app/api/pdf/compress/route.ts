import { getRequiredFormFile } from "@/lib/upload";
import { compressPDF } from "@/services/pdf/compress.service";
import {
  parseCompressionLevel,
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
    const compressionLevel = parseCompressionLevel(
      formData.get("compressionLevel"),
    );

    return compressPDF(payload.file, compressionLevel);
  });
}
