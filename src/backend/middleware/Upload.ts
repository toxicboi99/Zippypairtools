import { assertMultipartRequest } from "@/backend/lib/upload";

export function requireMultipartUpload(request: Request) {
  assertMultipartRequest(request);
}
