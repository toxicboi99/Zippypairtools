import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateFileSizeConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "file-size-converter", payload);
}
