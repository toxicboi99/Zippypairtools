import { handleJsonRequest } from "@/backend/utils/json-request";
import { translateText } from "@/backend/services/ai/translate.service";
import { translateRequestSchema } from "@/backend/validators/ai.validator";

export function translateController(request: Request) {
  return handleJsonRequest(request, translateRequestSchema, translateText);
}
