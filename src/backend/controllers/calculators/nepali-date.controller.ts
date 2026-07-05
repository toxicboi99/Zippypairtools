import { handleJsonRequest } from "@/backend/utils/json-request";
import { convertNepaliDate } from "@/backend/services/calculators/nepali-date.service";
import { nepaliDateRequestSchema } from "@/backend/validators/calculator.validator";

export function nepaliDateCalculatorController(request: Request) {
  return handleJsonRequest(
    request,
    nepaliDateRequestSchema,
    convertNepaliDate,
  );
}
