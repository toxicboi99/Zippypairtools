import { handleJsonRequest } from "@/app/api/_shared";
import { calculatePercentage } from "@/services/calculators/percentage.service";
import { percentageRequestSchema } from "@/validators/calculator.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, percentageRequestSchema, calculatePercentage);
}
