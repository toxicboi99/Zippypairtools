import { getFormFiles } from "@/backend/lib/upload";
import { assertRateLimit } from "@/backend/middleware/RateLimit";
import { cleanupExpiredFileShares, createFileShare } from "@/backend/services/files/share-files.service";
import { errorResponse, successResponse, toApiError } from "@/backend/utils/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    assertRateLimit(`share-upload:${client}`, 10, 60 * 60 * 1000);
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) return errorResponse("Request must use multipart/form-data.", 415);
    const formData = await request.formData();
    const files = getFormFiles(formData);
    const origin = new URL(request.url).origin;
    const result = await createFileShare(files, origin);
    void cleanupExpiredFileShares();
    return successResponse(result, 201);
  } catch (error) {
    const apiError = toApiError(error);
    return errorResponse(apiError.message, apiError.statusCode, apiError.details);
  }
}
