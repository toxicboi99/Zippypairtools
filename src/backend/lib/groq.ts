import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";

import { ApiError } from "@/backend/utils/api-error";

type GroqMessage = {
  role: "system" | "user";
  content: string;
};

let groqModel: ChatGroq | null = null;

function getGroqModel() {
  if (!groqModel) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new ApiError("GROQ_API_KEY is required for AI tools.", 503);
    }

    groqModel = new ChatGroq({
      apiKey,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
    });
  }

  return groqModel;
}

export async function runGroqChat(messages: GroqMessage[]) {
  const model = getGroqModel();
  const response = await model.invoke(
    messages.map((message) =>
      message.role === "system"
        ? new SystemMessage(message.content)
        : new HumanMessage(message.content),
    ),
  );

  if (typeof response.content === "string") {
    return response.content.trim();
  }

  return response.content
    .map((part) => ("text" in part ? part.text : ""))
    .join("")
    .trim();
}
