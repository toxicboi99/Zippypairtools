import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateCurrencyConverterToolPayload(payload: unknown) {
  return validateCalculationToolPayload("conversion", "currency-converter", payload);
}
