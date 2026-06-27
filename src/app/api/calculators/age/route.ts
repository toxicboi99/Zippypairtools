import { handleJsonRequest } from "@/app/api/_shared";
import { calculateAge } from "@/services/calculators/age.service";
import { ageRequestSchema } from "@/validators/calculator.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, ageRequestSchema, calculateAge);
}
