export const PDF_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const PDF_MAX_FILES = 20;

export const PDF_MIME_TYPE = "application/pdf";
export const PDF_EXTENSION = ".pdf";

export const IMAGE_TO_PDF_MIME_TYPES = ["image/jpeg", "image/png"] as const;
export const WORD_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export type ProcessingState =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export type PDFToolAction =
  | "merge"
  | "split"
  | "compress"
  | "remove-pages"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "pdf-to-word"
  | "word-to-pdf";

export type CompressionLevel = "low" | "medium" | "high";
export type SplitMode = "all" | "ranges";

export interface PDFFile {
  id: string;
  fileName: string;
  size: number;
  mimeType: string;
  lastModified?: number;
  previewUrl?: string;
  pageCount?: number;
  order?: number;
}

export interface PDFOutputFile {
  fileName: string;
  mimeType: string;
  base64: string;
  size: number;
  pageCount?: number;
  pageRange?: string;
}

export interface MergeRequest {
  files: PDFFile[];
}

export interface SplitRequest {
  file: PDFFile;
  mode: SplitMode;
  ranges?: string;
}

export interface CompressRequest {
  file: PDFFile;
  compressionLevel: CompressionLevel;
}

export interface RemovePagesRequest {
  file: PDFFile;
  pages: string;
}

export interface PDFToJPGRequest {
  file: PDFFile;
  pages?: string;
  quality?: number;
}

export interface JPGToPDFRequest {
  files: PDFFile[];
}

export interface PDFResponse {
  files: PDFOutputFile[];
  message: string;
  meta?: Record<string, string | number | boolean | null>;
}

export type ApiResponse<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      details?: unknown;
    };
