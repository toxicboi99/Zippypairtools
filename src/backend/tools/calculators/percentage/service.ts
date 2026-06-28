import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculatePercentageTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "percentage", payload);
}
