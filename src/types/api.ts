export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: string;
  details?: unknown;
};

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiFailure;
