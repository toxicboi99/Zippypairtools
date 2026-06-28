import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateGSTToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "gst", payload);
}
