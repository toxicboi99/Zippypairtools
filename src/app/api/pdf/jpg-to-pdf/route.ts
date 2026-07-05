import { jpgToPdfController } from "@/backend/controllers/pdf/jpg-to-pdf.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return jpgToPdfController(request);
}
