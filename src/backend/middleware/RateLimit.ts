import { ApiError } from "@/backend/utils/api-error";

const requests = new Map<string, { count: number; resetAt: number }>();

export function assertRateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const current = requests.get(key);

  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new ApiError("Too many requests. Please try again later.", 429);
  }

  current.count += 1;
}
