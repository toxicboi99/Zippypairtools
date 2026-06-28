import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateTimeZoneConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "time-zone-converter", payload);
}
