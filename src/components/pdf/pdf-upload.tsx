"use client";

import type {
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  KeyboardEvent,
} from "react";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  Paperclip,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/upload";
import { cn } from "@/lib/utils";
import type { ProcessingState } from "@/types/pdf";

interface PDFUploadProps {
  title: string;
  description: string;
  files: File[];
  accept: string;
  maxFiles: number;
  reorderable?: boolean;
  validationErrors: string[];
  state: ProcessingState;
  progress: number;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onMoveFile: (index: number, direction: "up" | "down") => void;
}

export function PDFUpload({
  title,
  description,
  files,
  accept,
  maxFiles,
  reorderable,
  validationErrors,
  state,
  progress,
  onAddFiles,
  onRemoveFile,
  onMoveFile,
}: PDFUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isBusy = state === "uploading" || state === "processing";

  function openPicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onAddFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (!isBusy) {
      onAddFiles(Array.from(event.dataTransfer.files));
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pastedFiles = Array.from(event.clipboardData.files);

    if (pastedFiles.length > 0 && !isBusy) {
      onAddFiles(pastedFiles);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  return (
    <div className="space-y-5">
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background p-6 text-center transition",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-accent/40",
          isBusy && "pointer-events-none opacity-70",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={handleInputChange}
          className="sr-only"
        />
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex size-14 items-center justify-center rounded-lg border bg-card text-primary"
        >
          <Upload aria-hidden="true" className="size-7" />
        </motion.div>
        <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md border bg-card px-2.5 py-1">
            Click to upload
          </span>
          <span className="rounded-md border bg-card px-2.5 py-1">
            Drag and drop
          </span>
          <span className="rounded-md border bg-card px-2.5 py-1">
            Paste from clipboard
          </span>
        </div>
      </div>

      {state === "uploading" ? (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">Uploading</span>
            <span className="font-mono text-muted-foreground">{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      {validationErrors.length > 0 ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {validationErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground">
            Files ({files.length}/{maxFiles})
          </h4>
          {reorderable && files.length > 1 ? (
            <span className="text-xs text-muted-foreground">
              Use arrows to reorder
            </span>
          ) : null}
        </div>

        {files.length === 0 ? (
          <div className="rounded-lg border bg-card p-4">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="mt-3 h-3 w-48 rounded bg-muted/70" />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${file.lastModified}-${index}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[auto_1fr_auto]"
              >
                <div className="flex items-center gap-3">
                  {reorderable ? (
                    <GripVertical
                      aria-hidden="true"
                      className="hidden size-4 text-muted-foreground sm:block"
                    />
                  ) : null}
                  <span className="flex size-10 items-center justify-center rounded-lg border bg-background text-primary">
                    {file.type.startsWith("image/") ? (
                      <Paperclip aria-hidden="true" className="size-5" />
                    ) : (
                      <FileText aria-hidden="true" className="size-5" />
                    )}
                  </span>
                </div>

                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBytes(file.size)} - {file.type || "Unknown type"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {reorderable && files.length > 1 ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={index === 0 || isBusy}
                        onClick={() => onMoveFile(index, "up")}
                        aria-label={`Move ${file.name} up`}
                      >
                        <ArrowUp aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={index === files.length - 1 || isBusy}
                        onClick={() => onMoveFile(index, "down")}
                        aria-label={`Move ${file.name} down`}
                      >
                        <ArrowDown aria-hidden="true" />
                      </Button>
                    </>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isBusy}
                    onClick={() => onRemoveFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
