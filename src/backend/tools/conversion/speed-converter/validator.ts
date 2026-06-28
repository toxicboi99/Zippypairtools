import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateSpeedConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "speed-converter", payload);
}
