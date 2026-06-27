import { NextRequest, NextResponse } from "next/server";
import { summarizeWithPrompt } from "@/services/ai/summarize.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const comd = searchParams.get("comd");
    const prompts = searchParams.get("prompts");
    
    if (!comd) {
      return NextResponse.json(
        { error: "Missing 'comd' parameter" },
        { status: 400 }
      );
    }
    
    const result = await summarizeWithPrompt(
      comd,
      prompts || "Please summarize the provided text"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}