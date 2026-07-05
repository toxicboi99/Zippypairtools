import { handleJsonRequest } from "@/backend/utils/json-request";
import { paraphraseText } from "@/backend/services/ai/paraphrase.service";
import { paraphraseRequestSchema } from "@/backend/validators/ai.validator";

export function paraphraseController(request: Request) {
  return handleJsonRequest(request, paraphraseRequestSchema, paraphraseText);
}
