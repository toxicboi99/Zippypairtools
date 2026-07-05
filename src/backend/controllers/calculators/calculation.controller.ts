import { NextResponse } from "next/server";

import {
  getCalculationToolConfig,
  runCalculationTool,
} from "@/backend/tools/calculation-tools";
import {
  errorResponse,
  successResponse,
  toApiError,
} from "@/backend/utils/response";

export function calculationToolGetController(category: string, slug: string) {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    return NextResponse.json(
      {
        success: false,
        error: "Tool not found.",
      },
      { status: 404 },
    );
  }

  return successResponse(config);
}

export async function calculationToolPostController(
  request: Request,
  category: string,
  slug: string,
) {
  try {
    const payload = await readJson(request);
    const data = runCalculationTool(category, slug, payload);

    return successResponse(data);
  } catch (error) {
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
    return {};
  }
}
