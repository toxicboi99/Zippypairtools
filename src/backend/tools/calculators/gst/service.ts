import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateGSTTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "gst", payload);
}
