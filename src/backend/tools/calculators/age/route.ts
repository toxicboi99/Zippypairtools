import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "age" as const;
export const apiPath = "/api/calculators/age";

export function getAgeRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/age is not registered.");
  }

  return config;
}

export function handleAgeRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
