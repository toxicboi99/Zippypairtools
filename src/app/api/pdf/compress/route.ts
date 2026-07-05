import { compressPdfController } from "@/backend/controllers/pdf/compress.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return compressPdfController(request);
}
