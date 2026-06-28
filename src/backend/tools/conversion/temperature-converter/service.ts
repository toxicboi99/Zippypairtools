import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateTemperatureConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "temperature-converter", payload);
}
