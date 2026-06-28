import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateScientificTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "scientific", payload);
}
