import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "emi" as const;
export const apiPath = "/api/calculators/emi";

export function getEMIRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/emi is not registered.");
  }

  return config;
}

export function handleEMIRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
