import { getFormFiles } from "@/lib/upload";
import { mergePDFs } from "@/services/pdf/merge.service";
import { mergeRequestSchema } from "@/validators/pdf.validator";
import { handlePDFRequest } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handlePDFRequest(request, async (formData) => {
    const payload = mergeRequestSchema.parse({
      files: getFormFiles(formData),
    });

    return mergePDFs(payload.files);
  });
}
