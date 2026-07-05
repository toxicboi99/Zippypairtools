import {
  calculationToolGetController,
  calculationToolPostController,
} from "@/backend/controllers/calculators/calculation.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return calculationToolGetController("calculators", "bmi");
}

export async function POST(request: Request) {
  return calculationToolPostController(request, "calculators", "bmi");
}
