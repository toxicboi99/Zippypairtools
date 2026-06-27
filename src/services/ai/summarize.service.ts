import { runGroqChat } from "@/lib/groq";
import type { SummarizeRequest } from "@/validators/ai.validator";

const summaryLengthInstructions = {
  short: "Use 2-3 concise bullet points.",
  medium: "Use one short paragraph followed by 3 key points.",
  long: "Use a detailed summary with clear sections and key points.",
} satisfies Record<SummarizeRequest["length"], string>;

export async function summarizeText(input: SummarizeRequest) {
  const summary = await runGroqChat([
    {
      role: "system",
      content:
        "You summarize text accurately. Preserve the original meaning and do not invent facts.",
    },
    {
      role: "user",
      content: `${summaryLengthInstructions[input.length]}\n\nText:\n${input.text}`,
    },
  ]);

  return {
    summary,
    length: input.length,
  };
}
