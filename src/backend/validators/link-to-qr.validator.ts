import { z } from "zod";

import { qrErrorCorrectionLevels } from "@/backend/types/link-to-qr";

function normalizePublicUrl(value: string) {
  const trimmed = value.trim();
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname || url.username || url.password) return null;
    url.hash = url.hash.slice(0, 513);
    return url.toString();
  } catch {
    return null;
  }
}

export const linkToQrSchema = z.object({
  url: z.string().trim().min(1, "Enter a URL.").max(2048, "URL must be 2,048 characters or fewer.").transform(normalizePublicUrl).refine((value): value is string => value !== null, "Enter a valid HTTP or HTTPS URL without embedded credentials."),
  size: z.number().int().min(128).max(1024).default(320),
  errorCorrectionLevel: z.enum(qrErrorCorrectionLevels).default("M"),
});
