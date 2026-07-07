import * as cheerio from "cheerio";

const baseUrl = "http://127.0.0.1:3000";
const origin = new URL(baseUrl).origin;
const importantPaths = [
  "/",
  "/tools/pdf-merge",
  "/tools/image/compress",
  "/blog",
  "/blog/choose-right-pdf-workflow",
  "/categories/pdf",
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap-pages.xml",
  "/sitemap-tools.xml",
  "/sitemap-blog.xml",
  "/sitemap-categories.xml",
  "/sitemap-images.xml",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/opengraph-image.svg",
];

const htmlPages = new Map();
const routeStatuses = [];
const brokenLinks = [];
const redirectChains = [];
const metadataIssues = [];
const a11yIssues = [];
const jsonLdIssues = [];
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const inbound = new Map();
const seen = new Set();

async function fetchManual(pathOrUrl) {
  const url = normalizeUrl(pathOrUrl);
  const response = await fetch(url, { redirect: "manual" });
  return response;
}

function normalizeUrl(pathOrUrl) {
  const url = new URL(pathOrUrl, baseUrl);
  url.hash = "";
  return url.toString();
}

function toPath(url) {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

function isInternalHref(href) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  const url = new URL(href, baseUrl);
  return url.origin === origin;
}

async function checkImportantRoutes() {
  for (const path of importantPaths) {
    const response = await fetchManual(path);
    routeStatuses.push({
      path,
      status: response.status,
      redirected: response.status >= 300 && response.status < 400,
    });
  }
}

async function extractSitemapUrls() {
  const urls = new Set(["/"]);
  for (const sitemap of [
    "/sitemap-pages.xml",
    "/sitemap-tools.xml",
    "/sitemap-blog.xml",
    "/sitemap-categories.xml",
  ]) {
    const response = await fetch(`${baseUrl}${sitemap}`);
    const xml = await response.text();
    for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      urls.add(toPath(match[1]));
    }
  }
  return [...urls];
}

async function crawl() {
  const queue = await extractSitemapUrls();
  for (const path of importantPaths) {
    if (!queue.includes(path)) queue.push(path);
  }

  while (queue.length > 0) {
    const path = queue.shift();
    const url = normalizeUrl(path);
    if (seen.has(url) || seen.size > 260) continue;
    seen.add(url);

    const response = await fetchManual(url);
    if (response.status >= 300 && response.status < 400) {
      redirectChains.push({ url, status: response.status, location: response.headers.get("location") });
      continue;
    }
    if (!response.ok) {
      brokenLinks.push({ from: "crawl", href: url, status: response.status });
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) continue;

    const html = await response.text();
    htmlPages.set(toPath(url), html);
    const $ = cheerio.load(html);

    const links = $("a[href]")
      .map((_, element) => $(element).attr("href"))
      .get()
      .filter(isInternalHref)
      .map((href) => toPath(normalizeUrl(href)));

    for (const href of links) {
      const linksFrom = inbound.get(href) ?? new Set();
      linksFrom.add(toPath(url));
      inbound.set(href, linksFrom);
      if (!seen.has(normalizeUrl(href)) && !href.startsWith("/api/")) queue.push(href);
    }

    auditHtml(toPath(url), $);
  }
}

function addDuplicate(map, value, path) {
  if (!value) return;
  const list = map.get(value) ?? [];
  list.push(path);
  map.set(value, list);
}

function scriptTypes(data) {
  const type = data?.["@type"];
  if (Array.isArray(type)) return type;
  return type ? [type] : [];
}

function auditHtml(path, $) {
  const title = $("title").first().text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const canonical = $('link[rel="canonical"]').attr("href") ?? "";
  const robots = $('meta[name="robots"]').attr("content") ?? "";
  const ogTitle = $('meta[property="og:title"]').attr("content") ?? "";
  const twitterCard = $('meta[name="twitter:card"]').attr("content") ?? "";
  const h1Count = $("h1").length;
  const imagesMissingAlt = $("img").filter((_, img) => !$(img).attr("alt")).length;

  addDuplicate(titles, title, path);
  addDuplicate(descriptions, description, path);
  addDuplicate(canonicals, canonical, path);

  if (!title) metadataIssues.push({ path, issue: "Missing title" });
  if (!description) metadataIssues.push({ path, issue: "Missing meta description" });
  if (!canonical) metadataIssues.push({ path, issue: "Missing canonical" });
  if (!robots) metadataIssues.push({ path, issue: "Missing robots meta" });
  if (!ogTitle) metadataIssues.push({ path, issue: "Missing Open Graph title" });
  if (!twitterCard) metadataIssues.push({ path, issue: "Missing Twitter card" });
  if (h1Count !== 1) a11yIssues.push({ path, issue: `Expected one H1, found ${h1Count}` });
  if (imagesMissingAlt > 0) a11yIssues.push({ path, issue: `${imagesMissingAlt} images missing alt text` });

  $("a[href]").each((_, element) => {
    const text = $(element).text().trim();
    const aria = $(element).attr("aria-label");
    if (!text && !aria) a11yIssues.push({ path, issue: "Icon/link missing accessible name" });
  });

  const schemas = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).text());
      if (Array.isArray(parsed)) schemas.push(...parsed);
      else schemas.push(parsed);
    } catch {
      jsonLdIssues.push({ path, issue: "Invalid JSON-LD" });
    }
  });

  if (schemas.length === 0) jsonLdIssues.push({ path, issue: "Missing JSON-LD" });

  const types = new Set(schemas.flatMap(scriptTypes));
  if (path === "/" && (!types.has("Organization") || !types.has("WebSite"))) {
    jsonLdIssues.push({ path, issue: "Home missing Organization or WebSite schema" });
  }
  if (path.startsWith("/tools/") && !types.has("SoftwareApplication")) {
    jsonLdIssues.push({ path, issue: "Tool page missing SoftwareApplication schema" });
  }
  if (path.startsWith("/categories/") && !types.has("CollectionPage")) {
    jsonLdIssues.push({ path, issue: "Category page missing CollectionPage schema" });
  }
  if (path.startsWith("/blog/") && path !== "/blog" && !types.has("Article")) {
    jsonLdIssues.push({ path, issue: "Blog post missing Article schema" });
  }
}

async function verifyLinks() {
  for (const [path, html] of htmlPages) {
    const $ = cheerio.load(html);
    const links = $("a[href]")
      .map((_, element) => $(element).attr("href"))
      .get()
      .filter(isInternalHref)
      .map((href) => normalizeUrl(href));

    for (const link of new Set(links)) {
      const response = await fetchManual(link);
      if (response.status >= 300 && response.status < 400) {
        redirectChains.push({ from: path, url: link, status: response.status, location: response.headers.get("location") });
      } else if (!response.ok) {
        brokenLinks.push({ from: path, href: link, status: response.status });
      }
    }
  }
}

function duplicates(map) {
  return [...map.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([value, paths]) => ({ value, paths }));
}

async function main() {
  await checkImportantRoutes();
  await crawl();
  await verifyLinks();

  const sitemapUrls = await extractSitemapUrls();
  const orphanPages = sitemapUrls.filter((path) => path !== "/" && !inbound.has(path));

  const report = {
    routeStatuses,
    crawledHtmlPages: htmlPages.size,
    brokenLinks,
    redirectChains,
    metadataIssues,
    jsonLdIssues,
    a11yIssues,
    duplicateTitles: duplicates(titles),
    duplicateDescriptions: duplicates(descriptions),
    duplicateCanonicals: duplicates(canonicals),
    orphanPages,
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
