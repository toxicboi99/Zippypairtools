import { handleJsonRequest } from "@/backend/utils/json-request";
import { prepareTextToSpeech } from "@/backend/services/ai/tts.service";
import { textToSpeechRequestSchema } from "@/backend/validators/ai.validator";

export function textToSpeechController(request: Request) {
  return handleJsonRequest(
    request,
    textToSpeechRequestSchema,
    prepareTextToSpeech,
  );
}
