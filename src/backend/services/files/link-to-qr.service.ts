import QRCode from "qrcode";

import type { LinkToQrInput, LinkToQrResult } from "@/backend/types/link-to-qr";

export async function generateLinkQrCode(input: LinkToQrInput): Promise<LinkToQrResult> {
  const options = {
    errorCorrectionLevel: input.errorCorrectionLevel,
    margin: 2,
    width: input.size,
    color: { dark: "#071426", light: "#ffffff" },
  } as const;

  const [pngDataUrl, svg] = await Promise.all([
    QRCode.toDataURL(input.url, { ...options, type: "image/png" }),
    QRCode.toString(input.url, { ...options, type: "svg" }),
  ]);

  return { ...input, pngDataUrl, svg };
}
