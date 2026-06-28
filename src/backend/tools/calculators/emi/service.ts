import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateEMITool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "emi", payload);
}
