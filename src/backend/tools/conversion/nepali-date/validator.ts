import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateNepaliDateToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "nepali-date", payload);
}
