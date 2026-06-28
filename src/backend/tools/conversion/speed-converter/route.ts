import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "conversion" as const;
export const slug = "speed-converter" as const;
export const apiPath = "/api/conversion/speed-converter";

export function getSpeedConverterRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("conversion/speed-converter is not registered.");
  }

  return config;
}

export function handleSpeedConverterRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
