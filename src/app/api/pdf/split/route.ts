import { splitPdfController } from "@/backend/controllers/pdf/split.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return splitPdfController(request);
}
