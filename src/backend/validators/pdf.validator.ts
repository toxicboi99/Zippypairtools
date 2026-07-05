import { z } from "zod";

import {
  IMAGE_UPLOAD_EXTENSIONS,
  EXCEL_UPLOAD_EXTENSIONS,
  imageUploadMimeTypes,
  excelUploadMimeTypes,
  MAX_FILE_SIZE,
  MAX_FILES,
  PDF_UPLOAD_EXTENSIONS,
  PDF_UPLOAD_MIME_TYPES,
  POWERPOINT_UPLOAD_EXTENSIONS,
  powerpointUploadMimeTypes,
  WORD_UPLOAD_EXTENSIONS,
  wordUploadMimeTypes,
  type FileLike,
  formatBytes,
  getFileExtension,
  isFileLike,
  sanitizeFileName,
} from "@/backend/lib/upload";
import type {
  CompressionLevel,
  PDFPageNumberPosition,
  PDFRotationAngle,
  SplitMode,
} from "@/backend/types/pdf";

const pageRangePattern =
  /^\s*\d+\s*(?:-\s*\d+\s*)?(?:,\s*\d+\s*(?:-\s*\d+\s*)?)*$/;

export const pageRangeSchema = z
  .string()
  .trim()
  .min(1, "Enter at least one page number.")
  .regex(pageRangePattern, "Use page numbers like 1, 3-5, 8.");

export const compressionLevelSchema = z.enum(["low", "medium", "high"]);

export const splitModeSchema = z.enum(["all", "ranges"]);

export const pageNumberPositionSchema = z.enum([
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]);

export const rotationAngleSchema = z.coerce
  .number()
  .int()
  .refine((value): value is PDFRotationAngle =>
    [90, 180, 270, -90].includes(value),
  "Rotate by 90, 180, or 270 degrees.");

export const optionalPageRangeSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || pageRangePattern.test(value), {
    message: "Use page numbers like 1, 3-5, 8.",
  });

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
  pages: optionalPageRangeSchema,
  quality: z.coerce.number().int().min(40).max(95).default(85),
  dpi: z.coerce.number().int().min(72).max(300).default(144),
  outputSize: z.enum(["original", "fit-page"]).default("original"),
});

export const addPageNumberOptionsSchema = z.object({
  startNumber: z.coerce.number().int().min(0).max(99999).default(1),
  fontSize: z.coerce.number().int().min(8).max(72).default(12),
  fontColor: z
    .string()
    .trim()
    .regex(/^#?[0-9a-fA-F]{6}$/, "Use a hex color like #111827.")
    .default("#111827"),
  position: pageNumberPositionSchema.default("bottom-center"),
  pages: optionalPageRangeSchema,
});

export const rotateOptionsSchema = z.object({
  angle: rotationAngleSchema.default(90),
  pages: optionalPageRangeSchema,
});

export const editPdfOptionsSchema = z.object({
  deletePages: optionalPageRangeSchema,
  rotatePages: optionalPageRangeSchema,
  rotateAngle: rotationAngleSchema.optional(),
  pageOrder: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      const parsed = JSON.parse(value) as unknown;

      if (
        !Array.isArray(parsed) ||
        parsed.some((item) => !Number.isInteger(item) || item < 1)
      ) {
        throw new Error("Page order must be an array of page numbers.");
      }

      return parsed as number[];
    }),
  text: z.string().trim().max(2000).optional(),
  textPage: z.coerce.number().int().min(1).optional(),
  textX: z.coerce.number().min(0).optional(),
  textY: z.coerce.number().min(0).optional(),
  watermark: z.string().trim().max(200).optional(),
});

export const pdfToolOptionsSchema = z.object({
  splitMode: splitModeSchema.default("all"),
  splitRanges: z.string().trim().optional(),
  compressionLevel: compressionLevelSchema.default("medium"),
  removePages: z.string().trim().optional(),
  pageRanges: z.string().trim().optional(),
  quality: z.coerce.number().int().min(40).max(95).default(85),
  dpi: z.coerce.number().int().min(72).max(300).default(144),
  startNumber: z.coerce.number().int().min(0).max(99999).default(1),
  fontSize: z.coerce.number().int().min(8).max(72).default(12),
  fontColor: z.string().trim().default("#111827"),
  position: pageNumberPositionSchema.default("bottom-center"),
  rotateAngle: rotationAngleSchema.default(90),
  editText: z.string().trim().optional(),
  watermark: z.string().trim().optional(),
});

export type SplitOptionsInput = z.infer<typeof splitOptionsSchema>;
export type CompressOptionsInput = z.infer<typeof compressOptionsSchema>;
export type RemovePagesOptionsInput = z.infer<typeof removePagesOptionsSchema>;
export type PDFToJPGOptionsInput = z.infer<typeof pdfToJpgOptionsSchema>;
export type AddPageNumberOptionsInput = z.infer<
  typeof addPageNumberOptionsSchema
>;
export type RotateOptionsInput = z.infer<typeof rotateOptionsSchema>;
export type EditPDFOptionsInput = z.output<typeof editPdfOptionsSchema>;
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

export const excelFileSchema = createFileSchema({
  allowedMimeTypes: excelUploadMimeTypes,
  allowedExtensions: EXCEL_UPLOAD_EXTENSIONS,
});

export const powerpointFileSchema = createFileSchema({
  allowedMimeTypes: powerpointUploadMimeTypes,
  allowedExtensions: POWERPOINT_UPLOAD_EXTENSIONS,
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

export const singleExcelRequestSchema = z.object({
  file: excelFileSchema,
});

export const singlePowerpointRequestSchema = z.object({
  file: powerpointFileSchema,
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
    dpi: formData.get("dpi") || 144,
    outputSize: formData.get("outputSize") || "original",
  });
}

export function parseAddPageNumberOptions(formData: FormData) {
  const pages = formData.get("pages");

  return addPageNumberOptionsSchema.parse({
    startNumber: formData.get("startNumber") || 1,
    fontSize: formData.get("fontSize") || 12,
    fontColor: formData.get("fontColor") || "#111827",
    position:
      (formData.get("position") as PDFPageNumberPosition | null) ||
      "bottom-center",
    pages: typeof pages === "string" ? pages : undefined,
  });
}

export function parseRotateOptions(formData: FormData) {
  const pages = formData.get("pages");

  return rotateOptionsSchema.parse({
    angle: formData.get("angle") || 90,
    pages: typeof pages === "string" ? pages : undefined,
  });
}

export function parseEditPDFOptions(formData: FormData) {
  return editPdfOptionsSchema.parse({
    deletePages: formData.get("deletePages") || undefined,
    rotatePages: formData.get("rotatePages") || undefined,
    rotateAngle: formData.get("rotateAngle") || undefined,
    pageOrder: formData.get("pageOrder") || undefined,
    text: formData.get("text") || undefined,
    textPage: formData.get("textPage") || undefined,
    textX: formData.get("textX") || undefined,
    textY: formData.get("textY") || undefined,
    watermark: formData.get("watermark") || undefined,
  });
}
