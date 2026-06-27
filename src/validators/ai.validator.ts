import { z } from "zod";

import { nonEmptyTextSchema } from "@/validators/common.validator";

export const summarizeRequestSchema = z.object({
  text: nonEmptyTextSchema,
  length: z.enum(["short", "medium", "long"]).default("medium"),
});

export const paraphraseRequestSchema = z.object({
  text: nonEmptyTextSchema,
  tone: z
    .enum(["standard", "formal", "casual", "friendly", "professional"])
    .default("standard"),
});

export const translateRequestSchema = z.object({
  text: nonEmptyTextSchema,
  targetLanguage: z.string().trim().min(2).max(80),
  sourceLanguage: z.string().trim().min(2).max(80).optional(),
});

export const grammarRequestSchema = z.object({
  text: nonEmptyTextSchema,
  dialect: z.enum(["american", "british", "australian", "canadian"]).default(
    "american",
  ),
});

export const plagiarismRequestSchema = z.object({
  text: nonEmptyTextSchema,
});

export const textToSpeechRequestSchema = z.object({
  text: nonEmptyTextSchema.max(5000, "Text must be 5,000 characters or fewer."),
  voice: z.string().trim().min(1).max(80).default("default"),
});

export type SummarizeRequest = z.infer<typeof summarizeRequestSchema>;
export type ParaphraseRequest = z.infer<typeof paraphraseRequestSchema>;
export type TranslateRequest = z.infer<typeof translateRequestSchema>;
export type GrammarRequest = z.infer<typeof grammarRequestSchema>;
export type PlagiarismRequest = z.infer<typeof plagiarismRequestSchema>;
export type TextToSpeechRequest = z.infer<typeof textToSpeechRequestSchema>;
