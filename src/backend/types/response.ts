export interface ErrorPayload {
  success: false;
  error: string;
  details?: unknown;
}

export interface SuccessPayload<T> {
  success: true;
  data: T;
}

export type ResponsePayload<T = unknown> = SuccessPayload<T> | ErrorPayload;
