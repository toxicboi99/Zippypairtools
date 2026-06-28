import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "percentage" as const;
export const apiPath = "/api/calculators/percentage";

export function getPercentageRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/percentage is not registered.");
  }

  return config;
}

export function handlePercentageRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
