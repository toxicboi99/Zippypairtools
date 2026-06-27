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
} from "lucide-react";
import axios from "axios";

const LENGTHS = ["Short", "Medium", "Long"];

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
  const [length, setLength] = useState("Short");
  const [mode, setMode] = useState<OutputMode>("paragraph");
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch {
      setError("Unable to read from clipboard");
    }
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
          ? "Summarize this text in bullet points"
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
      setError(
        "Error: Unable to connect to AI service. Please check if the API endpoint exists."
      );
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("text/")) {
      setError("Please upload a text file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setInputText(result);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
    e.target.value = "";
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
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <DropdownSelect value={length} options={LENGTHS} onChange={setLength} />

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
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {/* Character count */}
        <div className="absolute bottom-3 right-4 text-xs text-gray-400">
          {inputText.length.toLocaleString()} characters
        </div>
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
