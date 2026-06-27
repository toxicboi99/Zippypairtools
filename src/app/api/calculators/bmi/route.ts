import { handleJsonRequest } from "@/app/api/_shared";
import { calculateBMI } from "@/services/calculators/bmi.service";
import { bmiRequestSchema } from "@/validators/calculator.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, bmiRequestSchema, calculateBMI);
}
