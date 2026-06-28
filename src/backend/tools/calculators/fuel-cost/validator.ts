import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateFuelCostToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "fuel-cost", payload);
}
