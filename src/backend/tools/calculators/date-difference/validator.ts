import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateDateDifferenceToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "date-difference", payload);
}
