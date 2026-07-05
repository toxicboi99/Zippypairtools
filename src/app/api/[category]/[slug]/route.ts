import {
  calculationToolGetController,
  calculationToolPostController,
} from "@/backend/controllers/calculators/calculation.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface ToolRouteContext {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function GET(
  _request: Request,
  context: ToolRouteContext,
) {
  const { category, slug } = await context.params;
  return calculationToolGetController(category, slug);
}

export async function POST(
  request: Request,
  context: ToolRouteContext,
) {
  const { category, slug } = await context.params;
  return calculationToolPostController(request, category, slug);
}
