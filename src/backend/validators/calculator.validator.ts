import { z } from "zod";

import { isoDateSchema } from "@/backend/validators/common.validator";

export const ageRequestSchema = z.object({
  dateOfBirth: isoDateSchema,
  asOf: isoDateSchema.optional(),
});

export const bmiRequestSchema = z.object({
  weightKg: z.coerce.number().positive().max(700),
  heightCm: z.coerce.number().positive().max(300),
});

export const percentageRequestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("percentageOf"),
    percentage: z.coerce.number(),
    value: z.coerce.number(),
  }),
  z.object({
    mode: z.literal("whatPercent"),
    part: z.coerce.number(),
    total: z.coerce.number().refine((value) => value !== 0, {
      message: "Total cannot be zero.",
    }),
  }),
  z.object({
    mode: z.literal("percentageChange"),
    from: z.coerce.number().refine((value) => value !== 0, {
      message: "Original value cannot be zero.",
    }),
    to: z.coerce.number(),
  }),
]);

export const currencyRequestSchema = z.object({
  amount: z.coerce.number().finite(),
  from: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  to: z.string().trim().length(3).transform((value) => value.toUpperCase()),
});

export const nepaliDateRequestSchema = z.object({
  date: isoDateSchema,
  direction: z.enum(["ad-to-bs", "bs-to-ad"]).default("ad-to-bs"),
});

export type AgeRequest = z.infer<typeof ageRequestSchema>;
export type BMIRequest = z.infer<typeof bmiRequestSchema>;
export type PercentageRequest = z.infer<typeof percentageRequestSchema>;
export type CurrencyRequest = z.infer<typeof currencyRequestSchema>;
export type NepaliDateRequest = z.infer<typeof nepaliDateRequestSchema>;
