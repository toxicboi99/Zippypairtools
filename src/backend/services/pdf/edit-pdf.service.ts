import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

import type { FileLike } from "@/backend/lib/upload";
import type { PDFEditOptions, PDFResponse } from "@/backend/types/pdf";
import { ApiError } from "@/backend/utils/api-error";
import {
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
  parsePageSelection,
} from "./pdf-utils";

export async function editPDF(
  file: FileLike,
  options: PDFEditOptions,
): Promise<PDFResponse> {
  const { fileName, pdfDocument, pageCount } = await loadPdfFile(file);
  const outputDocument = await PDFDocument.create();
  const pagesToDelete = new Set(
    options.deletePages ? parsePageSelection(options.deletePages, pageCount) : [],
  );
  const orderedPageNumbers = getOrderedPageNumbers({
    pageCount,
    pageOrder: options.pageOrder,
    pagesToDelete,
  });

  if (orderedPageNumbers.length === 0) {
    throw new ApiError("At least one page must remain in the PDF.", 400);
  }

  const copiedPages = await outputDocument.copyPages(
    pdfDocument,
    orderedPageNumbers.map((pageNumber) => pageNumber - 1),
  );
  const font = await outputDocument.embedFont(StandardFonts.Helvetica);
  const watermarkFont = await outputDocument.embedFont(StandardFonts.HelveticaBold);
  const rotatePages = new Set(
    options.rotatePages ? parsePageSelection(options.rotatePages, pageCount) : [],
  );

  copiedPages.forEach((copiedPage, outputIndex) => {
    const sourcePageNumber = orderedPageNumbers[outputIndex];
    const page = outputDocument.addPage(copiedPage);

    if (options.rotateAngle && rotatePages.has(sourcePageNumber)) {
      page.setRotation(
        degrees(normalizeAngle(page.getRotation().angle + options.rotateAngle)),
      );
    }

    if (options.text && (options.textPage ?? 1) === outputIndex + 1) {
      page.drawText(options.text, {
        x: options.textX ?? 48,
        y: options.textY ?? 72,
        size: 16,
        font,
        color: rgb(0.08, 0.1, 0.15),
        maxWidth: Math.max(page.getWidth() - 96, 120),
        lineHeight: 20,
      });
    }

    if (options.watermark) {
      drawWatermark({
        page,
        text: options.watermark,
        font: watermarkFont,
      });
    }
  });

  const bytes = await outputDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
  });

  return createPdfResponse({
    message: "PDF edited successfully.",
    files: [
      createPdfOutputFile({
        bytes,
        fileName: `${getBaseName(fileName)}-edited.pdf`,
        pageCount: orderedPageNumbers.length,
      }),
    ],
    meta: {
      originalPages: pageCount,
      outputPages: orderedPageNumbers.length,
      deletedPages: pagesToDelete.size,
      reordered: Boolean(options.pageOrder),
      watermarked: Boolean(options.watermark),
      textAdded: Boolean(options.text),
    },
  });
}

function getOrderedPageNumbers({
  pageCount,
  pageOrder,
  pagesToDelete,
}: {
  pageCount: number;
  pageOrder?: number[];
  pagesToDelete: Set<number>;
}) {
  const sourceOrder =
    pageOrder && pageOrder.length > 0
      ? validatePageOrder(pageOrder, pageCount)
      : Array.from({ length: pageCount }, (_, index) => index + 1);

  return sourceOrder.filter((pageNumber) => !pagesToDelete.has(pageNumber));
}

function validatePageOrder(pageOrder: number[], pageCount: number) {
  const uniquePageNumbers = new Set(pageOrder);

  if (uniquePageNumbers.size !== pageOrder.length) {
    throw new ApiError("Page order contains duplicate pages.", 400);
  }

  for (const pageNumber of pageOrder) {
    if (pageNumber < 1 || pageNumber > pageCount) {
      throw new ApiError(
        `Page order includes page ${pageNumber}, but this PDF has ${pageCount} pages.`,
        400,
      );
    }
  }

  return pageOrder;
}

function drawWatermark({
  page,
  text,
  font,
}: {
  page: ReturnType<PDFDocument["addPage"]>;
  text: string;
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
}) {
  const { width, height } = page.getSize();
  const size = Math.max(Math.min(width, height) / 12, 28);
  const textWidth = font.widthOfTextAtSize(text, size);

  page.drawText(text, {
    x: width / 2 - textWidth / 2,
    y: height / 2,
    size,
    font,
    color: rgb(0.15, 0.18, 0.22),
    opacity: 0.16,
    rotate: degrees(35),
  });
}

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}
