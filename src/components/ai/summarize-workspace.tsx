"use client";

import { useState, useRef } from "react";
import {
  ChevronDown,
  AlignLeft,
  List,
  Clipboard,
  Upload,
  Loader2,
  Copy,
  Check,
  X,
  FileText,
} from "lucide-react";
import axios from "axios";
import type { BulletStyle } from "@/services/ai/summarize.service";

const LENGTHS = ["Short", "Medium", "Long"];
const BULLET_STYLES = [
  { value: "dash" as BulletStyle, label: "- Dash", symbol: "-" },
  { value: "asterisk" as BulletStyle, label: "* Asterisk", symbol: "*" },
  { value: "plus" as BulletStyle, label: "+ Plus", symbol: "+" },
  { value: "number" as BulletStyle, label: "1. Number", symbol: "1." },
  { value: "arrow" as BulletStyle, label: "→ Arrow", symbol: "→" },
];

type OutputMode = "paragraph" | "bullets";

function DropdownSelect({
  value,
  options,
  onChange,
  prefix,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  prefix?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
      >
        {prefix ? `${prefix} (${value})` : value}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[140px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                value === opt
                  ? "text-[#2a7a3b] font-medium"
                  : "text-gray-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SummarizeWorkspace() {
  const [length, setLength] = useState("Medium");
  const [mode, setMode] = useState<OutputMode>("paragraph");
  const [bulletStyle, setBulletStyle] = useState<BulletStyle>("dash");
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setError("");
    } catch {
      setError("Unable to read from clipboard");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      // Send file to API for extraction and summarization
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "prompts",
        mode === "bullets"
          ? `Summarize this text in bullet points using ${bulletStyle} style`
          : "Please summarize the provided text in a concise paragraph"
      );

      const response = await axios.post("/api/ai/summarize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.summary) {
        setSummary(response.data.summary);
        setInputText(""); // Clear textarea
        setUploadedFile({
          name: response.data.fileName,
          size: formatFileSize(file.size),
        });
      }
    } catch (err) {
      console.error("Error processing file:", err);
      let errorMessage = "Failed to process file";
      
      if (axios.isAxiosError(err)) {
        // Get error from API response
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = `Network error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setUploadedFile(null);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };



  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to summarize");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const prompt =
        mode === "bullets"
          ? `Summarize this text in bullet points using ${bulletStyle} style`
          : "Summarize the total text in short form";

      const response = await axios.get("/api/ai/summarize", {
        params: {
          comd: inputText,
          prompts: prompt,
        },
      });

      setSummary(response.data);
    } catch (err) {
      console.error("Error:", err);
      let errorMessage = "Unable to connect to AI service. Please check if the API endpoint exists.";
      
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = `Network error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(`Error: ${errorMessage}`);
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setSummary("");
    setError("");
    setUploadedFile(null);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <DropdownSelect
          value={length}
          options={LENGTHS}
          onChange={setLength}
          prefix="Length"
        />

        {/* Mode toggle */}
        <div className="ml-auto flex items-center border border-gray-300 rounded-full overflow-hidden">
          <button
            onClick={() => setMode("paragraph")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
              mode === "paragraph"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <AlignLeft size={14} />
            Paragraph
          </button>
          <button
            onClick={() => setMode("bullets")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
              mode === "bullets"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <List size={14} />
            Bullet Points
          </button>
        </div>
      </div>

      {/* Bullet style selector - only show when bullets mode is selected */}
      {mode === "bullets" && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 w-full">
            Bullet Style:
          </span>
          {BULLET_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => setBulletStyle(style.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                bulletStyle === style.value
                  ? "bg-[#2a7a3b] text-white border border-[#2a7a3b]"
                  : "border border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
              }`}
            >
              <span className="text-xs">{style.symbol}</span>
              {style.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Textarea */}
      <div className="relative border border-gray-200 rounded-xl bg-white overflow-hidden">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Enter or paste your text and press "Summarize"'
          className="w-full h-52 px-4 pt-4 pb-14 text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent"
        />

        {/* Action buttons inside textarea */}
        <div className="absolute bottom-3 left-4 flex gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2a7a3b] text-[#2a7a3b] text-xs font-medium hover:bg-[#e8f5eb] transition-colors"
          >
            <Clipboard size={13} />
            Paste
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2a7a3b] text-[#2a7a3b] text-xs font-medium hover:bg-[#e8f5eb] transition-colors"
          >
            <Upload size={13} />
            Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.pdf,.docx,.doc,.xlsx,.xls,.csv,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Character count */}
        <div className="absolute bottom-3 right-4 text-xs text-gray-400">
          {inputText.length.toLocaleString()} characters
        </div>
      </div>

      {/* Uploaded file info */}
      {uploadedFile && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <FileText size={16} className="text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">{uploadedFile.name}</p>
            <p className="text-xs text-blue-700">{uploadedFile.size}</p>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <X size={16} className="text-blue-600" />
          </button>
        </div>
      )}

      {/* Supported formats info */}
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
        <p className="font-medium mb-1">Supported formats:</p>
        <p>📄 TXT • 📕 PDF • 📘 DOCX • 📙 DOC • 📊 XLSX • 📗 XLS • 📋 CSV • 📝 MD</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSummarize}
          disabled={loading || !inputText.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2a7a3b] text-white rounded-full font-medium text-sm hover:bg-[#1f5a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Summarizing...
            </>
          ) : (
            "Summarize"
          )}
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output section */}
      {summary && (
        <div className="relative border border-gray-200 rounded-xl bg-white overflow-hidden">
          <div className="p-4 max-h-52 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {summary}
            </p>
          </div>

          {/* Copy button */}
          <div className="absolute bottom-3 right-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2a7a3b] text-[#2a7a3b] text-xs font-medium hover:bg-[#e8f5eb] transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
