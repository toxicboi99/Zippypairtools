import { deleteFileShare, getFileShare } from "@/backend/services/files/share-files.service";
import { assertRateLimit } from "@/backend/middleware/RateLimit";
import { errorResponse, successResponse, toApiError } from "@/backend/utils/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Context { params: Promise<{ shareId: string }> }

export async function GET(request: Request, { params }: Context) {
  try {
    const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    assertRateLimit(`share-info:${client}`, 120, 60 * 1000);
    return successResponse(await getFileShare((await params).shareId));
  }
  catch (error) { const apiError = toApiError(error); return errorResponse(apiError.message, apiError.statusCode); }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    if (!authorization.startsWith("Bearer ")) return errorResponse("A delete token is required.", 401);
    await deleteFileShare((await params).shareId, authorization.slice(7));
    return successResponse({ deleted: true });
  } catch (error) { const apiError = toApiError(error); return errorResponse(apiError.message, apiError.statusCode); }
}
