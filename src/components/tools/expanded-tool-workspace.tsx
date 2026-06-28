"use client";

import Link from "next/link";
import {
  Clipboard,
  Copy,
  Download,
  FileArchive,
  FileText,
  ImageIcon,
  Loader2,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ExpandedTool } from "@/data/expanded-tools";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/upload";

interface ExpandedToolWorkspaceProps {
  tool: ExpandedTool;
  relatedTools: ExpandedTool[];
}

interface HistoryItem {
  id: string;
  label: string;
  detail: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

interface CalculationField {
  name: string;
  label: string;
  type: "number" | "text" | "date" | "datetime-local" | "select";
  placeholder?: string;
  step?: string;
  options?: Array<{ label: string; value: string }>;
}

interface CalculationConfig {
  title: string;
  fields: CalculationField[];
}

interface CalculationResult {
  title: string;
  value: string;
  unit?: string;
  details?: Record<string, string | number | boolean>;
}

type ToolSetting =
  | { label: string; kind: "select"; options: string[] }
  | { label: string; kind: "range"; min: number; max: number; value: number }
  | { label: string; kind: "checkbox" }
  | { label: string; kind: "text"; placeholder?: string; value?: string };

export function ExpandedToolWorkspace({
  tool,
  relatedTools,
}: ExpandedToolWorkspaceProps) {
  if (tool.mode === "calculator" || tool.mode === "converter") {
    return <CalculationWorkspace tool={tool} />;
  }

  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [url, setUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useObjectUrl(files[0]);
  const Icon = getModeIcon(tool.mode);
  const stats = useMemo(() => getInputStats(tool, files, text, url), [
    files,
    text,
    tool,
    url,
  ]);
  const computedPreview = useMemo(
    () => getPreviewOutput(tool, text, secondaryText, url, files),
    [files, secondaryText, text, tool, url],
  );
  const canRun =
    files.length > 0 ||
    text.trim().length > 0 ||
    secondaryText.trim().length > 0 ||
    url.trim().length > 0 ||
    tool.slug.includes("generator");

  function addFiles(nextFiles: File[]) {
    if (nextFiles.length === 0) return;
    setFiles((current) =>
      tool.slug.includes("merge") || tool.slug.includes("zip")
        ? [...current, ...nextFiles].slice(0, 20)
        : nextFiles.slice(0, 8),
    );
    setResult("");
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pastedFiles = Array.from(event.clipboardData.files);
    const pastedText = event.clipboardData.getData("text");

    if (pastedFiles.length > 0) {
      addFiles(pastedFiles);
    } else if (pastedText) {
      if (tool.mode === "url") {
        setUrl(pastedText);
      } else {
        setText((current) => (current ? `${current}\n${pastedText}` : pastedText));
      }
    }
  }

  function resetWorkspace() {
    setFiles([]);
    setText("");
    setSecondaryText("");
    setUrl("");
    setResult("");
  }

  function runTool() {
    setIsWorking(true);
    window.setTimeout(() => {
      const nextResult = computedPreview || `${tool.title} is ready for backend processing.`;
      setResult(nextResult);
      setHistory((current) => [
        {
          id: crypto.randomUUID(),
          label: tool.title,
          detail: stats,
        },
        ...current,
      ].slice(0, 5));
      setIsWorking(false);
    }, 450);
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon aria-hidden="true" className="size-5 text-primary" />
                Workspace
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {tool.mode === "upload" ? (
                <UploadSurface
                  tool={tool}
                  files={files}
                  previewUrl={previewUrl}
                  isDragging={isDragging}
                  inputRef={inputRef}
                  onInputChange={handleInputChange}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  onDragState={setIsDragging}
                  onPick={() => inputRef.current?.click()}
                  onRemove={(index) =>
                    setFiles((current) =>
                      current.filter((_, fileIndex) => fileIndex !== index),
                    )
                  }
                />
              ) : null}

              {tool.mode === "url" ? (
                <UrlSurface value={url} onChange={setUrl} onPaste={handlePaste} />
              ) : null}

              {tool.mode === "text" || tool.mode === "editor" ? (
                <EditorSurface
                  tool={tool}
                  text={text}
                  secondaryText={secondaryText}
                  onTextChange={setText}
                  onSecondaryTextChange={setSecondaryText}
                  onPaste={handlePaste}
                />
              ) : null}

              {tool.mode === "generator" ? (
                <GeneratorSurface
                  tool={tool}
                  text={text}
                  secondaryText={secondaryText}
                  onTextChange={setText}
                  onSecondaryTextChange={setSecondaryText}
                />
              ) : null}
            </CardContent>
          </Card>

          <PreviewPanel
            tool={tool}
            files={files}
            result={result}
            computedPreview={computedPreview}
            previewUrl={previewUrl}
          />
        </div>

        <aside className="space-y-6">
          <SettingsPanel tool={tool} stats={stats} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Action</CardTitle>
              <CardDescription>
                Frontend state is complete. Backend execution is intentionally a placeholder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="button"
                className="w-full"
                disabled={!canRun || isWorking}
                onClick={runTool}
              >
                {isWorking ? (
                  <Loader2 aria-hidden="true" className="animate-spin" />
                ) : (
                  <Play aria-hidden="true" />
                )}
                {isWorking ? "Preparing" : tool.actionLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetWorkspace}
              >
                <RotateCcw aria-hidden="true" />
                Reset
              </Button>
            </CardContent>
          </Card>

          <HistoryPanel history={history} />
        </aside>
      </div>

      <FAQPanel tool={tool} />
      <RelatedTools tools={relatedTools} />
      <CTAPanel category={tool.category} />
    </div>
  );
}

function CalculationWorkspace({ tool }: { tool: ExpandedTool }) {
  const [config, setConfig] = useState<CalculationConfig | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/${tool.categorySlug}/${tool.slug}`);
        const payload = (await response.json()) as ApiResponse<CalculationConfig>;

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Unable to load tool configuration.");
        }

        if (!isMounted) return;

        setConfig(payload.data);
        setValues(getInitialCalculationValues(payload.data.fields));
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load tool.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [tool.categorySlug, tool.slug]);

  async function runTool() {
    setIsWorking(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/${tool.categorySlug}/${tool.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as ApiResponse<CalculationResult>;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? "Unable to run calculation.");
      }

      setResult(payload.data);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unable to run calculation.");
    } finally {
      setIsWorking(false);
    }
  }

  function resetWorkspace() {
    setResult(null);
    setError("");
    setValues(config ? getInitialCalculationValues(config.fields) : {});
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText aria-hidden="true" className="size-5 text-primary" />
            Workspace
          </CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-11 rounded-md bg-muted" />
              <div className="h-11 rounded-md bg-muted" />
              <div className="h-11 rounded-md bg-muted md:col-span-2" />
            </div>
          ) : config ? (
            <div className="grid gap-4 md:grid-cols-2">
              {config.fields.map((field) => (
                <label key={field.name} className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    {field.label}
                  </span>
                  {field.type === "select" ? (
                    <select
                      value={values[field.name] ?? ""}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type}
                      step={field.step}
                      value={values[field.name] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              disabled={!config || isWorking}
              onClick={runTool}
            >
              {isWorking ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : (
                <Play aria-hidden="true" />
              )}
              {isWorking ? "Running" : tool.actionLabel}
            </Button>
            <Button type="button" variant="outline" onClick={resetWorkspace}>
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Result</CardTitle>
          <CardDescription>Backend response from the API route.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-5">
              <div className="rounded-lg border bg-background p-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {result.title}
                </p>
                <p className="mt-2 break-words text-3xl font-semibold text-foreground">
                  {result.value}
                  {result.unit ? (
                    <span className="ml-2 text-base font-medium text-muted-foreground">
                      {result.unit}
                    </span>
                  ) : null}
                </p>
              </div>
              {result.details ? (
                <dl className="space-y-3">
                  {Object.entries(result.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 rounded-md border bg-background px-3 py-2 text-sm"
                    >
                      <dt className="text-muted-foreground">{formatLabel(key)}</dt>
                      <dd className="text-right font-medium text-foreground">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg border bg-background p-5">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-4 h-8 w-44 rounded bg-muted/70" />
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Fill the fields and run the tool to see the backend result here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getInitialCalculationValues(fields: CalculationField[]) {
  return fields.reduce<Record<string, string>>((current, field) => {
    current[field.name] = field.options?.[0]?.value ?? "";
    return current;
  }, {});
}

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function UploadSurface({
  tool,
  files,
  previewUrl,
  isDragging,
  inputRef,
  onInputChange,
  onDrop,
  onPaste,
  onDragState,
  onPick,
  onRemove,
}: {
  tool: ExpandedTool;
  files: File[];
  previewUrl: string;
  isDragging: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLDivElement>) => void;
  onDragState: (value: boolean) => void;
  onPick: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div
        role="button"
        tabIndex={0}
        onClick={onPick}
        onPaste={onPaste}
        onDragOver={(event) => {
          event.preventDefault();
          onDragState(true);
        }}
        onDragLeave={() => onDragState(false)}
        onDrop={onDrop}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onPick();
          }
        }}
        className={cn(
          "grid min-h-72 cursor-pointer place-items-center rounded-lg border border-dashed bg-background p-6 text-center transition",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-accent/40",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={tool.acceptedTypes}
          onChange={onInputChange}
          className="sr-only"
        />
        {previewUrl ? (
          <div className="w-full max-w-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`${tool.title} preview`}
              className="mx-auto max-h-72 rounded-lg border object-contain"
            />
          </div>
        ) : (
          <div>
            <motion.span
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto flex size-14 items-center justify-center rounded-lg border bg-card text-primary"
            >
              <Upload aria-hidden="true" className="size-7" />
            </motion.span>
            <h3 className="mt-5 text-lg font-semibold text-foreground">
              Upload, drag, or paste
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Drop files here, click to browse, or paste an image from your clipboard.
            </p>
          </div>
        )}
      </div>

      <FileList files={files} onRemove={onRemove} />
    </div>
  );
}

function FileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (index: number) => void;
}) {
  if (files.length === 0) {
    return (
      <div className="rounded-lg border bg-background p-4">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="mt-3 h-3 w-56 rounded bg-muted/70" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${file.lastModified}-${index}`}
          className="flex items-center gap-3 rounded-lg border bg-background p-3"
        >
          <span className="flex size-10 items-center justify-center rounded-lg border bg-card text-primary">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatBytes(file.size)} - {file.type || "Unknown type"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function UrlSurface({
  value,
  onChange,
  onPaste,
}: {
  value: string;
  onChange: (value: string) => void;
  onPaste: (event: ClipboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div onPaste={onPaste} className="space-y-3">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">Source URL</span>
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/video-or-post"
        />
      </label>
      <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
        Paste a public video, post, or page URL to prepare the downloader workflow.
      </div>
    </div>
  );
}

function EditorSurface({
  tool,
  text,
  secondaryText,
  onTextChange,
  onSecondaryTextChange,
  onPaste,
}: {
  tool: ExpandedTool;
  text: string;
  secondaryText: string;
  onTextChange: (value: string) => void;
  onSecondaryTextChange: (value: string) => void;
  onPaste: (event: ClipboardEvent<HTMLDivElement>) => void;
}) {
  const secondaryLabel = tool.slug.includes("regex")
    ? "Test string"
    : tool.slug.includes("find-replace")
      ? "Replacement"
      : "Instructions";

  return (
    <div onPaste={onPaste} className="grid gap-4 lg:grid-cols-2">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">
          {tool.mode === "editor" ? "Editor input" : "Prompt input"}
        </span>
        <textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={getTextPlaceholder(tool)}
          className="min-h-72 w-full resize-y rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">{secondaryLabel}</span>
        <textarea
          value={secondaryText}
          onChange={(event) => onSecondaryTextChange(event.target.value)}
          placeholder="Tone, audience, language, pattern, or extra context"
          className="min-h-72 w-full resize-y rounded-md border border-input bg-background px-3 py-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </label>
    </div>
  );
}

function GeneratorSurface({
  tool,
  text,
  secondaryText,
  onTextChange,
  onSecondaryTextChange,
}: {
  tool: ExpandedTool;
  text: string;
  secondaryText: string;
  onTextChange: (value: string) => void;
  onSecondaryTextChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">Input</span>
        <Input
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={tool.slug.includes("password") ? "Optional phrase" : "Text, URL, or seed"}
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">Verify or compare</span>
        <Input
          value={secondaryText}
          onChange={(event) => onSecondaryTextChange(event.target.value)}
          placeholder="Optional comparison value"
        />
      </label>
    </div>
  );
}

function SettingsPanel({ tool, stats }: { tool: ExpandedTool; stats: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 aria-hidden="true" className="size-4 text-primary" />
          Settings
        </CardTitle>
        <CardDescription>{stats}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {getSettings(tool).map((setting) => (
          <label key={setting.label} className="block space-y-2">
            <span className="text-sm font-medium text-foreground">
              {setting.label}
            </span>
            {setting.kind === "select" ? (
              <select className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                {setting.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : setting.kind === "range" ? (
              <input
                type="range"
                min={setting.min}
                max={setting.max}
                defaultValue={setting.value}
                className="w-full accent-primary"
              />
            ) : setting.kind === "checkbox" ? (
              <input type="checkbox" defaultChecked className="size-4 accent-primary" />
            ) : (
              <Input placeholder={setting.placeholder} defaultValue={setting.value} />
            )}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

function PreviewPanel({
  tool,
  files,
  result,
  computedPreview,
  previewUrl,
}: {
  tool: ExpandedTool;
  files: File[];
  result: string;
  computedPreview: string;
  previewUrl: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Preview</CardTitle>
        <CardDescription>Review input and output before downloading or copying.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-h-40 rounded-lg border bg-background p-4">
            <p className="text-sm font-medium text-foreground">Input preview</p>
            {previewUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previewUrl}
                alt={`${tool.title} input`}
                className="mt-3 max-h-56 rounded-md border object-contain"
              />
            ) : files.length > 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {files.length} file{files.length === 1 ? "" : "s"} selected.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-3 w-64 max-w-full rounded bg-muted/70" />
              </div>
            )}
          </div>
          <div className="min-h-40 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">Output preview</p>
              <Button type="button" variant="outline" size="sm">
                <Copy aria-hidden="true" />
                Copy
              </Button>
            </div>
            <AnimatePresence mode="wait">
              <motion.pre
                key={result || computedPreview || "empty"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-sm text-muted-foreground"
              >
                {result || computedPreview || "Output appears here after you add input or run the tool."}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryPanel({ history }: { history: HistoryItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">History</CardTitle>
        <CardDescription>Recent runs stay visible during this session.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="rounded-lg border bg-background p-4">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="mt-3 h-3 w-44 rounded bg-muted/70" />
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="rounded-lg border bg-background p-3">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FAQPanel({ tool }: { tool: ExpandedTool }) {
  const faqs = [
    {
      question: `Can I use ${tool.title} before the backend is connected?`,
      answer:
        "Yes. The full frontend workflow is ready, including input, settings, preview, action states, and history placeholders.",
    },
    {
      question: "Are files uploaded to a server right now?",
      answer:
        "No. This implementation keeps processing local in the interface until the backend placeholders are implemented.",
    },
    {
      question: "Will this page support downloads later?",
      answer:
        "Yes. The result panel and action area are shaped for backend responses, generated files, copy actions, and downloads.",
    },
  ];

  return (
    <section className="rounded-lg border bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-foreground">FAQ</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-lg border bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedTools({ tools }: { tools: ExpandedTool[] }) {
  if (tools.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">Related Tools</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={`${tool.categorySlug}-${tool.slug}`}
            href={`/tools/${tool.categorySlug}/${tool.slug}`}
            className="rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
          >
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <h3 className="mt-3 font-semibold text-foreground">{tool.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CTAPanel({ category }: { category: string }) {
  return (
    <section className="rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Keep building your workflow
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Explore more {category.toLowerCase()} pages with the same upload,
            settings, preview, and history patterns.
          </p>
        </div>
        <Button asChild>
          <Link href="/#categories">
            Browse categories
            <Download aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function useObjectUrl(file: File | undefined) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url;
}

function getModeIcon(mode: ExpandedTool["mode"]) {
  if (mode === "upload") return ImageIcon;
  if (mode === "url") return Clipboard;
  if (mode === "editor") return FileArchive;
  if (mode === "generator") return Wand2;
  return FileText;
}

function getInputStats(
  tool: ExpandedTool,
  files: File[],
  text: string,
  url: string,
) {
  if (files.length > 0) {
    const size = files.reduce((total, file) => total + file.size, 0);
    return `${files.length} file${files.length === 1 ? "" : "s"} - ${formatBytes(size)}`;
  }

  if (url) return "1 source URL";
  if (text) return `${text.length} characters`;
  return `${tool.title} ready`;
}

function getTextPlaceholder(tool: ExpandedTool) {
  if (tool.slug.includes("json")) return '{\n  "name": "ZippyPair"\n}';
  if (tool.slug.includes("markdown")) return "# Heading\n\nWrite markdown here.";
  if (tool.slug.includes("sql")) return "select * from tools where category = 'dev';";
  if (tool.slug.includes("email")) return "Tell us the recipient, topic, and tone.";
  if (tool.slug.includes("blog")) return "Write a topic, audience, and outline.";
  if (tool.slug.includes("translator")) return "Paste the text you want translated.";
  return "Paste or write your content here.";
}

function getSettings(tool: ExpandedTool): ToolSetting[] {
  if (tool.categorySlug === "image") {
    return [
      { label: "Output format", kind: "select", options: ["Original", "JPG", "PNG", "WebP", "PDF"] },
      { label: "Quality", kind: "range", min: 10, max: 100, value: 82 },
      { label: "Preserve metadata", kind: "checkbox" },
    ];
  }

  if (tool.categorySlug === "video") {
    return [
      { label: "Output type", kind: "select", options: ["Original", "MP4", "MP3", "GIF", "WAV"] },
      { label: "Quality", kind: "select", options: ["Balanced", "High", "Smallest file"] },
      { label: "Trim range", kind: "text", placeholder: "00:00 - 00:30" },
    ];
  }

  if (tool.categorySlug === "ai") {
    return [
      { label: "Tone", kind: "select", options: ["Clear", "Friendly", "Professional", "Concise"] },
      { label: "Length", kind: "select", options: ["Short", "Medium", "Long"] },
      { label: "Language", kind: "text", placeholder: "English" },
    ];
  }

  if (tool.categorySlug === "dev") {
    return [
      { label: "Indent size", kind: "select", options: ["2 spaces", "4 spaces", "Tabs"] },
      { label: "Validate before output", kind: "checkbox" },
      { label: "Output mode", kind: "select", options: ["Formatted", "Compact", "Explained"] },
    ];
  }

  if (tool.categorySlug === "security") {
    return [
      { label: "Length", kind: "range", min: 8, max: 128, value: 32 },
      { label: "Include symbols", kind: "checkbox" },
      { label: "Encoding", kind: "select", options: ["Hex", "Base64", "Plain text"] },
    ];
  }

  return [
    { label: "Precision", kind: "select", options: ["Auto", "2 decimals", "4 decimals"] },
    { label: "Save to history", kind: "checkbox" },
    { label: "Output label", kind: "text", placeholder: "Optional name" },
  ];
}

function getPreviewOutput(
  tool: ExpandedTool,
  text: string,
  secondaryText: string,
  url: string,
  files: File[],
) {
  if (tool.slug === "word-counter") {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return `${words} words`;
  }

  if (tool.slug === "character-counter") return `${text.length} characters`;
  if (tool.slug === "line-counter") return `${text ? text.split(/\r?\n/).length : 0} lines`;
  if (tool.slug === "reverse-text") return text.split("").reverse().join("");
  if (tool.slug === "remove-extra-spaces") return text.replace(/\s+/g, " ").trim();
  if (tool.slug === "case-converter") return text.toUpperCase();
  if (tool.slug === "base64-encoder") return safeBase64Encode(text);
  if (tool.slug === "base64-decoder") return safeBase64Decode(text);
  if (tool.slug === "url-encoder") return encodeURIComponent(text);
  if (tool.slug === "url-decoder") return safeDecodeURIComponent(text);
  if (tool.slug === "json-formatter") return safeJsonFormat(text);
  if (tool.slug === "json-validator") return safeJsonFormat(text) ? "Valid JSON" : "Waiting for valid JSON";
  if (tool.slug === "uuid-generator") return crypto.randomUUID();
  if (tool.slug === "slug-generator") return slugify(text);
  if (tool.slug === "lorem-ipsum-generator") {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.";
  }

  if (tool.mode === "url" && url) return `Source captured:\n${url}`;
  if (tool.mode === "upload" && files.length > 0) {
    return `${files.length} file${files.length === 1 ? "" : "s"} prepared for ${tool.title}.`;
  }

  if (secondaryText) return `${text}\n\nSettings:\n${secondaryText}`;
  return text;
}

function safeJsonFormat(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return "";
  }
}

function safeBase64Encode(value: string) {
  try {
    return btoa(unescape(encodeURIComponent(value)));
  } catch {
    return "";
  }
}

function safeBase64Decode(value: string) {
  try {
    return decodeURIComponent(escape(atob(value)));
  } catch {
    return "";
  }
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
