import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "loan" as const;
export const apiPath = "/api/calculators/loan";

export function getLoanRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/loan is not registered.");
  }

  return config;
}

export function handleLoanRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
