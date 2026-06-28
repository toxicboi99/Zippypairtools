import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "conversion" as const;
export const slug = "file-size-converter" as const;
export const apiPath = "/api/conversion/file-size-converter";

export function getFileSizeConverterRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("conversion/file-size-converter is not registered.");
  }

  return config;
}

export function handleFileSizeConverterRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
