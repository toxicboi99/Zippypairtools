"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, Download, Loader2, QrCode, Share2 } from "lucide-react";

import type { LinkToQrResult, QrErrorCorrectionLevel } from "@/backend/types/link-to-qr";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { cn } from "@/frontend/utils/cn";

const correctionLevels: Array<{ value: QrErrorCorrectionLevel; label: string }> = [
  { value: "L", label: "Low" },
  { value: "M", label: "Medium" },
  { value: "Q", label: "Quartile" },
  { value: "H", label: "High" },
];

interface ApiResponse {
  success: boolean;
  data?: LinkToQrResult;
  error?: string;
  details?: Array<{ message?: string }>;
}

function downloadBlob(blob: Blob, fileName: string) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(href);
}

export function LinkToQrWorkspace() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(320);
  const [level, setLevel] = useState<QrErrorCorrectionLevel>("M");
  const [result, setResult] = useState<LinkToQrResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const value = url.trim();
    if (!value) {
      setResult(null);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/file/link-to-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value, size, errorCorrectionLevel: level }),
          signal: controller.signal,
        });
        const payload = await response.json() as ApiResponse;
        if (!response.ok || !payload.data) {
          setResult(null);
          setError(payload.details?.[0]?.message ?? payload.error ?? "Enter a valid URL.");
          return;
        }
        setResult(payload.data);
      } catch (reason) {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setResult(null);
        setError("The QR code could not be generated. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [url, size, level]);

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.url);
    setFeedback("Link copied");
    window.setTimeout(() => setFeedback(""), 1800);
  }

  async function downloadPng() {
    if (!result) return;
    downloadBlob(await fetch(result.pngDataUrl).then((response) => response.blob()), "zippypair-link-qr.png");
  }

  function downloadSvg() {
    if (!result) return;
    downloadBlob(new Blob([result.svg], { type: "image/svg+xml;charset=utf-8" }), "zippypair-link-qr.svg");
  }

  async function shareQrCode() {
    if (!result) return;
    try {
      const blob = await fetch(result.pngDataUrl).then((response) => response.blob());
      const file = new File([blob], "zippypair-link-qr.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "Link QR Code", text: result.url, files: [file] });
        setFeedback("QR code shared");
      } else if (navigator.share) {
        await navigator.share({ title: "Link QR Code", text: result.url, url: result.url });
        setFeedback("Link shared");
      } else {
        await navigator.clipboard.writeText(result.url);
        setFeedback("Sharing is unavailable, so the link was copied");
      }
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setFeedback("The QR code could not be shared");
    }
    window.setTimeout(() => setFeedback(""), 2200);
  }

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-foreground">Create a QR code</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter an HTTP or HTTPS link. The preview updates automatically and nothing is stored.
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div>
              <label htmlFor="qr-url" className="text-sm font-medium text-foreground">Website link</label>
              <Input
                id="qr-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                className="mt-2"
                placeholder="https://example.com"
                value={url}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "qr-url-error" : "qr-url-help"}
                onChange={(event) => setUrl(event.target.value)}
              />
              {error ? <p id="qr-url-error" role="alert" className="mt-2 text-sm text-destructive">{error}</p> : <p id="qr-url-help" className="mt-2 text-sm text-muted-foreground">Links without a protocol use HTTPS automatically.</p>}
            </div>

            <div>
              <div className="flex items-center justify-between gap-4"><label htmlFor="qr-size" className="text-sm font-medium">QR size</label><output htmlFor="qr-size" className="text-sm text-muted-foreground">{size} x {size}px</output></div>
              <input id="qr-size" type="range" min="128" max="1024" step="32" value={size} onChange={(event) => setSize(Number(event.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-primary" />
            </div>

            <fieldset>
              <legend className="text-sm font-medium">Error correction</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {correctionLevels.map((option) => (
                  <button key={option.value} type="button" aria-pressed={level === option.value} onClick={() => setLevel(option.value)} className={cn("h-10 rounded-md border px-3 text-sm font-medium outline-none transition focus-visible:ring-3 focus-visible:ring-ring/50", level === option.value ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:bg-accent")}>{option.label}</button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" disabled={!result} onClick={downloadPng}><Download aria-hidden="true" />PNG</Button>
              <Button type="button" variant="outline" disabled={!result} onClick={downloadSvg}><Download aria-hidden="true" />SVG</Button>
              <Button type="button" variant="outline" disabled={!result} onClick={copyLink}>{feedback === "Link copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}Copy link</Button>
              <Button type="button" disabled={!result} onClick={shareQrCode}><Share2 aria-hidden="true" />Share</Button>
            </div>
            <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">{feedback}</p>
          </div>

          <div className="flex min-h-96 items-center justify-center rounded-lg border bg-background p-5" aria-live="polite" aria-busy={loading}>
            {loading ? <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground"><Loader2 aria-hidden="true" className="size-8 animate-spin" />Generating preview...</div> : result ? <Image src={result.pngDataUrl} alt={`QR code for ${result.url}`} width={result.size} height={result.size} unoptimized className="h-auto w-full max-w-80" /> : <div className="text-center text-muted-foreground"><QrCode aria-hidden="true" className="mx-auto size-12" /><p className="mt-3 text-sm">Your QR preview will appear here.</p></div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
