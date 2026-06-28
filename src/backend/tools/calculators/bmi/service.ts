import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateBMITool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "bmi", payload);
}
