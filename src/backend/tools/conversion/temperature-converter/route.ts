import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "conversion" as const;
export const slug = "temperature-converter" as const;
export const apiPath = "/api/conversion/temperature-converter";

export function getTemperatureConverterRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("conversion/temperature-converter is not registered.");
  }

  return config;
}

export function handleTemperatureConverterRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
