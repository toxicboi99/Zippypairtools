import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateDateDifferenceTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "date-difference", payload);
}
