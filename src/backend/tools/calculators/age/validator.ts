import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateAgeToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "age", payload);
}
