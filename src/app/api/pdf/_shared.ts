import { ZodError } from "zod";

import {
  MAX_FILE_SIZE,
  MAX_FILES,
  assertMultipartRequest,
} from "@/lib/upload";
import { ApiError } from "@/utils/api-error";
import { errorResponse, successResponse, toApiError } from "@/utils/response";

const MAX_REQUEST_SIZE = MAX_FILE_SIZE * MAX_FILES + 1024 * 1024;

export async function handlePDFRequest<T>(
  request: Request,
  handler: (formData: FormData) => Promise<T>,
) {
  try {
    assertMultipartRequest(request);
    validateContentLength(request);

    const formData = await request.formData();
    const data = await handler(formData);

    return successResponse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        "Validation failed.",
        400,
        error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      );
    }

    const apiError = toApiError(error);

    return errorResponse(apiError.message, apiError.statusCode, apiError.details);
  }
}

function validateContentLength(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_REQUEST_SIZE) {
    throw new ApiError(
      `Request is too large. Upload no more than ${MAX_FILES} files at 10 MB each.`,
      413,
    );
  }
}
