import { z } from "zod";

export const shareIdSchema = z.string().regex(/^[A-Za-z0-9_-]{16}$/, "Invalid share ID.");
export const sharedFileIdSchema = z.string().uuid("Invalid file ID.");

export const SHARE_MAX_FILES = 10;
export const SHARE_MAX_FILE_BYTES = 20 * 1024 * 1024;
export const SHARE_MAX_TOTAL_BYTES = 50 * 1024 * 1024;
export const SHARE_TTL_MS = 24 * 60 * 60 * 1000;
