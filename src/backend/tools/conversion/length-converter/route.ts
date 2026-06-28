import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "conversion" as const;
export const slug = "length-converter" as const;
export const apiPath = "/api/conversion/length-converter";

export function getLengthConverterRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("conversion/length-converter is not registered.");
  }

  return config;
}

export function handleLengthConverterRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
