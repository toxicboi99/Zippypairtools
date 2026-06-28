import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validatePercentageToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "percentage", payload);
}
