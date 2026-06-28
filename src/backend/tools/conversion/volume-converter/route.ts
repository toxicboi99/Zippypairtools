import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "conversion" as const;
export const slug = "volume-converter" as const;
export const apiPath = "/api/conversion/volume-converter";

export function getVolumeConverterRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("conversion/volume-converter is not registered.");
  }

  return config;
}

export function handleVolumeConverterRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
