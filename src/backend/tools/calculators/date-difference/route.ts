import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "date-difference" as const;
export const apiPath = "/api/calculators/date-difference";

export function getDateDifferenceRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/date-difference is not registered.");
  }

  return config;
}

export function handleDateDifferenceRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
