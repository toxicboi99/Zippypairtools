import { ApiError } from "@/backend/utils/api-error";

export function requireAuthorizationHeader(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new ApiError("Authorization header is required.", 401);
  }

  return authorization;
}
