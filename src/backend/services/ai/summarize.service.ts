import * as XLSX from "xlsx";
// @ts-ignore - mammoth doesn't have complete type definitions
import mammoth from "mammoth";

import { runGroqChat } from "@/backend/lib/groq";

export type BulletStyle = "dash" | "asterisk" | "number" | "plus" | "arrow";
export type SupportedFileType = "txt" | "pdf" | "docx" | "doc" | "xlsx" | "xls" | "csv" | "md";

export interface SummarizeOptions {
  text: string;
  prompt?: string;
  length?: "short" | "medium" | "long";
  format?: "paragraph" | "bullets";
  bulletStyle?: BulletStyle;
}

export interface FileExtractionResult {
  text: string;
  fileName: string;
  fileType: string;
}

const systemPrompt = `You are a summarization expert. Create concise, accurate summaries that preserve key information and maintain the original context.`;

/**
 * Extract text from file buffer
 */
export async function extractTextFromFile(
  file: File | Buffer,
  fileName: string
): Promise<FileExtractionResult> {
  let buffer: Buffer;
  const fileType = getFileType(fileName);

  if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer());
  } else {
    buffer = file;
  }

  let text = "";

  try {
    if (fileType === "txt" || fileType === "md") {
      text = extractTextPlain(buffer);
    } else if (fileType === "pdf") {
      text = await extractTextFromPDF(buffer);
    } else if (fileType === "docx") {
      text = await extractTextFromDocx(buffer);
    } else if (fileType === "doc") {
      text = await extractTextFromDoc(buffer);
    } else if (fileType === "xlsx" || fileType === "xls") {
      text = extractTextFromExcel(buffer);
    } else if (fileType === "csv") {
      text = extractTextPlain(buffer);
    } else {
      text = extractTextPlain(buffer);
    }
  } catch (error) {
    console.error(`Error extracting ${fileType} file:`, error);
    text = extractTextPlain(buffer);
  }

  if (!text || !text.trim()) {
    throw new Error(`Could not extract text from ${fileType} file - file may be empty or corrupted`);
  }

  return {
    text: text.trim(),
    fileName,
    fileType,
  };
}

/**
 * Plain text extraction
 */
function extractTextPlain(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const data = await parser.getText();
    
    if (data && data.text && data.text.trim()) {
      return data.text.trim();
    } else {
      return "No text content found in PDF";
    }
  } catch (error) {
    console.error("[PDF] PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF file");
  } finally {
    await parser.destroy();
  }
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.value && result.value.trim()) {
      return result.value.trim();
    } else {
      return "No text content found in DOCX";
    }
  } catch (error) {
    console.error("[DOCX] DOCX extraction error:", error);
    return extractTextPlain(buffer);
  }
}

/**
 * Extract text from DOC (older Word format)
 */
async function extractTextFromDoc(buffer: Buffer): Promise<string> {
  try {
    // DOC format is complex; attempt basic extraction
    // Look for text patterns in the binary data
    const text = buffer.toString("binary");
    const cleanedText = text
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    
    if (cleanedText.length > 50) {
      return cleanedText;
    }
    throw new Error("Could not extract meaningful text from DOC");
  } catch (error) {
    console.error("DOC extraction error:", error);
    throw new Error("DOC format not fully supported - please convert to DOCX or another format");
  }
}

/**
 * Extract text from Excel (XLSX/XLS)
 */
function extractTextFromExcel(buffer: Buffer): string {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    
    let text = "";

    // Iterate through all sheets
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(sheet);
      text += `Sheet: ${sheetName}\n${csvData}\n\n`;
    }

    if (text.length > 0) {
      return text;
    } else {
      return "No content found in Excel file";
    }
  } catch (error) {
    console.error("[Excel] Excel extraction error:", error);
    throw new Error("Failed to extract Excel content");
  }
}

/**
 * Get file type from filename
 */
function getFileType(fileName: string): SupportedFileType {
  const ext = fileName.toLowerCase().split(".").pop() || "";
  const typeMap: { [key: string]: SupportedFileType } = {
    txt: "txt",
    pdf: "pdf",
    doc: "doc",
    docx: "docx",
    xls: "xls",
    xlsx: "xlsx",
    csv: "csv",
    md: "md",
  };
  return typeMap[ext] || "txt";
}

/**
 * Format bullet points with chosen style
 */
function formatBulletPoints(
  text: string,
  style: BulletStyle = "dash"
): string {
  const bulletMap = {
    dash: "- ",
    asterisk: "* ",
    number: (i: number) => `${i + 1}. `,
    plus: "+ ",
    arrow: "→ ",
  };

  const lines = text.split("\n").filter((line) => line.trim());

  if (style === "number") {
    return lines
      .map((line, i) => `${bulletMap[style](i)}${line.trim()}`)
      .join("\n");
  }

  const bullet = bulletMap[style];
  return lines.map((line) => `${bullet}${line.trim()}`).join("\n");
}

/**
 * Summarize text using AI
 */
export async function summarizeText(
  options: SummarizeOptions
): Promise<string> {
  const {
    text,
    prompt,
    length = "medium",
    format = "paragraph",
    bulletStyle = "dash",
  } = options;

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
      ? `Format the summary as bullet points using ${bulletStyle} style`
      : "Format the summary as a paragraph";

  const messages = [
    {
      role: "system" as const,
      content: systemPrompt,
    },
    {
      role: "user" as const,
      content: `${lengthGuide}. ${formatGuide}.\n\nText to summarize:\n${text}\n\n${prompt || "Please summarize the above text."}`,
    },
  ];

  let summary = await runGroqChat(messages);

  if (format === "bullets") {
    summary = formatBulletPoints(summary, bulletStyle);
  }

  return summary;
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
    {
      role: "system" as const,
      content: systemPrompt,
    },
    {
      role: "user" as const,
      content: `Document:\n${text}\n\nTask: ${customPrompt}`,
    },
  ];

  return runGroqChat(messages);
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
    {
      role: "system" as const,
      content:
        "Extract the most important key points from the provided text. Format as bullet points.",
    },
    {
      role: "user" as const,
      content: text,
    },
  ];

  return runGroqChat(messages);
}
