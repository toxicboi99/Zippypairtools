import { handleJsonRequest } from "@/app/api/_shared";
import { checkPlagiarism } from "@/services/ai/plagiarism.service";
import { plagiarismRequestSchema } from "@/validators/ai.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, plagiarismRequestSchema, checkPlagiarism);
}
