import type { CompressionLevel, PDFToolAction, SplitMode } from "@/types/pdf";

export type PDFToolOptionKind =
  | "none"
  | "split"
  | "compress"
  | "remove-pages"
  | "pdf-to-jpg";

export interface PDFToolConfig {
  slug: string;
  action: PDFToolAction;
  endpoint: string;
  title: string;
  description: string;
  uploadTitle: string;
  uploadDescription: string;
  accept: string;
  allowedMimeTypes: readonly string[];
  allowedExtensions: readonly string[];
  minFiles: number;
  maxFiles: number;
  optionKind: PDFToolOptionKind;
  reorderable?: boolean;
  placeholder?: boolean;
}

export const pdfToolConfigs = {
  "pdf-merge": {
    slug: "pdf-merge",
    action: "merge",
    endpoint: "/api/pdf/merge",
    title: "Merge PDFs",
    description: "Arrange PDFs in the exact order you want, then merge them.",
    uploadTitle: "Upload PDFs to merge",
    uploadDescription: "Drag, click, or paste PDF files. Reorder before merging.",
    accept: ".pdf,application/pdf",
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    minFiles: 2,
    maxFiles: 20,
    optionKind: "none",
    reorderable: true,
  },
  "pdf-split": {
    slug: "pdf-split",
    action: "split",
    endpoint: "/api/pdf/split",
    title: "Split PDF",
    description: "Create one file per page or split by selected page ranges.",
    uploadTitle: "Upload a PDF to split",
    uploadDescription: "Use ranges like 1-3, 5 when you only need some pages.",
    accept: ".pdf,application/pdf",
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    minFiles: 1,
    maxFiles: 1,
    optionKind: "split",
  },
  "compress-pdf": {
    slug: "compress-pdf",
    action: "compress",
    endpoint: "/api/pdf/compress",
    title: "Compress PDF",
    description: "Optimize object streams and metadata for a smaller PDF.",
    uploadTitle: "Upload a PDF to compress",
    uploadDescription: "Choose a compression level before processing.",
    accept: ".pdf,application/pdf",
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    minFiles: 1,
    maxFiles: 1,
    optionKind: "compress",
  },
  "remove-pdf-pages": {
    slug: "remove-pdf-pages",
    action: "remove-pages",
    endpoint: "/api/pdf/remove-pages",
    title: "Remove PDF Pages",
    description: "Delete selected pages and keep the rest of the document.",
    uploadTitle: "Upload a PDF to clean up",
    uploadDescription: "Enter the pages to remove, such as 2, 4-6.",
    accept: ".pdf,application/pdf",
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    minFiles: 1,
    maxFiles: 1,
    optionKind: "remove-pages",
  },
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    action: "pdf-to-jpg",
    endpoint: "/api/pdf/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Render selected PDF pages as JPG image files.",
    uploadTitle: "Upload a PDF to convert",
    uploadDescription: "Convert all pages or provide a page range.",
    accept: ".pdf,application/pdf",
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    minFiles: 1,
    maxFiles: 1,
    optionKind: "pdf-to-jpg",
  },
  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    action: "jpg-to-pdf",
    endpoint: "/api/pdf/jpg-to-pdf",
    title: "JPG to PDF",
    description: "Turn JPG or PNG images into one clean PDF.",
    uploadTitle: "Upload images",
    uploadDescription: "Drag images into the order you want inside the PDF.",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    allowedMimeTypes: ["image/jpeg", "image/png"],
    allowedExtensions: [".jpg", ".jpeg", ".png"],
    minFiles: 1,
    maxFiles: 20,
    optionKind: "none",
    reorderable: true,
  },
  "pdf-to-word": {
    slug: "pdf-to-word",
    action: "pdf-to-word",
    endpoint: "/api/pdf/pdf-to-word",
    title: "PDF to Word",
    description: "Validate PDFs before handing them to a Word conversion provider.",
    uploadTitle: "Upload a PDF",
    uploadDescription: "This placeholder confirms upload validation and service readiness.",
    accept: ".pdf,application/pdf",
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    minFiles: 1,
    maxFiles: 1,
    optionKind: "none",
    placeholder: true,
  },
  "word-to-pdf": {
    slug: "word-to-pdf",
    action: "word-to-pdf",
    endpoint: "/api/pdf/word-to-pdf",
    title: "Word to PDF",
    description: "Validate Word documents before provider-backed PDF conversion.",
    uploadTitle: "Upload a Word document",
    uploadDescription: "This placeholder accepts DOC and DOCX files.",
    accept:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    allowedMimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".doc", ".docx"],
    minFiles: 1,
    maxFiles: 1,
    optionKind: "none",
    placeholder: true,
  },
} satisfies Record<string, PDFToolConfig>;

export type PDFToolSlug = keyof typeof pdfToolConfigs;

export const pdfToolSlugs = Object.keys(pdfToolConfigs) as PDFToolSlug[];

export const defaultPdfToolOptions = {
  splitMode: "all" as SplitMode,
  splitRanges: "",
  compressionLevel: "medium" as CompressionLevel,
  removePages: "",
  pageRanges: "",
  quality: 85,
};

export function isPDFToolSlug(slug: string): slug is PDFToolSlug {
  return slug in pdfToolConfigs;
}

export function getPDFToolConfig(slug: string) {
  return isPDFToolSlug(slug) ? pdfToolConfigs[slug] : null;
}
