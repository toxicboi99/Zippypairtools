import { pdfToJpgController } from "@/backend/controllers/pdf/pdf-to-jpg.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return pdfToJpgController(request);
}
