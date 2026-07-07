import QRCode from "qrcode";

import { getFileShare } from "@/backend/services/files/share-files.service";
import { errorResponse, toApiError } from "@/backend/utils/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Context { params: Promise<{ shareId: string }> }

export async function GET(request: Request, { params }: Context) {
  try {
    const { shareId } = await params;
    await getFileShare(shareId);
    const url = `${new URL(request.url).origin}/share/${shareId}`;
    const svg = await QRCode.toString(url, { type: "svg", margin: 1, width: 320, errorCorrectionLevel: "M" });
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "private, max-age=300", "X-Content-Type-Options": "nosniff" } });
  } catch (error) { const apiError = toApiError(error); return errorResponse(apiError.message, apiError.statusCode); }
}
