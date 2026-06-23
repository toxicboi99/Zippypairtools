import type { FileLike } from "@/lib/upload";
import type { CompressionLevel, PDFResponse } from "@/types/pdf";
import {
  createPdfOutputFile,
  createPdfResponse,
  getBaseName,
  loadPdfFile,
} from "./pdf-utils";

const compressionTicks: Record<CompressionLevel, number> = {
  low: 100,
  medium: 50,
  high: 25,
};

export async function compressPDF(
  file: FileLike,
  compressionLevel: CompressionLevel = "medium",
): Promise<PDFResponse> {
  const { fileName, buffer, pdfDocument, pageCount } = await loadPdfFile(file);

  pdfDocument.setCreator("ZippyPair Tools");
  pdfDocument.setProducer("ZippyPair Tools PDF optimizer");

  const bytes = await pdfDocument.save({
    addDefaultPage: false,
    objectsPerTick: compressionTicks[compressionLevel],
    updateFieldAppearances: false,
    useObjectStreams: true,
  });
  const outputBuffer = Buffer.from(bytes);
  const savedBytes = Math.max(buffer.byteLength - outputBuffer.byteLength, 0);
  const reductionPercent =
    buffer.byteLength > 0
      ? Number(((savedBytes / buffer.byteLength) * 100).toFixed(2))
      : 0;

  return createPdfResponse({
    message: "PDF compressed successfully.",
    files: [
      createPdfOutputFile({
        bytes: outputBuffer,
        fileName: `${getBaseName(fileName)}-compressed.pdf`,
        pageCount,
      }),
    ],
    meta: {
      originalSize: buffer.byteLength,
      compressedSize: outputBuffer.byteLength,
      reductionPercent,
      compressionLevel,
    },
  });
}
