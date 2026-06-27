import { handleJsonRequest } from "@/app/api/_shared";
import { prepareTextToSpeech } from "@/services/ai/tts.service";
import { textToSpeechRequestSchema } from "@/validators/ai.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(
    request,
    textToSpeechRequestSchema,
    prepareTextToSpeech,
  );
}
