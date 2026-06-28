import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateAgeTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "age", payload);
}
