import { siteConfig } from "@/frontend/constants/site";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  keywords: string[];
  relatedHref: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "choose-right-pdf-workflow",
    title: "How to Choose the Right PDF Workflow",
    description:
      "Learn when to merge, split, compress, convert, or remove pages from PDF files using ZippyPair Tools.",
    publishedAt: "2026-07-06",
    updatedAt: "2026-07-07",
    category: "PDF Tools",
    keywords: ["PDF workflow", "merge PDF", "split PDF", "compress PDF"],
    relatedHref: "/categories/pdf",
    sections: [
      {
        heading: "Start with the final document",
        body: [
          "The best PDF workflow begins with the result you need. If several files should become one document, use a merge tool. If one file needs to become smaller pieces, use a split or remove-pages workflow.",
          "ZippyPair Tools groups PDF pages and related utilities so users can move from the category page to the exact task without guessing.",
        ],
      },
      {
        heading: "Review before downloading",
        body: [
          "For important forms, client documents, academic files, or records, always check page order, file size, and output quality before sharing the result.",
          "Avoid uploading confidential or regulated files unless an online utility is appropriate for that material.",
        ],
      },
    ],
  },
  {
    slug: "ai-writing-tool-checklist",
    title: "A Quick Checklist Before Using AI Writing Tools",
    description:
      "Use audience, tone, length, facts, and review steps to get better results from AI writing utilities.",
    publishedAt: "2026-07-06",
    updatedAt: "2026-07-07",
    category: "AI Writing",
    keywords: ["AI writing tools", "AI checklist", "summarize", "paraphrase"],
    relatedHref: "/categories/ai",
    sections: [
      {
        heading: "Define the job clearly",
        body: [
          "Before using an AI writing tool, decide the audience, tone, desired length, and purpose of the output. Clear instructions reduce rewriting and make the final review faster.",
          "AI tools are useful for drafts, summaries, translations, rewrites, and idea generation, but they should not replace human review.",
        ],
      },
      {
        heading: "Review facts and rights",
        body: [
          "Check names, dates, citations, numbers, and claims before publishing AI-assisted text. Do not paste private, confidential, or copyrighted material unless you have the right to process it.",
          `${siteConfig.name} keeps AI pages structured with FAQs and practical guidance so users and answer engines can understand each tool's intended use.`,
        ],
      },
    ],
  },
  {
    slug: "check-before-uploading-files-online",
    title: "What to Check Before Uploading Files Online",
    description:
      "A practical privacy and safety checklist for using browser-based file, PDF, image, and media tools.",
    publishedAt: "2026-07-06",
    updatedAt: "2026-07-07",
    category: "Privacy",
    keywords: ["online file tools", "upload privacy", "file safety"],
    relatedHref: "/privacy-policy",
    sections: [
      {
        heading: "Confirm file sensitivity",
        body: [
          "Before uploading a file to any online tool, check whether it contains private identity details, financial records, medical information, legal material, business secrets, or data you do not have permission to process.",
          "If the content is sensitive, choose a local workflow or a trusted managed system that matches your privacy requirements.",
        ],
      },
      {
        heading: "Check ownership and output",
        body: [
          "Make sure you own or have permission to process the file. After the tool runs, review the output for formatting, completeness, compression quality, and accidental data exposure.",
          "Good online utility pages should make purpose, limitations, and review steps clear before users rely on the result.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
