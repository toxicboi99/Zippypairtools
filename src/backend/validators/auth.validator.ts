import { z } from "zod";

export const emailSchema = z.string().trim().email();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.");
