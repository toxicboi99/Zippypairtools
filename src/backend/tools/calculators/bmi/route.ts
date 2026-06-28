import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "bmi" as const;
export const apiPath = "/api/calculators/bmi";

export function getBMIRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/bmi is not registered.");
  }

  return config;
}

export function handleBMIRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
