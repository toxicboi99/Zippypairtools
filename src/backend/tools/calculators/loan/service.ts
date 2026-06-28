import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateLoanTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "loan", payload);
}
