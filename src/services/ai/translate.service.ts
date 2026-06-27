import { runGroqChat } from "@/lib/groq";
import type { TranslateRequest } from "@/validators/ai.validator";

export async function translateText(input: TranslateRequest) {
  const languageHint = input.sourceLanguage
    ? ` from ${input.sourceLanguage}`
    : "";
  const translation = await runGroqChat([
    {
      role: "system",
      content:
        "You are a precise translator. Return only the translated text unless a word cannot be translated.",
    },
    {
      role: "user",
      content: `Translate${languageHint} to ${input.targetLanguage}:\n\n${input.text}`,
    },
  ]);

  return {
    translation,
    sourceLanguage: input.sourceLanguage ?? "auto",
    targetLanguage: input.targetLanguage,
  };
}
