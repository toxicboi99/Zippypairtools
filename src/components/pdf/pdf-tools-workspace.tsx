"use client";

import { useMemo, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileArchive,
  Loader2,
  RotateCcw,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { PDFUpload } from "@/components/pdf/pdf-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  defaultPdfToolOptions,
  getPDFToolConfig,
  type PDFToolConfig,
} from "@/constants/pdf-tools";
import {
  MAX_FILE_SIZE,
  formatBytes,
  getFileExtension,
  validateUploadFiles,
} from "@/lib/upload";
import { cn } from "@/lib/utils";
import type {
  ApiResponse,
  PDFOutputFile,
  PDFResponse,
  ProcessingState,
} from "@/types/pdf";
import {
  pageRangeSchema,
  pdfToolOptionsSchema,
  type PDFToolOptionsFormInput,
  type PDFToolOptionsInput,
} from "@/validators/pdf.validator";

interface PDFToolsWorkspaceProps {
  slug: string;
}

type ToastVariant = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export function PDFToolsWorkspace({ slug }: PDFToolsWorkspaceProps) {
  const config = getPDFToolConfig(slug);

  if (!config) {
    return null;
  }

  return <PDFToolsWorkspaceContent config={config} />;
}

function PDFToolsWorkspaceContent({ config }: { config: PDFToolConfig }) {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [result, setResult] = useState<PDFResponse | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const form = useForm<
    PDFToolOptionsFormInput,
    unknown,
    PDFToolOptionsInput
  >({
    resolver: zodResolver(pdfToolOptionsSchema),
    defaultValues: defaultPdfToolOptions,
  });
  const watchedOptions = form.watch();
  const isBusy = state === "uploading" || state === "processing";
  const canProcess = files.length >= config.minFiles && !isBusy;

  const summary = useMemo(() => {
    const totalSize = files.reduce((total, file) => total + file.size, 0);

    return {
      totalSize,
      count: files.length,
    };
  }, [files]);

  function addToast(message: Omit<ToastMessage, "id">) {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  }

  function removeToast(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function validateClientFiles(nextFiles: File[]) {
    const errors: string[] = [];

    for (const file of nextFiles) {
      const extension = getFileExtension(file.name);

      if (!config.allowedMimeTypes.includes(file.type)) {
        errors.push(`${file.name} has an unsupported content type.`);
      }

      if (!config.allowedExtensions.includes(extension)) {
        errors.push(`${file.name} has an unsupported file extension.`);
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} is larger than ${formatBytes(MAX_FILE_SIZE)}.`);
      }
    }

    return errors;
  }

  function handleAddFiles(incomingFiles: File[]) {
    const acceptedFiles = incomingFiles.filter(Boolean);
    const nextFiles =
      config.maxFiles === 1
        ? acceptedFiles.slice(0, 1)
        : [...files, ...acceptedFiles].slice(0, config.maxFiles);
    const errors = [
      ...validateClientFiles(acceptedFiles),
      ...(files.length + acceptedFiles.length > config.maxFiles
        ? [`Upload no more than ${config.maxFiles} files.`]
        : []),
    ];

    try {
      validateUploadFiles(nextFiles, {
        allowedMimeTypes: config.allowedMimeTypes,
        allowedExtensions: config.allowedExtensions,
        minFiles: 0,
        maxFiles: config.maxFiles,
      });
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      }
    }

    setValidationErrors([...new Set(errors)]);

    if (errors.length === 0) {
      setFiles(nextFiles);
      setResult(null);
      setState("idle");
      addToast({
        variant: "info",
        title: "Files ready",
        description: `${acceptedFiles.length} file${
          acceptedFiles.length === 1 ? "" : "s"
        } added.`,
      });
    }
  }

  function handleRemoveFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setResult(null);
    setState("idle");
  }

  function handleMoveFile(index: number, direction: "up" | "down") {
    setFiles((current) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const nextFiles = [...current];
      const [file] = nextFiles.splice(index, 1);
      nextFiles.splice(targetIndex, 0, file);

      return nextFiles;
    });
  }

  function resetWorkspace() {
    setFiles([]);
    setResult(null);
    setProgress(0);
    setValidationErrors([]);
    setState("idle");
    form.reset(defaultPdfToolOptions);
  }

  async function handleProcess(options: PDFToolOptionsInput) {
    setValidationErrors([]);
    form.clearErrors();

    const optionError = validateOptions(config, options);

    if (optionError) {
      form.setError(optionError.field, { message: optionError.message });
      return;
    }

    try {
      validateUploadFiles(files, {
        allowedMimeTypes: config.allowedMimeTypes,
        allowedExtensions: config.allowedExtensions,
        minFiles: config.minFiles,
        maxFiles: config.maxFiles,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload validation failed.";
      setValidationErrors([message]);
      setState("error");
      addToast({
        variant: "error",
        title: "Validation failed",
        description: message,
      });
      return;
    }

    const formData = buildFormData(config, files, options);

    setState("uploading");
    setProgress(0);
    setResult(null);

    try {
      const response = await uploadWithProgress<PDFResponse>({
        endpoint: config.endpoint,
        formData,
        onProgress: setProgress,
        onUploadComplete: () => {
          setProgress(100);
          setState("processing");
        },
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      setResult(response.data);
      setState("success");
      addToast({
        variant: "success",
        title: config.placeholder
          ? "Placeholder validated"
          : "Processing complete",
        description: response.data.message,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The PDF workflow failed.";
      setState("error");
      setValidationErrors([message]);
      addToast({
        variant: "error",
        title: "Processing failed",
        description: message,
      });
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {config.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {config.description}
              </p>
            </div>
            {config.placeholder ? (
              <span className="inline-flex w-fit items-center gap-1 rounded-md border border-chart-3/20 bg-chart-3/10 px-2.5 py-1 text-xs font-medium text-chart-3">
                <Sparkles aria-hidden="true" className="size-3" />
                Placeholder
              </span>
            ) : null}
          </div>

          <PDFUpload
            title={config.uploadTitle}
            description={config.uploadDescription}
            files={files}
            accept={config.accept}
            maxFiles={config.maxFiles}
            reorderable={config.reorderable}
            validationErrors={validationErrors}
            state={state}
            progress={progress}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onMoveFile={handleMoveFile}
          />
        </div>

        <aside className="space-y-6">
          <form onSubmit={form.handleSubmit(handleProcess)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings2 aria-hidden="true" className="size-4 text-primary" />
                  Options
                </CardTitle>
                <CardDescription>
                  {summary.count} file{summary.count === 1 ? "" : "s"} -{" "}
                  {formatBytes(summary.totalSize)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <PDFOptionFields
                  config={config}
                  options={watchedOptions}
                  form={form}
                />

                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={!canProcess} className="w-full">
                    {isBusy ? (
                      <Loader2 aria-hidden="true" className="animate-spin" />
                    ) : (
                      <FileArchive aria-hidden="true" />
                    )}
                    {isBusy ? "Working" : "Process files"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isBusy && files.length === 0}
                    onClick={resetWorkspace}
                  >
                    <RotateCcw aria-hidden="true" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          <StatusPanel state={state} progress={progress} result={result} />
        </aside>
      </div>

      {result ? <ResultsPanel result={result} /> : null}

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

function PDFOptionFields({
  config,
  options,
  form,
}: {
  config: PDFToolConfig;
  options: PDFToolOptionsFormInput;
  form: UseFormReturn<
    PDFToolOptionsFormInput,
    unknown,
    PDFToolOptionsInput
  >;
}) {
  if (config.optionKind === "none") {
    return (
      <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
        No extra options for this workflow.
      </div>
    );
  }

  if (config.optionKind === "split") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg border bg-background p-1">
          {[
            { label: "All pages", value: "all" },
            { label: "Ranges", value: "ranges" },
          ].map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={options.splitMode === item.value ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                form.setValue("splitMode", item.value as "all" | "ranges", {
                  shouldValidate: true,
                })
              }
            >
              {item.label}
            </Button>
          ))}
        </div>
        {options.splitMode === "ranges" ? (
          <FieldBlock
            label="Page ranges"
            error={form.formState.errors.splitRanges?.message}
          >
            <Input
              placeholder="1-3, 5, 8"
              {...form.register("splitRanges")}
            />
          </FieldBlock>
        ) : null}
      </div>
    );
  }

  if (config.optionKind === "compress") {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Compression level</p>
        <div className="grid grid-cols-3 gap-2 rounded-lg border bg-background p-1">
          {(["low", "medium", "high"] as const).map((level) => (
            <Button
              key={level}
              type="button"
              variant={options.compressionLevel === level ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                form.setValue("compressionLevel", level, {
                  shouldValidate: true,
                })
              }
              className="capitalize"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (config.optionKind === "remove-pages") {
    return (
      <FieldBlock
        label="Pages to remove"
        error={form.formState.errors.removePages?.message}
      >
        <Input placeholder="2, 4-6" {...form.register("removePages")} />
      </FieldBlock>
    );
  }

  return (
    <div className="space-y-4">
      <FieldBlock
        label="Pages to convert"
        error={form.formState.errors.pageRanges?.message}
      >
        <Input
          placeholder="Leave blank for all pages"
          {...form.register("pageRanges")}
        />
      </FieldBlock>
      <FieldBlock label={`JPG quality: ${options.quality}`}>
        <input
          type="range"
          min={40}
          max={95}
          step={1}
          className="w-full accent-primary"
          {...form.register("quality", { valueAsNumber: true })}
        />
      </FieldBlock>
    </div>
  );
}

function FieldBlock({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function StatusPanel({
  state,
  progress,
  result,
}: {
  state: ProcessingState;
  progress: number;
  result: PDFResponse | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Processing state</CardTitle>
        <CardDescription>{state}</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {state === "processing" ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Processing files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload complete - {progress}%
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted/70" />
              </div>
            </motion.div>
          ) : null}

          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                className="mx-auto flex size-14 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2"
              >
                <CheckCircle2 aria-hidden="true" className="size-8" />
              </motion.div>
              <p className="mt-4 text-sm font-medium text-foreground">
                {result?.message ?? "Done"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result?.files.length ?? 0} output file
                {result?.files.length === 1 ? "" : "s"}
              </p>
            </motion.div>
          ) : null}

          {state === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>Review the validation message and try again.</span>
            </motion.div>
          ) : null}

          {state === "idle" || state === "uploading" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {["Upload", "Process", "Download"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border bg-background p-3"
                >
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md text-xs font-semibold",
                      index === 0 && state === "uploading"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function ResultsPanel({ result }: { result: PDFResponse }) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Results</h2>
          <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
        </div>
        {result.files.length > 1 ? (
          <Button
            type="button"
            onClick={() => result.files.forEach(downloadFile)}
          >
            <Download aria-hidden="true" />
            Download all
          </Button>
        ) : null}
      </div>

      {result.files.length === 0 ? (
        <div className="mt-5 rounded-lg border bg-background p-5 text-sm text-muted-foreground">
          This placeholder service validated the upload and returned provider
          readiness metadata.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {result.files.map((file) => (
            <div
              key={`${file.fileName}-${file.size}`}
              className="flex items-center gap-3 rounded-lg border bg-background p-4"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border bg-card text-primary">
                <FileArchive aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.fileName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                  {file.pageCount ? ` - ${file.pageCount} pages` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Download ${file.fileName}`}
                onClick={() => downloadFile(file)}
              >
                <Download aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {result.meta ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(result.meta).map(([key, value]) => (
            <div key={key} className="rounded-lg border bg-background p-3">
              <dt className="text-xs uppercase text-muted-foreground">{key}</dt>
              <dd className="mt-1 truncate text-sm font-medium text-foreground">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12 }}
            className={cn(
              "rounded-lg border bg-card p-4 shadow-lg",
              toast.variant === "success" && "border-chart-2/30",
              toast.variant === "error" && "border-destructive/30",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function validateOptions(config: PDFToolConfig, options: PDFToolOptionsInput) {
  if (config.optionKind === "split" && options.splitMode === "ranges") {
    const parsed = pageRangeSchema.safeParse(options.splitRanges);

    if (!parsed.success) {
      return {
        field: "splitRanges" as const,
        message: "Enter ranges such as 1-3, 5.",
      };
    }
  }

  if (config.optionKind === "remove-pages") {
    const parsed = pageRangeSchema.safeParse(options.removePages);

    if (!parsed.success) {
      return {
        field: "removePages" as const,
        message: "Enter pages to remove, such as 2, 4-6.",
      };
    }
  }

  if (config.optionKind === "pdf-to-jpg" && options.pageRanges) {
    const parsed = pageRangeSchema.safeParse(options.pageRanges);

    if (!parsed.success) {
      return {
        field: "pageRanges" as const,
        message: "Enter ranges such as 1-3, 5.",
      };
    }
  }

  return null;
}

function buildFormData(
  config: PDFToolConfig,
  files: File[],
  options: PDFToolOptionsInput,
) {
  const formData = new FormData();
  const fileKey = config.maxFiles > 1 ? "files" : "file";

  for (const file of files) {
    formData.append(fileKey, file);
  }

  if (config.optionKind === "split") {
    formData.append("mode", options.splitMode);

    if (options.splitMode === "ranges" && options.splitRanges) {
      formData.append("ranges", options.splitRanges);
    }
  }

  if (config.optionKind === "compress") {
    formData.append("compressionLevel", options.compressionLevel);
  }

  if (config.optionKind === "remove-pages" && options.removePages) {
    formData.append("pages", options.removePages);
  }

  if (config.optionKind === "pdf-to-jpg") {
    if (options.pageRanges) {
      formData.append("pages", options.pageRanges);
    }

    formData.append("quality", String(options.quality));
  }

  return formData;
}

function uploadWithProgress<T>({
  endpoint,
  formData,
  onProgress,
  onUploadComplete,
}: {
  endpoint: string;
  formData: FormData;
  onProgress: (progress: number) => void;
  onUploadComplete: () => void;
}) {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", endpoint);
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.upload.onload = onUploadComplete;

    xhr.onload = () => {
      const payload = xhr.response as ApiResponse<T> | null;

      if (!payload) {
        reject(new Error("The server returned an empty response."));
        return;
      }

      resolve(payload);
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}

function downloadFile(file: PDFOutputFile) {
  const blob = base64ToBlob(file.base64, file.mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function base64ToBlob(base64: string, mimeType: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}
