import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateNepaliDateTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "nepali-date", payload);
}
