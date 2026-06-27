import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

export interface SummarizeOptions {
  text: string;
  prompt?: string;
  length?: "short" | "medium" | "long";
  format?: "paragraph" | "bullets";
}

const systemPrompt = `You are a summarization expert. Create concise, accurate summaries that preserve key information and maintain the original context.`;

/**
 * Summarize text using AI
 */
export async function summarizeText(options: SummarizeOptions): Promise<string> {
  const { text, prompt, length = "medium", format = "paragraph" } = options;

  if (!text?.trim()) {
    throw new Error("Text to summarize cannot be empty");
  }

  const lengthGuide =
    length === "short"
      ? "Keep it very brief (2-3 sentences)"
      : length === "long"
        ? "Provide a detailed summary (4-5 sentences)"
        : "Provide a balanced summary (3-4 sentences)";

  const formatGuide =
    format === "bullets"
      ? "Format the summary as bullet points"
      : "Format the summary as a paragraph";

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `${lengthGuide}. ${formatGuide}.\n\nText to summarize:\n${text}\n\n${prompt || "Please summarize the above text."}`
    ),
  ];

  const response = await model.invoke(messages);
  return String(response.content);
}

/**
 * Summarize with custom prompt
 */
export async function summarizeWithPrompt(
  text: string,
  customPrompt: string
): Promise<string> {
  if (!text?.trim()) {
    throw new Error("Text cannot be empty");
  }

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(`Document:\n${text}\n\nTask: ${customPrompt}`),
  ];

  const response = await model.invoke(messages);
  return String(response.content);
}

/**
 * Batch summarize multiple texts
 */
export async function summarizeMultiple(
  texts: string[],
  prompt?: string
): Promise<string[]> {
  const summaries = await Promise.all(
    texts.map((text) =>
      summarizeText({ text, prompt, length: "medium", format: "paragraph" })
    )
  );
  return summaries;
}

/**
 * Extract key points from text
 */
export async function extractKeyPoints(text: string): Promise<string> {
  const messages = [
    new SystemMessage(
      "Extract the most important key points from the provided text. Format as bullet points."
    ),
    new HumanMessage(text),
  ];

  const response = await model.invoke(messages);
  return String(response.content);
}
