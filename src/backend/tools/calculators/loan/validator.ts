import { validateCalculationToolPayload } from "@/backend/tools/calculation-tools";

export function validateLoanToolPayload(payload: unknown) {
  return validateCalculationToolPayload("calculators", "loan", payload);
}
