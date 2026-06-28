import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateVolumeConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "volume-converter", payload);
}
