import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "gst" as const;
export const apiPath = "/api/calculators/gst";

export function getGSTRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/gst is not registered.");
  }

  return config;
}

export function handleGSTRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
