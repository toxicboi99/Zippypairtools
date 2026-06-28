import { runCalculationTool } from "@/backend/tools/calculation-tools";
import type { ToolResult } from "@/backend/tools/calculation-tools";

export function calculateCurrencyConverterTool(payload: unknown): ToolResult {
  return runCalculationTool("conversion", "currency-converter", payload);
}
