import { textToSpeechController } from "@/backend/controllers/ai/text-to-speech.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return textToSpeechController(request);
}
