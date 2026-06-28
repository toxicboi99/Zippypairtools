import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateEMIToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "emi", payload);
}
