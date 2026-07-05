export const PDF_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const PDF_MAX_FILES = 20;

export const PDF_MIME_TYPE = "application/pdf";
export const PDF_EXTENSION = ".pdf";

export const IMAGE_TO_PDF_MIME_TYPES = ["image/jpeg", "image/png"] as const;
export const WORD_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
export const EXCEL_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
] as const;
export const POWERPOINT_MIME_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
  | "add-page-number"
  | "edit"
  | "rotate"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "pdf-to-word"
  | "word-to-pdf"
  | "pdf-to-excel"
  | "excel-to-pdf"
  | "pdf-to-powerpoint"
  | "powerpoint-to-pdf";

export type CompressionLevel = "low" | "medium" | "high";
export type SplitMode = "all" | "ranges";
export type PDFPageNumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type PDFRotationAngle = 90 | 180 | 270 | -90;

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

export interface PDFPage {
  id: string;
  page: number;
  thumbnail: string;
  width: number;
  height: number;
  rotation?: number;
  selected?: boolean;
  deleted?: boolean;
}

export interface PDFWorkspaceState {
  files: File[];
  pages: PDFPage[];
  activeAction: PDFToolAction;
  selectedPageIds: string[];
  currentPage: number;
  zoom: number;
  status: ProcessingState;
  progress: number;
  error?: string;
}

export interface PDFConversionOptions {
  pages?: string;
  quality?: number;
  dpi?: number;
  outputSize?: "original" | "fit-page";
}

export interface PDFPageNumberOptions {
  startNumber: number;
  fontSize: number;
  fontColor: string;
  position: PDFPageNumberPosition;
  pages?: string;
}

export interface PDFRotateOptions {
  angle: PDFRotationAngle;
  pages?: string;
}

export interface PDFEditOptions {
  deletePages?: string;
  rotatePages?: string;
  rotateAngle?: PDFRotationAngle;
  pageOrder?: number[];
  text?: string;
  textPage?: number;
  textX?: number;
  textY?: number;
  watermark?: string;
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
  dpi?: number;
}

export interface JPGToPDFRequest {
  files: PDFFile[];
}

export interface UploadResponse {
  id: string;
  fileName: string;
  size: number;
  pageCount: number;
  pages: PDFPage[];
  message: string;
}

export interface PDFResponse {
  files: PDFOutputFile[];
  message: string;
  meta?: Record<string, string | number | boolean | null>;
}

export type ToolResponse = PDFResponse;

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
