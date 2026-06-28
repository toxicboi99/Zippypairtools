import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateTimeConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "time-converter", payload);
}
