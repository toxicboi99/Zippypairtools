import { nepaliDateCalculatorController } from "@/backend/controllers/calculators/nepali-date.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return nepaliDateCalculatorController(request);
}
