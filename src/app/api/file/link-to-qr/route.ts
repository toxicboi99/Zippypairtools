import { assertRateLimit } from "@/backend/middleware/RateLimit";
import { generateLinkQrCode } from "@/backend/services/files/link-to-qr.service";
import { handleJsonRequest } from "@/backend/utils/json-request";
import { linkToQrSchema } from "@/backend/validators/link-to-qr.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return handleJsonRequest(request, linkToQrSchema, (payload) => {
    assertRateLimit(`link-to-qr:${client}`, 120, 60 * 1000);
    return generateLinkQrCode(payload);
  });
}
