import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

export type BulletStyle = "dash" | "asterisk" | "number" | "plus" | "arrow";

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

  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    text = buffer.toString("utf-8");
  } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    text = await extractTextFromPDF(buffer);
  } else if (
    fileType === "application/msword" ||
    fileName.endsWith(".doc")
  ) {
    text = await extractTextFromDoc(buffer);
  } else if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    text = await extractTextFromDocx(buffer);
  } else {
    // Fallback: try to extract as text
    text = buffer.toString("utf-8");
  }

  if (!text.trim()) {
    throw new Error("Could not extract text from file");
  }

  return {
    text: text.trim(),
    fileName,
    fileType,
  };
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfjs = await import("pdfjs-dist");
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items
        .map((item: any) => item.str || "")
        .join(" ");
      text += "\n";
    }
    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    return buffer.toString("utf-8");
  }
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    // For now, return error message - DOCX requires complex parsing
    // Users can install 'mammoth' package for full DOCX support
    throw new Error("DOCX files require the 'mammoth' package. Please convert to TXT or PDF.");
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return buffer.toString("utf-8");
  }
}

/**
 * Extract text from DOC
 */
async function extractTextFromDoc(buffer: Buffer): Promise<string> {
  try {
    // For .doc files, use a simple extraction or return buffer as text
    return buffer.toString("utf-8");
  } catch (error) {
    console.error("DOC extraction error:", error);
    return buffer.toString("utf-8");
  }
}

/**
 * Get file type from filename
 */
function getFileType(fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  const mimeTypes: { [key: string]: string } = {
    txt: "text/plain",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    md: "text/markdown",
  };
  return mimeTypes[ext || ""] || "text/plain";
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
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `${lengthGuide}. ${formatGuide}.\n\nText to summarize:\n${text}\n\n${prompt || "Please summarize the above text."}`
    ),
  ];

  let response = await model.invoke(messages);
  let summary = String(response.content);

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
