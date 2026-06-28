import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateTimeConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "time-converter", payload);
}
