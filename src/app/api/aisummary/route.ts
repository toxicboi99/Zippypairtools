import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Initialize model at module level (no await needed)
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

const systemPrompt = `Summarize the total text in short form`;

const datass = `Trusted Digital Solutions Partner
Build Powerful Digital Products That Grow Your Business
We help startups, businesses, and enterprises design, develop, and scale modern websites, mobile apps, and software solutions that drive real business growth.

Why Branding is More Important Than Ever in the Digital Era
In a crowded digital marketplace, branding is what makes your business memorable. The Importance of Mobile App Development for Business Growth
Mobile apps have become a key driver of digital transformation. With users spending more time on mobile. Why Every Business Needs a Strong Website in 2026
In today's digital-first world, your website is often the first interaction customers have with your.`;

async function answerQuestion(data: string, prompt: string) {
  const messages = [
    new SystemMessage(
      `You are a helpful assistant. Answer based ONLY on the provided document context.
If the answer is not in the document, say "I couldn't find that information in the document."
Be concise and accurate.`
    ),
    new HumanMessage(
      `Document context:\n${data}\n\nQuestion: ${prompt}`
    ),
  ];

  const response = await model.invoke(messages);
  return response.content;
}

export async function GET() {
  try {
    const result = await answerQuestion(datass, systemPrompt);
    return NextResponse.json({ summary: result });
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}