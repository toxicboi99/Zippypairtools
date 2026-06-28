import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateVolumeConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "volume-converter", payload);
}
