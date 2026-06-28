export interface ExpandedToolValidationInput {
  category: string;
  slug: string;
  payload: unknown;
}

export function validateExpandedToolInput(
  _input: ExpandedToolValidationInput,
): void {
  // TODO: Add Zod validation for expanded tool requests.
}
