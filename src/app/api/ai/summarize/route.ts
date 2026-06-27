import { NextRequest, NextResponse } from "next/server";
import { summarizeWithPrompt, extractTextFromFile, type BulletStyle } from "@/services/ai/summarize.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const comd = searchParams.get("comd");
    const prompts = searchParams.get("prompts");
    const bulletStyle = (searchParams.get("bulletStyle") as BulletStyle) || "dash";
    
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const prompts = formData.get("prompts") as string;
    const bulletStyle = (formData.get("bulletStyle") as BulletStyle) || "dash";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Extract text from file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const extraction = await extractTextFromFile(fileBuffer, file.name);

    // Summarize the extracted text
    const result = await summarizeWithPrompt(
      extraction.text,
      prompts || "Please summarize the provided text"
    );

    return NextResponse.json({
      summary: result,
      fileName: extraction.fileName,
      textLength: extraction.text.length,
    });
  } catch (error) {
    console.error("File processing error:", error);
    return NextResponse.json(
      { error: `Failed to process file: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}