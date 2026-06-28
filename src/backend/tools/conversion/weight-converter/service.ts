import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateWeightConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "weight-converter", payload);
}
