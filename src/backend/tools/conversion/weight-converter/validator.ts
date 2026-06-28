import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateWeightConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "weight-converter", payload);
}
