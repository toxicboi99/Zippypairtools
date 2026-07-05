export type RequestLogEntry = {
  method: string;
  url: string;
  status?: number;
  durationMs?: number;
};

export function createRequestLogEntry(
  request: Request,
  details: Partial<RequestLogEntry> = {},
): RequestLogEntry {
  return {
    method: request.method,
    url: request.url,
    ...details,
  };
}
