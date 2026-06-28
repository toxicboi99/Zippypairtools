import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateUnitConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "unit-converter", payload);
}
