import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateScientificToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "scientific", payload);
}
