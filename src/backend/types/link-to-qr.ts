export const qrErrorCorrectionLevels = ["L", "M", "Q", "H"] as const;

export type QrErrorCorrectionLevel = (typeof qrErrorCorrectionLevels)[number];

export interface LinkToQrInput {
  url: string;
  size: number;
  errorCorrectionLevel: QrErrorCorrectionLevel;
}

export interface LinkToQrResult extends LinkToQrInput {
  pngDataUrl: string;
  svg: string;
}
