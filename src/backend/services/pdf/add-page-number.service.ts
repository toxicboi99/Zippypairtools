import { StandardFonts, rgb } from "pdf-lib";

import type { FileLike } from "@/backend/lib/upload";
import type { PDFPageNumberOptions, PDFResponse } from "@/backend/types/pdf";
import {
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
  parsePageSelection,
} from "./pdf-utils";

const PAGE_MARGIN = 28;

export async function addPDFPageNumbers(
  file: FileLike,
  options: PDFPageNumberOptions,
): Promise<PDFResponse> {
  const { fileName, pdfDocument, pageCount } = await loadPdfFile(file);
  const selectedPages = options.pages
    ? parsePageSelection(options.pages, pageCount)
    : Array.from({ length: pageCount }, (_, index) => index + 1);
  const selectedSet = new Set(selectedPages);
  const font = await pdfDocument.embedFont(StandardFonts.Helvetica);
  const color = parseHexColor(options.fontColor);
  let visibleNumber = options.startNumber;

  pdfDocument.getPages().forEach((page, pageIndex) => {
    const pageNumber = pageIndex + 1;

    if (!selectedSet.has(pageNumber)) {
      return;
    }

    const label = String(visibleNumber);
    const textWidth = font.widthOfTextAtSize(label, options.fontSize);
    const { width, height } = page.getSize();
    const coordinates = getCoordinates({
      position: options.position,
      textWidth,
      pageWidth: width,
      pageHeight: height,
      fontSize: options.fontSize,
    });

    page.drawText(label, {
      x: coordinates.x,
      y: coordinates.y,
      size: options.fontSize,
      font,
      color,
    });

    visibleNumber += 1;
  });

  const bytes = await pdfDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
  });

  return createPdfResponse({
    message: "Page numbers added successfully.",
    files: [
      createPdfOutputFile({
        bytes,
        fileName: `${getBaseName(fileName)}-numbered.pdf`,
        pageCount,
      }),
    ],
    meta: {
      inputPages: pageCount,
      numberedPages: selectedPages.length,
      startNumber: options.startNumber,
      position: options.position,
    },
  });
}

function parseHexColor(color: string) {
  const normalized = color.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return rgb(red / 255, green / 255, blue / 255);
}

function getCoordinates({
  position,
  textWidth,
  pageWidth,
  pageHeight,
  fontSize,
}: {
  position: PDFPageNumberOptions["position"];
  textWidth: number;
  pageWidth: number;
  pageHeight: number;
  fontSize: number;
}) {
  const isTop = position.startsWith("top");
  const y = isTop ? pageHeight - PAGE_MARGIN - fontSize : PAGE_MARGIN;

  if (position.endsWith("left")) {
    return { x: PAGE_MARGIN, y };
  }

  if (position.endsWith("right")) {
    return { x: pageWidth - PAGE_MARGIN - textWidth, y };
  }

  return { x: (pageWidth - textWidth) / 2, y };
}
