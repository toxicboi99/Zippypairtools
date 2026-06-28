import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateFuelCostTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "fuel-cost", payload);
}
