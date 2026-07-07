import {
  IMAGE_TO_PDF_MIME_TYPES,
  EXCEL_MIME_TYPES,
  PDF_MAX_FILE_SIZE,
  PDF_MAX_FILES,
  PDF_MIME_TYPE,
  POWERPOINT_MIME_TYPES,
  WORD_MIME_TYPES,
} from "@/backend/types/pdf";
import { ApiError } from "@/backend/utils/api-error";

export const MAX_FILE_SIZE = PDF_MAX_FILE_SIZE;
export const MAX_FILES = PDF_MAX_FILES;

export const PDF_UPLOAD_MIME_TYPES = [PDF_MIME_TYPE] as const;
export const PDF_UPLOAD_EXTENSIONS = [".pdf"] as const;
export const IMAGE_UPLOAD_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
export const WORD_UPLOAD_EXTENSIONS = [".doc", ".docx"] as const;
export const EXCEL_UPLOAD_EXTENSIONS = [".xls", ".xlsx", ".csv"] as const;
export const POWERPOINT_UPLOAD_EXTENSIONS = [".ppt", ".pptx"] as const;

export type UploadValidationOptions = {
  allowedMimeTypes?: readonly string[];
  allowedExtensions?: readonly string[];
  maxFileSize?: number;
  maxFiles?: number;
  minFiles?: number;
};

export type FileLike = {
  name: string;
  size: number;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

export const imageUploadMimeTypes = [...IMAGE_TO_PDF_MIME_TYPES];
export const wordUploadMimeTypes = [...WORD_MIME_TYPES];
export const excelUploadMimeTypes = [...EXCEL_MIME_TYPES];
export const powerpointUploadMimeTypes = [...POWERPOINT_MIME_TYPES];

export function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .normalize("NFKD")
    .replace(/[^\w.\-()\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleanName || "uploaded-file";
}

export function getFileExtension(fileName: string) {
  const sanitizedName = sanitizeFileName(fileName);
  const dotIndex = sanitizedName.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return sanitizedName.slice(dotIndex).toLowerCase();
}

export function isFileLike(value: unknown): value is FileLike {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<FileLike>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.size === "number" &&
    typeof candidate.type === "string" &&
    typeof candidate.arrayBuffer === "function"
  );
}

export function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 1)} ${
    units[exponent]
  }`;
}

export function validateUploadFile(
  file: FileLike,
  options: UploadValidationOptions = {},
) {
  const {
    allowedMimeTypes = PDF_UPLOAD_MIME_TYPES,
    allowedExtensions = PDF_UPLOAD_EXTENSIONS,
    maxFileSize = MAX_FILE_SIZE,
  } = options;

  const fileName = sanitizeFileName(file.name);
  const extension = getFileExtension(fileName);

  if (file.size <= 0) {
    throw new ApiError(`${fileName} is empty.`, 400);
  }

  if (file.size > maxFileSize) {
    throw new ApiError(
      `${fileName} is too large. Maximum size is ${formatBytes(maxFileSize)}.`,
      413,
    );
  }

  if (!allowedMimeTypes.includes(file.type)) {
    throw new ApiError(`${fileName} has an unsupported content type.`, 415);
  }

  if (!allowedExtensions.includes(extension)) {
    throw new ApiError(`${fileName} has an unsupported file extension.`, 415);
  }

  return {
    fileName,
    extension,
    size: file.size,
    type: file.type,
  };
}

export function validateUploadFiles(
  files: FileLike[],
  options: UploadValidationOptions = {},
) {
  const { maxFiles = MAX_FILES, minFiles = 1 } = options;

  if (files.length < minFiles) {
    throw new ApiError(
      `Upload at least ${minFiles} ${minFiles === 1 ? "file" : "files"}.`,
      400,
    );
  }

  if (files.length > maxFiles) {
    throw new ApiError(`Upload no more than ${maxFiles} files.`, 413);
  }

  return files.map((file) => validateUploadFile(file, options));
}

export async function fileToBuffer(file: FileLike) {
  return Buffer.from(await file.arrayBuffer());
}

export function bufferToBase64(buffer: Buffer | Uint8Array) {
  return Buffer.from(buffer).toString("base64");
}

export function getFormFiles(formData: FormData, key = "files"): FileLike[] {
  const files: FileLike[] = [];

  for (const entry of formData.getAll(key)) {
    if (isFileLike(entry)) files.push(entry);
  }

  return files;
}

export function getRequiredFormFile(formData: FormData, key = "file") {
  const file = formData.get(key);

  if (!isFileLike(file)) {
    throw new ApiError("A valid file is required.", 400);
  }

  return file;
}

export function assertMultipartRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    throw new ApiError("Request must use multipart/form-data.", 415);
  }
}
