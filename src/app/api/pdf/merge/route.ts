import { mergePdfController } from "@/backend/controllers/pdf/merge.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return mergePdfController(request);
}
