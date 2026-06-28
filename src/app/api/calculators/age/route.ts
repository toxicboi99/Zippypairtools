import {
  handleCalculationToolGet,
  handleCalculationToolPost,
} from "@/app/api/_calculation-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handleCalculationToolGet("calculators", "age");
}

export async function POST(request: Request) {
  return handleCalculationToolPost(request, "calculators", "age");
}
