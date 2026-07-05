import { wordToPdfController } from "@/backend/controllers/pdf/word-to-pdf.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return wordToPdfController(request);
}
