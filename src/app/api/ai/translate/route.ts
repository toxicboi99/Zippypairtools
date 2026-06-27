import { handleJsonRequest } from "@/app/api/_shared";
import { translateText } from "@/services/ai/translate.service";
import { translateRequestSchema } from "@/validators/ai.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, translateRequestSchema, translateText);
}
