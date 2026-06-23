import { getFormFiles } from "@/lib/upload";
import { convertJPGToPDF } from "@/services/pdf/jpg-to-pdf.service";
import { jpgToPdfRequestSchema } from "@/validators/pdf.validator";
import { handlePDFRequest } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = jpgToPdfRequestSchema.parse({
      files: getFormFiles(formData),
    });

    return convertJPGToPDF(payload.files);
  });
}
