import { handleJsonRequest } from "@/app/api/_shared";
import { paraphraseText } from "@/services/ai/paraphrase.service";
import { paraphraseRequestSchema } from "@/validators/ai.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, paraphraseRequestSchema, paraphraseText);
}
