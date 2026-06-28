import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateBMIToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "bmi", payload);
}
