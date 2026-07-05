import { healthController } from "@/backend/controllers/health/health.controller";

export async function GET() {
  return healthController();
}
