export interface ExpandedToolServiceInput {
  category: string;
  slug: string;
  payload: unknown;
}

export interface ExpandedToolServiceResult {
  id: string;
  status: "pending" | "processing" | "complete" | "failed";
  output?: unknown;
}

export function createExpandedToolJob(_input: ExpandedToolServiceInput): void {
  // TODO: Create backend job for the selected tool.
}

export function getExpandedToolJob(_id: string): void {
  // TODO: Read backend job state for the selected tool.
}

export function cancelExpandedToolJob(_id: string): void {
  // TODO: Cancel backend job for the selected tool.
}
