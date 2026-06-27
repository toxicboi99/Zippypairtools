import type { TextToSpeechRequest } from "@/validators/ai.validator";

export function prepareTextToSpeech(input: TextToSpeechRequest) {
  return {
    text: input.text,
    voice: input.voice,
    characterCount: input.text.length,
    message:
      "Text-to-speech request validated. Add a speech provider to return generated audio.",
  };
}
