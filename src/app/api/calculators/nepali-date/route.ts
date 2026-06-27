import { handleJsonRequest } from "@/app/api/_shared";
import { convertNepaliDate } from "@/services/calculators/nepali-date.service";
import { nepaliDateRequestSchema } from "@/validators/calculator.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleJsonRequest(request, nepaliDateRequestSchema, convertNepaliDate);
}
