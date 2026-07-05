import { grammarController } from "@/backend/controllers/ai/grammar.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return grammarController(request);
}
