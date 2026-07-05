import { NextRequest, NextResponse } from "next/server";

import {
  extractTextFromFile,
  summarizeWithPrompt,
  type BulletStyle,
} from "@/backend/services/ai/summarize.service";
import { toApiError } from "@/backend/utils/response";

const MAX_SUMMARY_FILE_SIZE = 50 * 1024 * 1024;

export async function summarizeGetController(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const command = searchParams.get("comd");
    const prompts = searchParams.get("prompts");

    searchParams.get("bulletStyle") as BulletStyle | null;

    if (!command) {
      return NextResponse.json(
        { error: "Missing 'comd' parameter" },
        { status: 400 },
      );
    }

    const result = await summarizeWithPrompt(
      command,
      prompts || "Please summarize the provided text",
    );

    return NextResponse.json(result);
  } catch (error) {
    const apiError = toApiError(error);

    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.statusCode },
    );
  }
}

export async function summarizePostController(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const prompts = formData.get("prompts");

    formData.get("bulletStyle") as BulletStyle | null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SUMMARY_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 413 },
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const extraction = await extractTextFromFile(fileBuffer, file.name);
    const result = await summarizeWithPrompt(
      extraction.text,
      typeof prompts === "string" && prompts.length > 0
        ? prompts
        : "Please summarize the provided text",
    );

    return NextResponse.json({
      summary: result,
      fileName: extraction.fileName,
      textLength: extraction.text.length,
      fileType: extraction.fileType,
    });
  } catch (error) {
    const apiError = toApiError(error);

    return NextResponse.json(
      { error: `Failed to process file: ${apiError.message}` },
      { status: apiError.statusCode },
    );
  }
}
