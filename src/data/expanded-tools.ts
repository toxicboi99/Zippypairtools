export type ExpandedToolCategorySlug =
  | "image"
  | "video"
  | "ai"
  | "dev"
  | "calculators"
  | "conversion"
  | "security"
  | "text"
  | "seo"
  | "social"
  | "file";

export type ExpandedToolMode =
  | "upload"
  | "url"
  | "text"
  | "editor"
  | "calculator"
  | "converter"
  | "generator";

export interface ExpandedToolCategory {
  slug: ExpandedToolCategorySlug;
  title: string;
  description: string;
}

export interface ExpandedTool {
  slug: string;
  title: string;
  description: string;
  categorySlug: ExpandedToolCategorySlug;
  category: string;
  mode: ExpandedToolMode;
  acceptedTypes?: string;
  keywords: string[];
  actionLabel: string;
}

const categoryDescriptions: Record<ExpandedToolCategorySlug, string> = {
  image: "Prepare, convert, inspect, and enhance images in focused browser workspaces.",
  video: "Download, convert, compress, trim, and repurpose creator media assets.",
  ai: "Draft, rewrite, translate, summarize, and polish text with premium AI forms.",
  dev: "Format, validate, encode, decode, preview, and generate developer data.",
  calculators: "Run everyday finance, date, health, science, and travel calculations.",
  conversion: "Convert dates, units, temperature, length, weight, speed, volume, time, and file sizes.",
  security: "Generate passwords, hashes, QR codes, tokens, UUIDs, and verification values.",
  text: "Count, clean, sort, transform, and generate plain text utilities.",
  seo: "Create metadata, preview snippets, analyze pages, and generate crawl directives.",
  social: "Download social media assets and format captions, hashtags, and posts.",
  file: "Compress, convert, inspect, rename, archive, and compare everyday files.",
};

export const expandedToolCategories: ExpandedToolCategory[] = [
  ["image", "Image Tools"],
  ["video", "Video & Audio Tools"],
  ["ai", "AI Tools"],
  ["dev", "Developer Tools"],
  ["calculators", "Calculators"],
  ["conversion", "Conversion Tools"],
  ["security", "Security Tools"],
  ["text", "Text Tools"],
  ["seo", "SEO Tools"],
  ["social", "Social Tools"],
  ["file", "File Utilities"],
].map(([slug, title]) => ({
  slug: slug as ExpandedToolCategorySlug,
  title,
  description: categoryDescriptions[slug as ExpandedToolCategorySlug],
}));

const imageTools = [
  ["compress", "Compress Image"],
  ["resize", "Resize Image"],
  ["crop", "Crop Image"],
  ["rotate", "Rotate Image"],
  ["flip", "Flip Image"],
  ["jpg-png", "JPG ↔ PNG"],
  ["png-webp", "PNG ↔ WebP"],
  ["webp-jpg", "WebP ↔ JPG"],
  ["remove-background", "Remove Background"],
  ["blur-background", "Blur Background"],
  ["add-watermark", "Add Watermark"],
  ["upscaler", "Image Upscaler"],
  ["image-to-pdf", "Image to PDF"],
  ["ocr-image-to-text", "OCR Image to Text"],
  ["metadata-viewer", "Image Metadata Viewer"],
] as const;

const videoTools = [
  ["youtube-thumbnail-downloader", "YouTube Thumbnail Downloader", "url"],
  ["instagram-video-downloader", "Instagram Video Downloader", "url"],
  ["tiktok-video-downloader", "TikTok Video Downloader", "url"],
  ["facebook-video-downloader", "Facebook Video Downloader", "url"],
  ["mp4-to-mp3", "MP4 to MP3", "upload"],
  ["audio-trimmer", "Audio Trimmer", "upload"],
  ["audio-converter", "Audio Converter", "upload"],
  ["video-compressor", "Video Compressor", "upload"],
  ["video-to-gif", "Video to GIF", "upload"],
  ["gif-to-mp4", "GIF to MP4", "upload"],
  ["extract-audio", "Extract Audio", "upload"],
  ["merge-audio", "Merge Audio", "upload"],
] as const;

const aiTools = [
  ["url-summary", "URL Summary"],
  ["paraphraser", "AI Paraphraser"],
  ["grammar-checker", "Grammar Checker"],
  ["plagiarism-checker", "Plagiarism Checker"],
  ["translator", "AI Translator"],
  ["text-to-speech", "Text to Speech"],
  ["speech-to-text", "Speech to Text"],
  ["essay-writer", "AI Essay Writer"],
  ["email-writer", "AI Email Writer"],
  ["blog-generator", "AI Blog Generator"],
  ["title-generator", "AI Title Generator"],
  ["keyword-generator", "AI Keyword Generator"],
] as const;

