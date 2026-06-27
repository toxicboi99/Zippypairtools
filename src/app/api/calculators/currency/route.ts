import { handleJsonRequest } from "@/app/api/_shared";
import { convertCurrency } from "@/services/calculators/currency.service";
import { currencyRequestSchema } from "@/validators/calculator.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, currencyRequestSchema, convertCurrency);
}
