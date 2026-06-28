import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateLengthConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "length-converter", payload);
}
