import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { sanitizeFileName, type FileLike } from "@/backend/lib/upload";
import { ApiError } from "@/backend/utils/api-error";
import {
  SHARE_MAX_FILE_BYTES,
  SHARE_MAX_FILES,
  SHARE_MAX_TOTAL_BYTES,
  SHARE_TTL_MS,
  shareIdSchema,
  sharedFileIdSchema,
} from "@/backend/validators/share-files.validator";

interface SharedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface ShareRecord {
  id: string;
  deleteTokenHash: string;
  createdAt: string;
  expiresAt: string;
  files: SharedFileRecord[];
}

const storageRoot = path.resolve(process.env.SHARED_FILE_STORAGE_DIR ?? path.join(process.cwd(), ".data", "shared-files"));

function recordPath(shareId: string) {
  return path.join(storageRoot, shareId, "share.json");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function readShare(shareId: string) {
  const id = shareIdSchema.parse(shareId);

  try {
    const record = JSON.parse(await readFile(recordPath(id), "utf8")) as ShareRecord;
    if (new Date(record.expiresAt).getTime() <= Date.now()) {
      await rm(path.join(storageRoot, id), { recursive: true, force: true });
      throw new ApiError("This share has expired.", 410);
    }
    return record;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Shared files were not found.", 404);
  }
}

export async function createFileShare(files: FileLike[], origin: string) {
  if (!files.length || files.length > SHARE_MAX_FILES) {
    throw new ApiError(`Select between 1 and ${SHARE_MAX_FILES} files.`, 400);
  }

  let totalBytes = 0;
  for (const file of files) {
    if (file.size <= 0) throw new ApiError(`${sanitizeFileName(file.name)} is empty.`, 400);
    if (file.size > SHARE_MAX_FILE_BYTES) throw new ApiError(`${sanitizeFileName(file.name)} exceeds the 20 MB file limit.`, 413);
    totalBytes += file.size;
  }
  if (totalBytes > SHARE_MAX_TOTAL_BYTES) throw new ApiError("The combined upload exceeds 50 MB.", 413);

  await mkdir(storageRoot, { recursive: true });
  const shareId = randomBytes(12).toString("base64url");
  const deleteToken = randomBytes(32).toString("base64url");
  const directory = path.join(storageRoot, shareId);
  await mkdir(directory, { recursive: false });

  const records: SharedFileRecord[] = [];
  try {
    for (const file of files) {
      const id = randomUUID();
      const name = sanitizeFileName(file.name);
      await writeFile(path.join(directory, id), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
      records.push({ id, name, size: file.size, type: file.type || "application/octet-stream" });
    }

    const createdAt = new Date();
    const record: ShareRecord = {
      id: shareId,
      deleteTokenHash: hashToken(deleteToken),
      createdAt: createdAt.toISOString(),
      expiresAt: new Date(createdAt.getTime() + SHARE_TTL_MS).toISOString(),
      files: records,
    };
    await writeFile(recordPath(shareId), JSON.stringify(record), { flag: "wx" });

    return { shareId, deleteToken, shareUrl: `${origin}/share/${shareId}`, expiresAt: record.expiresAt, files: records };
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw new ApiError("The files could not be stored.", 500, { cause: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function getFileShare(shareId: string) {
  const record = await readShare(shareId);
  return { shareId: record.id, createdAt: record.createdAt, expiresAt: record.expiresAt, files: record.files };
}

export async function getSharedFile(shareId: string, fileId: string) {
  const record = await readShare(shareId);
  const id = sharedFileIdSchema.parse(fileId);
  const file = record.files.find((item) => item.id === id);
  if (!file) throw new ApiError("Shared file was not found.", 404);
  return { file, data: await readFile(path.join(storageRoot, record.id, id)) };
}

export async function deleteFileShare(shareId: string, deleteToken: string) {
  const record = await readShare(shareId);
  const expected = Buffer.from(record.deleteTokenHash, "hex");
  const provided = Buffer.from(hashToken(deleteToken), "hex");
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) throw new ApiError("The delete token is invalid.", 403);
  await rm(path.join(storageRoot, record.id), { recursive: true, force: true });
}

export async function cleanupExpiredFileShares() {
  await mkdir(storageRoot, { recursive: true });
  const entries = await readdir(storageRoot, { withFileTypes: true });
  await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
    try { await readShare(entry.name); } catch (error) { if (error instanceof ApiError && error.statusCode === 410) return; }
  }));
}
