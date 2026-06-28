import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "fuel-cost" as const;
export const apiPath = "/api/calculators/fuel-cost";

export function getFuelCostRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/fuel-cost is not registered.");
  }

  return config;
}

export function handleFuelCostRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
