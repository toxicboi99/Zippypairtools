import {
  DOMMatrix as CanvasDOMMatrix,
  ImageData as CanvasImageData,
  createCanvas,
} from "canvas";

import type { FileLike } from "@/backend/lib/upload";
import type { PDFResponse } from "@/backend/types/pdf";
import { ApiError } from "@/backend/utils/api-error";
import {
  JPEG_OUTPUT_MIME_TYPE,
  MAX_RENDERED_PAGES,
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
  parsePageSelection,
} from "./pdf-utils";

export interface PDFToJPGOptions {
  pages?: string;
  quality?: number;
  dpi?: number;
}

export async function convertPDFToJPG(
  file: FileLike,
  options: PDFToJPGOptions = {},
): Promise<PDFResponse> {
  const { fileName, buffer, pageCount } = await loadPdfFile(file);
  const selectedPages = options.pages
    ? parsePageSelection(options.pages, pageCount)
    : Array.from(
        { length: Math.min(pageCount, MAX_RENDERED_PAGES) },
        (_, index) => index + 1,
      );

  if (selectedPages.length > MAX_RENDERED_PAGES) {
    throw new ApiError(
      `Convert up to ${MAX_RENDERED_PAGES} pages at a time.`,
      413,
    );
  }

  if (!options.pages && pageCount > MAX_RENDERED_PAGES) {
    throw new ApiError(
      `This PDF has ${pageCount} pages. Enter a page range with up to ${MAX_RENDERED_PAGES} pages.`,
      413,
    );
  }

  const baseName = getBaseName(fileName);

  try {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      disableFontFace: true,
      useWorkerFetch: false,
    });
    const renderDocument = await loadingTask.promise;

    try {
      const outputs = [];

      for (const pageNumber of selectedPages) {
        const imageBuffer = await renderPageToJPG({
          document: renderDocument,
          pageNumber,
          dpi: options.dpi ?? 144,
          quality: options.quality ?? 85,
        });

        outputs.push(
          createPdfOutputFile({
            bytes: imageBuffer,
            fileName: `${baseName}-page-${pageNumber}.jpg`,
            mimeType: JPEG_OUTPUT_MIME_TYPE,
            pageRange: `${pageNumber}`,
          }),
        );
      }

      return createPdfResponse({
        message: "PDF converted to JPG successfully.",
        files: outputs,
        meta: {
          inputPages: pageCount,
          outputFiles: outputs.length,
          dpi: options.dpi ?? 144,
          quality: options.quality ?? 85,
        },
      });
    } finally {
      await renderDocument.cleanup();
      await loadingTask.destroy();
    }
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : "PDF rendering failed.",
      501,
    );
  }
}

async function loadPdfJs() {
  const globalScope = globalThis as typeof globalThis & {
    DOMMatrix?: typeof globalThis.DOMMatrix;
    ImageData?: typeof globalThis.ImageData;
  };

  globalScope.DOMMatrix ??=
    CanvasDOMMatrix as unknown as typeof globalThis.DOMMatrix;
  globalScope.ImageData ??=
    CanvasImageData as unknown as typeof globalThis.ImageData;

  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

async function renderPageToJPG({
  document,
  pageNumber,
  dpi,
  quality,
}: {
  document: Awaited<
    ReturnType<typeof import("pdfjs-dist/legacy/build/pdf.mjs")["getDocument"]>["promise"]
  >;
  pageNumber: number;
  dpi: number;
  quality: number;
}) {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale: dpi / 72 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const canvasContext = canvas.getContext("2d");

  canvasContext.fillStyle = "#ffffff";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvas: canvas as unknown as HTMLCanvasElement,
    canvasContext: canvasContext as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise;

  page.cleanup();

  return canvas.toBuffer("image/jpeg", {
    quality: Math.min(Math.max(quality, 40), 95) / 100,
    progressive: true,
    chromaSubsampling: true,
  });
}
