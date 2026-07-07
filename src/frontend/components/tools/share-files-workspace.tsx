"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  FileUp,
  Link2,
  Loader2,
  QrCode,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

interface UploadResult {
  shareId: string;
  shareUrl: string;
  deleteToken: string;
  expiresAt: string;
}

interface ApiResult {
  success: boolean;
  data?: UploadResult;
  error?: string;
}

export function ShareFilesWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function addFiles(incoming: FileList | File[]) {
    const unique = new Map(files.map((file) => [`${file.name}:${file.size}`, file]));
    Array.from(incoming).forEach((file) => unique.set(`${file.name}:${file.size}`, file));
    const nextFiles = Array.from(unique.values()).slice(0, MAX_FILES);
    const total = nextFiles.reduce((sum, file) => sum + file.size, 0);

    if (total > MAX_TOTAL_BYTES) {
      setError("The combined upload must be 50 MB or smaller.");
      return;
    }

    setError("");
    setResult(null);
    setFiles(nextFiles);
  }

  function upload() {
    if (!files.length) return;

    setUploading(true);
    setProgress(0);
    setError("");

    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    const request = new XMLHttpRequest();

    request.open("POST", "/api/share-files");
    request.responseType = "json";
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      const response = request.response as ApiResult | null;
      if (request.status >= 200 && request.status < 300 && response?.data) {
        setResult(response.data);
        window.localStorage.setItem(`zippypair-share:${response.data.shareId}`, response.data.deleteToken);
        setProgress(100);
      } else {
        setError(response?.error ?? "The files could not be uploaded.");
      }
      setUploading(false);
    });
    request.addEventListener("error", () => {
      setError("The upload was interrupted. Check your connection and try again.");
      setUploading(false);
    });
    request.send(body);
  }

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function deleteShare() {
    if (!result) return;
    const response = await fetch(`/api/share-files/${result.shareId}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${result.deleteToken}` },
    });

    if (!response.ok) {
      setError("The shared files could not be deleted.");
      return;
    }

    window.localStorage.removeItem(`zippypair-share:${result.shareId}`);
    setResult(null);
    setFiles([]);
    setProgress(0);
  }

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-foreground">Share files</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Add up to 10 files (50 MB total). Shared files expire automatically after 24 hours.
        </p>

        {!result ? (
          <>
            <div
              className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed bg-background p-6 text-center focus-within:border-ring"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
            >
              <FileUp aria-hidden="true" className="size-10 text-primary" />
              <p className="mt-4 font-medium text-foreground">Drag and drop files here</p>
              <p className="mt-1 text-sm text-muted-foreground">or choose files from your device</p>
              <Button type="button" variant="outline" className="mt-4" onClick={() => inputRef.current?.click()}>
                Choose files
              </Button>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => event.target.files && addFiles(event.target.files)}
              />
            </div>

            {files.length ? (
              <ul className="mt-5 space-y-2" aria-label="Files selected for upload">
                {files.map((file) => (
                  <li key={`${file.name}:${file.size}`} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                    <span className="min-w-0 truncate text-foreground">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => setFiles((current) => current.filter((item) => item !== file))}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}

            {uploading ? (
              <div className="mt-5" aria-live="polite">
                <div className="mb-2 flex justify-between text-sm"><span>Uploading</span><span>{progress}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
              </div>
            ) : null}

            <Button type="button" className="mt-5 w-full sm:w-auto" disabled={!files.length || uploading} onClick={upload}>
              {uploading ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Link2 aria-hidden="true" />}
              Create share link
            </Button>
          </>
        ) : (
          <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_12rem]">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-chart-2"><Check aria-hidden="true" />Files are ready to share</div>
              <label htmlFor="share-link" className="mt-4 block text-sm font-medium">Shareable link</label>
              <div className="mt-2 flex gap-2">
                <Input id="share-link" readOnly value={result.shareUrl} />
                <Button type="button" size="icon" aria-label="Copy share link" onClick={copyLink}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Expires {new Date(result.expiresAt).toLocaleString()}.</p>
              <Button type="button" variant="outline" className="mt-5" onClick={deleteShare}><Trash2 aria-hidden="true" />Delete shared files</Button>
            </div>
            <div className="rounded-lg border bg-background p-4 text-center">
              <QrCode aria-hidden="true" className="mx-auto mb-2 size-5 text-muted-foreground" />
              <Image src={`/api/share-files/${result.shareId}/qr`} alt="QR code for the share link" width={160} height={160} unoptimized className="mx-auto size-40" />
            </div>
          </div>
        )}

        {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
