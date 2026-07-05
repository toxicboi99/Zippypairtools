import { pdfToWordController } from "@/backend/controllers/pdf/pdf-to-word.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return pdfToWordController(request);
}
