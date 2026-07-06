import { legalPages } from "@/frontend/constants/legal-pages";
import { siteConfig } from "@/frontend/constants/site";
import { tools } from "@/frontend/constants/tools";
import { expandedTools } from "@/frontend/data/expanded-tools";

export interface SitemapEntry {
  path: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

const updated = new Date("2026-07-06T00:00:00.000Z");

export const staticPageEntries: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "monthly", priority: 0.6 },
  ...legalPages.map((page) => ({
    path: `/${page.slug}`,
    changeFrequency: "monthly" as const,
    priority: page.slug === "faqs" ? 0.8 : 0.6,
  })),
];

export const toolEntries: SitemapEntry[] = Array.from(
  new Set([
    ...tools.map((tool) => tool.href ?? `/tools/${tool.slug}`),
    ...expandedTools.map((tool) => `/tools/${tool.categorySlug}/${tool.slug}`),
  ]),
)
  .sort()
  .map((path) => ({
    path,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

export const categoryEntries: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 0.5 },
];

export const blogEntries: SitemapEntry[] = [
  { path: "/blog", changeFrequency: "monthly", priority: 0.6 },
];

export const imageEntries: SitemapEntry[] = [];

export function toMetadataSitemap(entries: SitemapEntry[]) {
  return entries.map((entry) => ({
    url: `${siteConfig.url}${entry.path}`,
    lastModified: entry.lastModified ?? updated,
    changeFrequency: entry.changeFrequency ?? "weekly",
    priority: entry.priority ?? 0.7,
  }));
}

export function buildUrlSet(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const lastModified = (entry.lastModified ?? updated).toISOString();
      const changeFrequency = entry.changeFrequency ?? "weekly";
      const priority = entry.priority ?? 0.7;

      return [
        "  <url>",
        `    <loc>${siteConfig.url}${entry.path}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        `    <changefreq>${changeFrequency}</changefreq>`,
        `    <priority>${priority.toFixed(1)}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