const developerTools = [
  ["json-formatter", "JSON Formatter"],
  ["json-validator", "JSON Validator"],
  ["base64-encoder", "Base64 Encoder"],
  ["base64-decoder", "Base64 Decoder"],
  ["url-encoder", "URL Encoder"],
  ["url-decoder", "URL Decoder"],
  ["jwt-decoder", "JWT Decoder"],
  ["regex-tester", "Regex Tester"],
  ["markdown-previewer", "Markdown Previewer"],
  ["html-minifier", "HTML Minifier"],
  ["css-minifier", "CSS Minifier"],
  ["javascript-minifier", "JavaScript Minifier"],
  ["sql-formatter", "SQL Formatter"],
  ["xml-formatter", "XML Formatter"],
  ["yaml-formatter", "YAML Formatter"],
  ["color-picker", "Color Picker"],
  ["hex-rgb", "HEX ↔ RGB"],
  ["uuid-generator", "UUID Generator"],
] as const;

const calculatorTools = [
  ["age", "Age Calculator"],
  ["bmi", "BMI Calculator"],
  ["percentage", "Percentage Calculator"],
  ["gst", "GST Calculator"],
  ["emi", "EMI Calculator"],
  ["loan", "Loan Calculator"],
  ["currency-converter", "Currency Converter"],
  ["unit-converter", "Unit Converter"],
  ["time-zone-converter", "Time Zone Converter"],
  ["scientific", "Scientific Calculator"],
  ["date-difference", "Date Difference Calculator"],
  ["fuel-cost", "Fuel Cost Calculator"],
] as const;

const conversionTools = [
  ["nepali-date", "Nepali Date"],
  ["unit-converter", "Unit Converter"],
  ["currency-converter", "Currency Converter"],
  ["temperature-converter", "Temperature Converter"],
  ["length-converter", "Length Converter"],
  ["weight-converter", "Weight Converter"],
  ["speed-converter", "Speed Converter"],
  ["volume-converter", "Volume Converter"],
  ["time-converter", "Time Converter"],
  ["file-size-converter", "File Size Converter"],
] as const;

const securityTools = [
  ["password-generator", "Password Generator"],
  ["password-strength-checker", "Password Strength Checker"],
  ["qr-generator", "QR Generator"],
  ["barcode-generator", "Barcode Generator"],
  ["md5-generator", "MD5 Generator"],
  ["sha1-generator", "SHA-1 Generator"],
  ["sha256-generator", "SHA-256 Generator"],
  ["sha512-generator", "SHA-512 Generator"],
  ["hash-verifier", "Hash Verifier"],
  ["uuid-generator", "UUID Generator"],
  ["random-string-generator", "Random String Generator"],
  ["secure-token-generator", "Secure Token Generator"],
] as const;

const textTools = [
  ["word-counter", "Word Counter"],
  ["character-counter", "Character Counter"],
  ["line-counter", "Line Counter"],
  ["case-converter", "Case Converter"],
  ["remove-duplicate-lines", "Remove Duplicate Lines"],
  ["text-sorter", "Text Sorter"],
  ["find-replace", "Find & Replace"],
  ["reverse-text", "Reverse Text"],
  ["remove-extra-spaces", "Remove Extra Spaces"],
  ["lorem-ipsum-generator", "Lorem Ipsum Generator"],
] as const;

const seoTools = [
  ["meta-generator", "Meta Tag Generator"],
  ["open-graph-generator", "Open Graph Generator"],
  ["robots-generator", "Robots.txt Generator"],
  ["sitemap-generator", "Sitemap Generator"],
  ["keyword-density-checker", "Keyword Density Checker"],
  ["seo-analyzer", "SEO Analyzer"],
  ["google-serp-preview", "Google SERP Preview"],
  ["canonical-url-generator", "Canonical URL Generator"],
  ["schema-generator", "Schema Generator"],
  ["slug-generator", "Slug Generator"],
  ["redirect-checker", "Redirect Checker"],
  ["broken-link-checker", "Broken Link Checker"],
] as const;

const socialTools = [
  ["youtube-thumbnail-downloader", "YouTube Thumbnail Downloader"],
  ["instagram-downloader", "Instagram Downloader"],
  ["tiktok-downloader", "TikTok Downloader"],
  ["facebook-downloader", "Facebook Downloader"],
  ["twitter-x-downloader", "Twitter/X Downloader"],
  ["linkedin-post-formatter", "LinkedIn Post Formatter"],
  ["hashtag-generator", "Hashtag Generator"],
  ["social-caption-generator", "Social Caption Generator"],
] as const;

const fileTools = [
  ["zip-extractor", "ZIP Extractor"],
  ["zip-creator", "ZIP Creator"],
  ["rename-files", "Rename Files"],
  ["metadata-viewer", "File Metadata Viewer"],
  ["duplicate-file-finder", "Duplicate File Finder"],
  ["checksum-generator", "File Checksum Generator"],
  ["file-compressor", "File Compressor"],
  ["file-converter", "File Converter"],
] as const;

