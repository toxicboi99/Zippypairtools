import type { NextRequest } from "next/server";

import {
  summarizeGetController,
  summarizePostController,
} from "@/backend/controllers/ai/summarize.controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return summarizeGetController(request);
}

export async function POST(request: NextRequest) {
  return summarizePostController(request);
}
