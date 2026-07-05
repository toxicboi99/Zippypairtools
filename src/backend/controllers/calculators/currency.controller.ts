import { handleJsonRequest } from "@/backend/utils/json-request";
import { convertCurrency } from "@/backend/services/calculators/currency.service";
import { currencyRequestSchema } from "@/backend/validators/calculator.validator";

export function currencyCalculatorController(request: Request) {
  return handleJsonRequest(request, currencyRequestSchema, convertCurrency);
}
