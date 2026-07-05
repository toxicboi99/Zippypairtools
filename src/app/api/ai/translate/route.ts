import { translateController } from "@/backend/controllers/ai/translate.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return translateController(request);
}