function buildTool(
  categorySlug: ExpandedToolCategorySlug,
  slug: string,
  title: string,
  mode: ExpandedToolMode,
): ExpandedTool {
  const category = expandedToolCategories.find((item) => item.slug === categorySlug);
  const normalized = title.toLowerCase();

  return {
    slug,
    title,
    categorySlug,
    category: category?.title ?? "Tools",
    mode,
    acceptedTypes: getAcceptedTypes(categorySlug, slug),
    description: getDescription(categorySlug, title),
    keywords: [normalized, categorySlug, ...slug.split("-")],
    actionLabel: getActionLabel(categorySlug, title),
  };
}

function getDescription(categorySlug: ExpandedToolCategorySlug, title: string) {
  if (categorySlug === "image") {
    return `${title} with drag-and-drop upload, paste support, live preview, focused settings, and a clean output handoff.`;
  }

  if (categorySlug === "video") {
    return `${title} with a responsive media workspace, source controls, preview state, and backend-ready processing handoff.`;
  }

  if (categorySlug === "ai") {
    return `${title} using a premium prompt form with tone, length, audience, and output preview controls.`;
  }

  if (categorySlug === "dev") {
    return `${title} with side-by-side editor input, formatted preview, validation state, and copy-ready output.`;
  }

  if (categorySlug === "calculators") {
    return `${title} with polished numeric controls, clear result preview, and reusable calculation history.`;
  }

  if (categorySlug === "conversion") {
    return `${title} with paired conversion inputs, unit selectors, result preview, and saved recent conversions.`;
  }

  if (categorySlug === "security") {
    return `${title} with configurable inputs, strength or digest preview, and secure-generation ready states.`;
  }

  if (categorySlug === "text") {
    return `${title} with a focused text editor, transformation settings, instant metrics, and output preview.`;
  }

  if (categorySlug === "seo") {
    return `${title} with structured inputs, SERP-style preview, validation notes, and export-ready output.`;
  }

  if (categorySlug === "social") {
    return `${title} with URL or caption inputs, channel settings, preview cards, and creator workflow history.`;
  }

  return `${title} with upload controls, file preview, settings, action state, and backend-ready placeholders.`;
}

function getActionLabel(categorySlug: ExpandedToolCategorySlug, title: string) {
  if (categorySlug === "ai") return "Generate";
  if (categorySlug === "dev") return "Run tool";
  if (categorySlug === "calculators") return "Calculate";
  if (categorySlug === "conversion") return "Convert";
  if (categorySlug === "security") return title.includes("Checker") ? "Check" : "Generate";
  if (categorySlug === "text") return "Transform text";
  if (categorySlug === "seo") return "Create preview";
  return "Start workflow";
}

function getAcceptedTypes(categorySlug: ExpandedToolCategorySlug, slug: string) {
  if (categorySlug === "image") return "image/*";
  if (categorySlug === "file") return "*/*";
  if (categorySlug === "video") {
    if (slug.includes("audio")) return "audio/*,video/*";
    if (slug.includes("gif")) return "image/gif,video/*";
    return "video/*";
  }

  return undefined;
}

export const expandedTools: ExpandedTool[] = [
  ...imageTools.map(([slug, title]) => buildTool("image", slug, title, "upload")),
  ...videoTools.map(([slug, title, mode]) =>
    buildTool("video", slug, title, mode as ExpandedToolMode),
  ),
  ...aiTools.map(([slug, title]) => buildTool("ai", slug, title, "text")),
  ...developerTools.map(([slug, title]) => buildTool("dev", slug, title, "editor")),
  ...calculatorTools.map(([slug, title]) =>
    buildTool("calculators", slug, title, "calculator"),
  ),
  ...conversionTools.map(([slug, title]) =>
    buildTool("conversion", slug, title, "converter"),
  ),
  ...securityTools.map(([slug, title]) =>
    buildTool("security", slug, title, "generator"),
  ),
  ...textTools.map(([slug, title]) => buildTool("text", slug, title, "text")),
  ...seoTools.map(([slug, title]) => buildTool("seo", slug, title, "text")),
  ...socialTools.map(([slug, title]) =>
    buildTool("social", slug, title, slug.includes("formatter") || slug.includes("generator") ? "text" : "url"),
  ),
  ...fileTools.map(([slug, title]) => buildTool("file", slug, title, "upload")),
];

export function getExpandedTool(categorySlug: string, slug: string) {
  return expandedTools.find(
    (tool) => tool.categorySlug === categorySlug && tool.slug === slug,
  );
}

export function getExpandedCategory(slug: string) {
  return expandedToolCategories.find((category) => category.slug === slug);
}

export function getRelatedExpandedTools(tool: ExpandedTool, limit = 4) {
  return expandedTools
    .filter(
      (item) =>
        item.categorySlug === tool.categorySlug && item.slug !== tool.slug,
    )
    .slice(0, limit);
}
