import { z } from "zod";

import {
  IMAGE_UPLOAD_EXTENSIONS,
  imageUploadMimeTypes,
  MAX_FILE_SIZE,
  MAX_FILES,
  PDF_UPLOAD_EXTENSIONS,
  PDF_UPLOAD_MIME_TYPES,
  WORD_UPLOAD_EXTENSIONS,
  wordUploadMimeTypes,
  type FileLike,
  formatBytes,
  getFileExtension,
  isFileLike,
  sanitizeFileName,
} from "@/lib/upload";
import type { CompressionLevel, SplitMode } from "@/types/pdf";

const pageRangePattern =
  /^\s*\d+\s*(?:-\s*\d+\s*)?(?:,\s*\d+\s*(?:-\s*\d+\s*)?)*$/;

export const pageRangeSchema = z
  .string()
  .trim()
  .min(1, "Enter at least one page number.")
  .regex(pageRangePattern, "Use page numbers like 1, 3-5, 8.");

export const compressionLevelSchema = z.enum(["low", "medium", "high"]);

export const splitModeSchema = z.enum(["all", "ranges"]);

export const splitOptionsSchema = z
  .object({
    mode: splitModeSchema.default("all"),
    ranges: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    if (value.mode === "ranges") {
      const result = pageRangeSchema.safeParse(value.ranges);

      if (!result.success) {
        context.addIssue({
          code: "custom",
          message: "Enter page ranges to split, for example 1-3, 5.",
          path: ["ranges"],
        });
      }
    }
  });

export const compressOptionsSchema = z.object({
  compressionLevel: compressionLevelSchema.default("medium"),
});

export const removePagesOptionsSchema = z.object({
  pages: pageRangeSchema,
});

export const pdfToJpgOptionsSchema = z.object({
  pages: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || pageRangePattern.test(value), {
      message: "Use page numbers like 1, 3-5, 8.",
    }),
  quality: z.coerce.number().int().min(40).max(95).default(85),
});

export const pdfToolOptionsSchema = z.object({
  splitMode: splitModeSchema.default("all"),
  splitRanges: z.string().trim().optional(),
  compressionLevel: compressionLevelSchema.default("medium"),
  removePages: z.string().trim().optional(),
  pageRanges: z.string().trim().optional(),
  quality: z.coerce.number().int().min(40).max(95).default(85),
});

export type SplitOptionsInput = z.infer<typeof splitOptionsSchema>;
export type CompressOptionsInput = z.infer<typeof compressOptionsSchema>;
export type RemovePagesOptionsInput = z.infer<typeof removePagesOptionsSchema>;
export type PDFToJPGOptionsInput = z.infer<typeof pdfToJpgOptionsSchema>;
export type PDFToolOptionsFormInput = z.input<typeof pdfToolOptionsSchema>;
export type PDFToolOptionsInput = z.output<typeof pdfToolOptionsSchema>;

export function createFileSchema({
  allowedMimeTypes = PDF_UPLOAD_MIME_TYPES,
  allowedExtensions = PDF_UPLOAD_EXTENSIONS,
  maxFileSize = MAX_FILE_SIZE,
}: {
  allowedMimeTypes?: readonly string[];
  allowedExtensions?: readonly string[];
  maxFileSize?: number;
} = {}) {
  return z.custom<FileLike>(isFileLike).superRefine((file, context) => {
    if (!isFileLike(file)) {
      context.addIssue({
        code: "custom",
        message: "A valid file is required.",
      });
      return;
    }

    const fileName = sanitizeFileName(file.name);
    const extension = getFileExtension(fileName);

    if (file.size <= 0) {
      context.addIssue({
        code: "custom",
        message: `${fileName} is empty.`,
      });
    }

    if (file.size > maxFileSize) {
      context.addIssue({
        code: "custom",
        message: `${fileName} is too large. Maximum size is ${formatBytes(
          maxFileSize,
        )}.`,
      });
    }

    if (!allowedMimeTypes.includes(file.type)) {
      context.addIssue({
        code: "custom",
        message: `${fileName} has an unsupported content type.`,
      });
    }

    if (!allowedExtensions.includes(extension)) {
      context.addIssue({
        code: "custom",
        message: `${fileName} has an unsupported file extension.`,
      });
    }
  });
}

export const pdfFileSchema = createFileSchema();

export const imageFileSchema = createFileSchema({
  allowedMimeTypes: imageUploadMimeTypes,
  allowedExtensions: IMAGE_UPLOAD_EXTENSIONS,
});

export const wordFileSchema = createFileSchema({
  allowedMimeTypes: wordUploadMimeTypes,
  allowedExtensions: WORD_UPLOAD_EXTENSIONS,
});

export function createFilesSchema({
  fileSchema = pdfFileSchema,
  minFiles = 1,
  maxFiles = MAX_FILES,
}: {
  fileSchema?: z.ZodType<FileLike>;
  minFiles?: number;
  maxFiles?: number;
} = {}) {
  return z
    .array(fileSchema)
    .min(
      minFiles,
      `Upload at least ${minFiles} file${minFiles > 1 ? "s" : ""}.`,
    )
    .max(maxFiles, `Upload no more than ${maxFiles} files.`);
}

export const mergeRequestSchema = z.object({
  files: createFilesSchema({ minFiles: 2 }),
});

export const jpgToPdfRequestSchema = z.object({
  files: createFilesSchema({ fileSchema: imageFileSchema, minFiles: 1 }),
});

export const singlePdfRequestSchema = z.object({
  file: pdfFileSchema,
});

export const singleWordRequestSchema = z.object({
  file: wordFileSchema,
});

export function parseCompressionLevel(value: FormDataEntryValue | null) {
  return compressOptionsSchema.parse({
    compressionLevel: value || "medium",
  }).compressionLevel as CompressionLevel;
}

export function parseSplitOptions(formData: FormData) {
  const mode = (formData.get("mode") || "all") as SplitMode;
  const ranges = formData.get("ranges");

  return splitOptionsSchema.parse({
    mode,
    ranges: typeof ranges === "string" ? ranges : undefined,
  });
}

export function parseRemovePagesOptions(formData: FormData) {
  return removePagesOptionsSchema.parse({
    pages: formData.get("pages"),
  });
}

export function parsePdfToJpgOptions(formData: FormData) {
  const pages = formData.get("pages");

  return pdfToJpgOptionsSchema.parse({
    pages: typeof pages === "string" ? pages : undefined,
    quality: formData.get("quality") || 85,
  });
}
