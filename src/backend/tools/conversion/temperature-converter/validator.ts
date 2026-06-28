import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateTemperatureConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "temperature-converter", payload);
}
