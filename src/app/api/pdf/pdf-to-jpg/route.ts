import { getRequiredFormFile } from "@/lib/upload";
import { convertPDFToJPG } from "@/services/pdf/pdf-to-jpg.service";
import {
  parsePdfToJpgOptions,
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
    const options = parsePdfToJpgOptions(formData);

    return convertPDFToJPG(payload.file, options);
  });
}
