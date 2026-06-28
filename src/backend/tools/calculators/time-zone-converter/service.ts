import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateTimeZoneConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("calculators", "time-zone-converter", payload);
}
