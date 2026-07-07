import { getSharedFile } from "@/backend/services/files/share-files.service";
import { errorResponse, toApiError } from "@/backend/utils/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Context { params: Promise<{ shareId: string; fileId: string }> }

export async function GET(_request: Request, { params }: Context) {
  try {
    const { shareId, fileId } = await params;
    const { file, data } = await getSharedFile(shareId, fileId);
    const encodedName = encodeURIComponent(file.name);
    return new Response(data, { headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="download"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    } });
  } catch (error) { const apiError = toApiError(error); return errorResponse(apiError.message, apiError.statusCode); }
}
