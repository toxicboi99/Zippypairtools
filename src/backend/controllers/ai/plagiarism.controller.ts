import { handleJsonRequest } from "@/backend/utils/json-request";
import { checkPlagiarism } from "@/backend/services/ai/plagiarism.service";
import { plagiarismRequestSchema } from "@/backend/validators/ai.validator";

export function plagiarismController(request: Request) {
  return handleJsonRequest(request, plagiarismRequestSchema, checkPlagiarism);
}
