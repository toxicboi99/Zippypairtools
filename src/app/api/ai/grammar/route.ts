import { handleJsonRequest } from "@/app/api/_shared";
import { checkGrammar } from "@/services/ai/grammar.service";
import { grammarRequestSchema } from "@/validators/ai.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, grammarRequestSchema, checkGrammar);
}
