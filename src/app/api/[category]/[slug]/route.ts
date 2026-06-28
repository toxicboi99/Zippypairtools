import {
  handleCalculationToolGet,
  handleCalculationToolPost,
} from "@/app/api/_calculation-route";

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
  return handleCalculationToolGet(category, slug);
}

export async function POST(
  request: Request,
  context: ToolRouteContext,
) {
  const { category, slug } = await context.params;
  return handleCalculationToolPost(request, category, slug);
}
