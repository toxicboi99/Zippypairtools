import { handleJsonRequest } from "@/backend/utils/json-request";
import { checkGrammar } from "@/backend/services/ai/grammar.service";
import { grammarRequestSchema } from "@/backend/validators/ai.validator";

export function grammarController(request: Request) {
  return handleJsonRequest(request, grammarRequestSchema, checkGrammar);
}
