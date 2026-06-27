import { runGroqChat } from "@/lib/groq";
import type { GrammarRequest } from "@/validators/ai.validator";

export async function checkGrammar(input: GrammarRequest) {
  const correctedText = await runGroqChat([
    {
      role: "system",
      content:
        "You are a grammar editor. Correct grammar, punctuation, spelling, and clarity while preserving meaning.",
    },
    {
      role: "user",
      content: `Use ${input.dialect} English. Return the corrected text only.\n\nText:\n${input.text}`,
    },
  ]);

  return {
    correctedText,
    dialect: input.dialect,
  };
}
