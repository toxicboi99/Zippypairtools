export interface ExpandedToolApiParams {
  category: string;
  slug: string;
}

export interface ExpandedToolApiRequest {
  params: ExpandedToolApiParams;
  body?: unknown;
}

export interface ExpandedToolApiResponse {
  id?: string;
  status: "pending" | "processing" | "complete" | "failed";
  message?: string;
  data?: unknown;
}
