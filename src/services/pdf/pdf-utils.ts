import { PDFDocument } from "pdf-lib";

import {
  PDF_UPLOAD_EXTENSIONS,
  PDF_UPLOAD_MIME_TYPES,
  bufferToBase64,
  fileToBuffer,
  sanitizeFileName,
  validateUploadFile,
  validateUploadFiles,
  type FileLike,
  type UploadValidationOptions,
} from "@/lib/upload";
import type { PDFOutputFile, PDFResponse } from "@/types/pdf";
import { ApiError } from "@/utils/api-error";

export const PDF_OUTPUT_MIME_TYPE = "application/pdf";
export const JPEG_OUTPUT_MIME_TYPE = "image/jpeg";
export const MAX_RENDERED_PAGES = 20;

export async function loadPdfDocument(buffer: Buffer, fileName: string) {
  try {
    const pdfDocument = await PDFDocument.load(buffer, {
      ignoreEncryption: false,
      throwOnInvalidObject: true,
      updateMetadata: false,
    });

    if (pdfDocument.getPageCount() < 1) {
      throw new Error("PDF has no pages.");
    }

    return pdfDocument;
  } catch {
    throw new ApiError(
      `${fileName} is malformed, encrypted, or not a valid PDF.`,
      422,
    );
  }
}

export async function loadPdfFile(file: FileLike) {
  const { fileName } = validateUploadFile(file, getPdfValidationOptions());
  const buffer = await fileToBuffer(file);
  const pdfDocument = await loadPdfDocument(buffer, fileName);

  return {
    fileName,
    buffer,
    pdfDocument,
    pageCount: pdfDocument.getPageCount(),
  };
}

export function getPdfValidationOptions(
  overrides: UploadValidationOptions = {},
): UploadValidationOptions {
  return {
    allowedMimeTypes: PDF_UPLOAD_MIME_TYPES,
    allowedExtensions: PDF_UPLOAD_EXTENSIONS,
    ...overrides,
  };
}

export function validatePdfFiles(
  files: FileLike[],
  options: UploadValidationOptions = {},
) {
  return validateUploadFiles(files, getPdfValidationOptions(options));
}

export function getBaseName(fileName: string) {
  const sanitizedName = sanitizeFileName(fileName);
  const dotIndex = sanitizedName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return sanitizedName;
  }

  return sanitizedName.slice(0, dotIndex);
}

export function parsePageSelection(input: string, pageCount: number) {
  const selectedPages = new Set<number>();
  const segments = input
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    throw new ApiError("Enter at least one page number.", 400);
  }

  for (const segment of segments) {
    const [startValue, endValue] = segment
      .split("-")
      .map((value) => Number.parseInt(value.trim(), 10));
    const start = startValue;
    const end = endValue ?? startValue;

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 1 ||
      end < 1 ||
      start > end
    ) {
      throw new ApiError(`Invalid page range: ${segment}.`, 400);
    }

    if (end > pageCount) {
      throw new ApiError(
        `Page range ${segment} exceeds this PDF's ${pageCount} pages.`,
        400,
      );
    }

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      selectedPages.add(pageNumber);
    }
  }

  return [...selectedPages].sort((a, b) => a - b);
}

export function parsePageRanges(input: string, pageCount: number) {
  return input
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => ({
      label: segment.replace(/\s+/g, ""),
      pages: parsePageSelection(segment, pageCount),
    }));
}

export function createSinglePageRanges(pageCount: number) {
  return Array.from({ length: pageCount }, (_, index) => {
    const pageNumber = index + 1;

    return {
      label: `${pageNumber}`,
      pages: [pageNumber],
    };
  });
}

export function createPdfOutputFile({
  bytes,
  fileName,
  pageCount,
  pageRange,
  mimeType = PDF_OUTPUT_MIME_TYPE,
}: {
  bytes: Buffer | Uint8Array;
  fileName: string;
  pageCount?: number;
  pageRange?: string;
  mimeType?: string;
}): PDFOutputFile {
  const buffer = Buffer.from(bytes);

  return {
    fileName: sanitizeFileName(fileName),
    mimeType,
    base64: bufferToBase64(buffer),
    size: buffer.byteLength,
    ...(pageCount ? { pageCount } : {}),
    ...(pageRange ? { pageRange } : {}),
  };
}

export function createPdfResponse({
  files,
  message,
  meta,
}: {
  files: PDFOutputFile[];
  message: string;
  meta?: PDFResponse["meta"];
}): PDFResponse {
  return {
    files,
    message,
    ...(meta ? { meta } : {}),
  };
}
