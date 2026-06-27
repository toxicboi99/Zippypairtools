import { handleJsonRequest } from "@/app/api/_shared";
import { summarizeText } from "@/services/ai/summarize.service";
import { summarizeRequestSchema } from "@/validators/ai.validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const demoText = `Trusted Digital Solutions Partner
Build Powerful Digital Products That Grow Your Business
We help startups, businesses, and enterprises design, develop, and scale modern websites, mobile apps, and software solutions that drive real business growth.

Why Branding is More Important Than Ever in the Digital Era
In a crowded digital marketplace, branding is what makes your business memorable. The Importance of Mobile App Development for Business Growth
Mobile apps have become a key driver of digital transformation. With users spending more time on mobile. Why Every Business Needs a Strong Website in 2026
In today's digital-first world, your website is often the first interaction customers have with your.`;

export async function GET() {
  return Response.json(await summarizeText({ text: demoText, length: "short" }));
}

export async function POST(request: Request) {
  return handleJsonRequest(request, summarizeRequestSchema, summarizeText);
}
