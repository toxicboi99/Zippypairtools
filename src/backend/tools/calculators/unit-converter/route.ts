import { getCalculationToolConfig, runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolConfig, ToolResult } from "@/backend/tools/calculation-tools";

export const category = "calculators" as const;
export const slug = "unit-converter" as const;
export const apiPath = "/api/calculators/unit-converter";

export function getUnitConverterRouteConfig(): ToolConfig {
  const config = getCalculationToolConfig(category, slug);

  if (!config) {
    throw new Error("calculators/unit-converter is not registered.");
  }

  return config;
}

export function handleUnitConverterRoutePayload(payload: unknown): ToolResult {
  return runCalculationTool(category, slug, payload);
}
