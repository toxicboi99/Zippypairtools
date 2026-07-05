import { z, ZodError } from "zod";

import { ApiError } from "@/backend/utils/api-error";
import {
  errorResponse,
  successResponse,
  toApiError,
} from "@/backend/utils/response";

export async function handleJsonRequest<TSchema extends z.ZodTypeAny, TOutput>(
  request: Request,
  schema: TSchema,
  handler: (payload: z.output<TSchema>) => Promise<TOutput> | TOutput,
) {
  try {
    const payload = schema.parse(await readJson(request));
    const data = await handler(payload);

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

async function readJson(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return {};
  }

  try {
    return await request.json();
  } catch {
    throw new ApiError("Request body must be valid JSON.", 400);
  }
}
