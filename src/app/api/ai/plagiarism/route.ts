import { plagiarismController } from "@/backend/controllers/ai/plagiarism.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return plagiarismController(request);
}
