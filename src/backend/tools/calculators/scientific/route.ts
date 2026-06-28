import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "scientific" as const;
export const apiPath = "/api/calculators/scientific";

export function getScientificRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/scientific is not registered.");
  }

  return config;
}

export function handleScientificRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
