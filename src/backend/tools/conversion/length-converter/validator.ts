import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateLengthConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "length-converter", payload);
}
