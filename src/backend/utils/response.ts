import { NextResponse } from "next/server";

import type { ApiResponse } from "@/backend/types/pdf";
import { ApiError } from "@/backend/utils/api-error";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function errorResponse(
  error: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError("Something went wrong. Please try again.", 500);
}

export { ApiError };
