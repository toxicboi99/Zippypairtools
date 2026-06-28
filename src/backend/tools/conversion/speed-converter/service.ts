import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateSpeedConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "speed-converter", payload);
}
