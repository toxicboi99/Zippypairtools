import { runGroqChat } from "@/lib/groq";
import type { ParaphraseRequest } from "@/validators/ai.validator";

export async function paraphraseText(input: ParaphraseRequest) {
  const paraphrase = await runGroqChat([
    {
      role: "system",
      content:
        "You rewrite text while preserving meaning, factual claims, names, numbers, and intent.",
    },
    {
      role: "user",
      content: `Rewrite the text in a ${input.tone} tone.\n\nText:\n${input.text}`,
    },
  ]);

  return {
    paraphrase,
    tone: input.tone,
  };
}
