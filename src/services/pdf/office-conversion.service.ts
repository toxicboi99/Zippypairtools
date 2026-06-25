import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import {
  EXCEL_UPLOAD_EXTENSIONS,
  POWERPOINT_UPLOAD_EXTENSIONS,
  WORD_UPLOAD_EXTENSIONS,
  excelUploadMimeTypes,
  fileToBuffer,
  powerpointUploadMimeTypes,
  sanitizeFileName,
  validateUploadFile,
  wordUploadMimeTypes,
  type FileLike,
  type UploadValidationOptions,
} from "@/lib/upload";
import type { PDFResponse } from "@/types/pdf";
import { ApiError } from "@/utils/api-error";
import {
  PDF_OUTPUT_MIME_TYPE,
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
} from "./pdf-utils";

const execFileAsync = promisify(execFile);
const CONVERSION_TIMEOUT_MS = 120_000;

type ConversionTarget = "pdf" | "docx" | "xlsx" | "pptx";

const outputMimeTypes: Record<ConversionTarget, string> = {
  pdf: PDF_OUTPUT_MIME_TYPE,
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function convertPDFWithLibreOffice(
  file: FileLike,
  target: Exclude<ConversionTarget, "pdf">,
  label: string,
): Promise<PDFResponse> {
  const { fileName, buffer, pageCount } = await loadPdfFile(file);
  const converted = await runLibreOfficeConversion({
    inputBuffer: buffer,
    inputFileName: fileName,
    target,
  });

  return createPdfResponse({
    message: `${label} converted successfully.`,
    files: [
      createPdfOutputFile({
        bytes: converted.bytes,
        fileName: `${getBaseName(fileName)}.${target}`,
        mimeType: outputMimeTypes[target],
        pageCount,
      }),
    ],
    meta: {
      inputPages: pageCount,
      converter: "libreoffice-headless",
    },
  });
}

export async function convertOfficeToPDF({
  file,
  label,
  validation,
}: {
  file: FileLike;
  label: string;
  validation: UploadValidationOptions;
}): Promise<PDFResponse> {
  const { fileName, size } = validateUploadFile(file, validation);
  const inputBuffer = await fileToBuffer(file);
  const converted = await runLibreOfficeConversion({
    inputBuffer,
    inputFileName: fileName,
    target: "pdf",
  });

  return createPdfResponse({
    message: `${label} converted successfully.`,
    files: [
      createPdfOutputFile({
        bytes: converted.bytes,
        fileName: `${getBaseName(fileName)}.pdf`,
        mimeType: PDF_OUTPUT_MIME_TYPE,
      }),
    ],
    meta: {
      inputSize: size,
      outputSize: converted.size,
      converter: "libreoffice-headless",
    },
  });
}

export function getWordValidationOptions(): UploadValidationOptions {
  return {
    allowedMimeTypes: wordUploadMimeTypes,
    allowedExtensions: WORD_UPLOAD_EXTENSIONS,
  };
}

export function getExcelValidationOptions(): UploadValidationOptions {
  return {
    allowedMimeTypes: excelUploadMimeTypes,
    allowedExtensions: EXCEL_UPLOAD_EXTENSIONS,
  };
}

export function getPowerpointValidationOptions(): UploadValidationOptions {
  return {
    allowedMimeTypes: powerpointUploadMimeTypes,
    allowedExtensions: POWERPOINT_UPLOAD_EXTENSIONS,
  };
}

async function runLibreOfficeConversion({
  inputBuffer,
  inputFileName,
  target,
}: {
  inputBuffer: Buffer;
  inputFileName: string;
  target: ConversionTarget;
}) {
  const workingDirectory = await mkdtemp(
    path.join(tmpdir(), "zippypair-office-"),
  );
  const sanitizedInputName = sanitizeFileName(inputFileName);
  const inputPath = path.join(workingDirectory, sanitizedInputName);
  const outputPath = path.join(
    workingDirectory,
    `${getBaseName(sanitizedInputName)}.${target}`,
  );

  try {
    await writeFile(inputPath, inputBuffer);
    await executeLibreOffice([
      "--headless",
      "--nologo",
      "--nofirststartwizard",
      "--convert-to",
      target,
      "--outdir",
      workingDirectory,
      inputPath,
    ]);

    const [bytes, fileStat] = await Promise.all([
      readFile(outputPath),
      stat(outputPath),
    ]);

    if (fileStat.size <= 0) {
      throw new ApiError("LibreOffice produced an empty output file.", 502);
    }

    return {
      bytes,
      size: fileStat.size,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    throw new ApiError(
      `LibreOffice could not convert this file. ${message}`,
      501,
    );
  } finally {
    await rm(workingDirectory, { force: true, recursive: true });
  }
}

async function executeLibreOffice(args: string[]) {
  const executables = getLibreOfficeExecutables();
  const failures: string[] = [];

  for (const executable of executables) {
    try {
      await execFileAsync(executable, args, {
        timeout: CONVERSION_TIMEOUT_MS,
        windowsHide: true,
      });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${executable}: ${message}`);
    }
  }

  throw new ApiError(
    "LibreOffice headless is not available or failed to start.",
    501,
    failures,
  );
}

function getLibreOfficeExecutables() {
  return [
    process.env.LIBREOFFICE_PATH,
    "soffice",
    "libreoffice",
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
  ].filter((value): value is string => Boolean(value));
}
