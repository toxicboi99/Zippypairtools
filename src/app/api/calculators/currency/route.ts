import { currencyCalculatorController } from "@/backend/controllers/calculators/currency.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return currencyCalculatorController(request);
}
