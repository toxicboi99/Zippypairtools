import { legalPages } from "@/frontend/constants/legal-pages";
import { siteConfig } from "@/frontend/constants/site";
import { categories, tools } from "@/frontend/constants/tools";
import { blogPosts } from "@/frontend/data/blog-posts";
import { expandedToolCategories, expandedTools } from "@/frontend/data/expanded-tools";

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

const categoryAliases: Record<string, string[]> = {
  media: ["video"],
  developer: ["dev"],
  calculator: ["calculators"],
  converter: ["conversion"],
};

const canonicalCategorySlugs: Record<string, string> = {
  video: "media",
  dev: "developer",
  calculators: "calculator",
  conversion: "converter",
};

const childSitemaps = [
  "/sitemap-pages.xml",
  "/sitemap-tools.xml",
  "/sitemap-categories.xml",
  "/sitemap-blog.xml",
  "/sitemap-images.xml",
];

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

export const categoryEntries: SitemapEntry[] = Array.from(
  new Set(categories.map((category) => `/categories/${category.slug}`)),
)
  .sort()
  .map((path) => ({
    path,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

export const blogEntries: SitemapEntry[] = [
  { path: "/blog", changeFrequency: "monthly", priority: 0.6 },
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt}T00:00:00.000Z`),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })),
];

export const imageEntries: SitemapEntry[] = [
  { path: "/", changeFrequency: "monthly", priority: 0.5 },
];

export function getCategoryToolPaths(slug: string) {
  const acceptedSlugs = new Set([slug, ...(categoryAliases[slug] ?? [])]);

  return Array.from(
    new Map(
      [
        ...tools
          .filter((tool) => acceptedSlugs.has(tool.categorySlug))
          .map((tool) => [
            tool.href ?? `/tools/${tool.slug}`,
            {
              name: tool.title,
              path: tool.href ?? `/tools/${tool.slug}`,
              description: tool.description,
            },
          ] as const),
        ...expandedTools
          .filter((tool) => acceptedSlugs.has(tool.categorySlug))
          .map((tool) => [
            `/tools/${tool.categorySlug}/${tool.slug}`,
            {
              name: tool.title,
              path: `/tools/${tool.categorySlug}/${tool.slug}`,
              description: tool.description,
            },
          ] as const),
      ],
    ).values(),
  );
}

export function getCanonicalCategoryPath(slug: string) {
  return `/categories/${canonicalCategorySlugs[slug] ?? slug}`;
}

export function getCategoryByRouteSlug(slug: string) {
  const category = categories.find((item) => item.slug === slug);

  if (category) {
    return {
      slug: category.slug,
      title: `${category.title} Tools`,
      description: category.description,
    };
  }

  const expandedCategory = expandedToolCategories.find((item) => item.slug === slug);

  if (expandedCategory) {
    return expandedCategory;
  }

  return undefined;
}

export function toMetadataSitemap(entries: SitemapEntry[]) {
  return entries.map((entry) => ({
    url: `${siteConfig.url}${entry.path}`,
    lastModified: entry.lastModified ?? updated,
    changeFrequency: entry.changeFrequency ?? "weekly",
    priority: entry.priority ?? 0.7,
  }));
}

export function buildUrlSet(entries: SitemapEntry[]) {
  const dedupedEntries = Array.from(
    new Map(entries.map((entry) => [entry.path, entry])).values(),
  );
  const urls = dedupedEntries
    .map((entry) => {
      const lastModified = (entry.lastModified ?? updated).toISOString();
      const changeFrequency = entry.changeFrequency ?? "weekly";
      const priority = entry.priority ?? 0.7;

      return [
        "  <url>",
        `    <loc>${escapeXml(`${siteConfig.url}${entry.path}`)}</loc>`,
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

export function buildSitemapIndex() {
  const sitemaps = childSitemaps
    .map((path) =>
      [
        "  <sitemap>",
        `    <loc>${escapeXml(`${siteConfig.url}${path}`)}</loc>`,
        `    <lastmod>${updated.toISOString()}</lastmod>`,
        "  </sitemap>",
      ].join("\n"),
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemaps,
    "</sitemapindex>",
  ].join("\n");
}

export function buildImageSitemap(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) =>
      [
        "  <url>",
        `    <loc>${escapeXml(`${siteConfig.url}${entry.path}`)}</loc>`,
        "    <image:image>",
        `      <image:loc>${escapeXml(`${siteConfig.url}/opengraph-image.svg`)}</image:loc>`,
        `      <image:title>${escapeXml(siteConfig.name)}</image:title>`,
        `      <image:caption>${escapeXml(siteConfig.description)}</image:caption>`,
        "    </image:image>",
        "  </url>",
      ].join("\n"),
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
