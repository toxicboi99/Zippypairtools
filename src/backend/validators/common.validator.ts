import { z } from "zod";

export const nonEmptyTextSchema = z
  .string()
  .trim()
  .min(1, "Text is required.")
  .max(20000, "Text must be 20,000 characters or fewer.");

export const optionalNonEmptyTextSchema = z
  .string()
  .trim()
  .min(1)
  .max(20000)
  .optional();

export const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD format.");
