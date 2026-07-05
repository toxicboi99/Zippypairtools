import { paraphraseController } from "@/backend/controllers/ai/paraphrase.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return paraphraseController(request);
}
