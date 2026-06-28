import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateUnitConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "unit-converter", payload);
}
