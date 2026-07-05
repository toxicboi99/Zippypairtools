import { removePagesPdfController } from "@/backend/controllers/pdf/remove-pages.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return removePagesPdfController(request);
}
