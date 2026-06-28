import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateFileSizeConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "file-size-converter", payload);
}
