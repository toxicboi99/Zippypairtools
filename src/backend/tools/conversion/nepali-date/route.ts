import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "conversion" as const;
export const slug = "nepali-date" as const;
export const apiPath = "/api/conversion/nepali-date";

export function getNepaliDateRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("conversion/nepali-date is not registered.");
  }

  return config;
}

export function handleNepaliDateRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
