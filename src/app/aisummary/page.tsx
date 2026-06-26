"use client"
import { useState, useRef } from "react";
import { ChevronDown, AlignLeft, List, Clipboard, Upload, Loader2, Copy, Check } from "lucide-react";
import axios from "axios"


const LANGUAGES =["Auto","English","Nepali"]
const VALUE = ["Auto","translate into English","translate into Nepali"]
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
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[140px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${value === opt ? "text-[#2a7a3b] font-medium" : "text-gray-700"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState("Ausssto");
  const [length, setLength] = useState("Short");
  const [mode, setMode] = useState<OutputMode>("paragraph");
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState("")
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch {
      // fallback: do nothing
    }
  };

  async function Sendvalue() {
    try {
      const response = await axios.get("/api/ai/summarize",
        {
          params: {
            comd: inputText,
            prompts:prompt
          }
        }
      )
      console.log(response.data)
      setSummary(response.data)
    } catch (error) {
      console.error("Error:", error)
      setSummary("Error: Unable to connect to AI service. Please check if the API endpoint exists.")
    }
  }


  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInputText(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSummarize = () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setSummary("");

    setTimeout(() => {
      const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
      const keep = Math.max(1, Math.ceil(sentences.length * (length === "Short" ? 0.25 : length === "Medium" ? 0.45 : 0.65)));
      const picked = sentences.slice(0, keep).map((s) => s.trim());

      if (mode === "bullets") {
        setSummary(picked.map((s) => `• ${s}`).join("\n"));
      } else {
        setSummary(picked.join(" "));
      }
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setSummary("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif] px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Summary
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Condense articles, reports, or documents down to the key points instantly. Our AI uses
          natural language processing to locate critical information while maintaining the original
          context.
        </p>
      </div>

      {/* Main card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Controls row */}

        <div className="flex flex-wrap items-center gap-3 mb-4">
        
          {/*  <DropdownSelect
              
              value={"translate in nepali"}
              options={"nepali"}
              
              prefix="Language"
            /> */}
      
          <DropdownSelect value={length} options={LENGTHS} onChange={setLength} />
          <h1>{language}</h1>
          {/* Mode toggle */}
          <div className="ml-auto flex items-center border border-gray-300 rounded-full overflow-hidden">
            <button
              onClick={() => setMode("paragraph")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${mode === "paragraph"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              <AlignLeft size={14} />
              Paragraph
            </button>
            <button
              onClick={() => setMode("bullets")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${mode === "bullets"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              <List size={14} />
              Bullet Points
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative border border-gray-200 rounded-xl bg-white overflow-hidden mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Enter or paste your text and press "Summarize"'
            className="w-full h-52 px-4 pt-4 pb-14 text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent"
          />

          {/* Paste / Upload buttons inside textarea */}
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
            <input ref={fileRef} type="file" accept=".txt,.md,.doc,.docx" className="hidden" onChange={handleUpload} />
          </div>

          {/* Character count */}
          {inputText.length > 0 && (
            <div className="absolute bottom-3.5 right-4 text-xs text-gray-400">
              {inputText.length.toLocaleString()} chars
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="flex justify-between items-center">
          {inputText && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={Sendvalue}
              disabled={!inputText.trim() || loading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#2a7a3b] text-white text-sm font-semibold hover:bg-[#22663100] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: inputText.trim() && !loading ? "#2a7a3b" : undefined }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Summarize
            </button>
          </div>
        </div>
      </div>

      {/* Output card */}
      {(summary || loading) && (
        <div className="max-w-3xl mx-auto mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Summary</h2>
            {summary && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {copied ? <Check size={13} className="text-[#2a7a3b]" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center gap-3 text-gray-400 text-sm py-6 justify-center">
              <Loader2 size={18} className="animate-spin text-[#2a7a3b]" />
              Generating summary…
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
          )}
        </div>
      )}

      {/* Footer hint */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Tip: longer texts produce more accurate summaries.
      </p>
    </div>
  );
}