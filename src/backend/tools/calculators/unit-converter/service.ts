import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateUnitConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "unit-converter", payload);
}
