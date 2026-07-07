import type { Metadata } from "next";
import { createElement } from "react";

import { siteConfig } from "@/frontend/constants/site";

export type JsonLd = Record<string, unknown>;

export interface FaqItem {
  question: string;
  answer: string;
}

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  category = "Online Tools",
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  category?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const image = {
    url: "/opengraph-image.svg",
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} preview image`,
  };

  return {
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    category,
    keywords: Array.from(
      new Set([
        siteConfig.shortName,
        siteConfig.name,
        "free online tools",
        ...keywords,
      ]),
    ),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const organizationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.organization,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.contactEmail,
  founder: {
    "@type": "Person",
    name: siteConfig.creator,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: siteConfig.contactEmail,
    availableLanguage: ["English"],
  },
};

export const websiteSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@id": `${siteConfig.url}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const webApplicationSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${siteConfig.url}/#web-application`,
  name: siteConfig.name,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  url: siteConfig.url,
  description: siteConfig.description,
  isAccessibleForFree: true,
  creator: {
    "@type": "Person",
    name: siteConfig.creator,
  },
  publisher: {
    "@id": `${siteConfig.url}/#organization`,
  },
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  };
}

export function collectionPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
  };
}

export function itemListSchema(
  items: Array<{ name: string; path: string; description?: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.path),
      name: item.name,
      description: item.description,
    })),
  };
}

export function imageObjectSchema({
  name,
  path,
  caption,
}: {
  name: string;
  path: string;
  caption: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name,
    caption,
    url: absoluteUrl(path),
    contentUrl: absoluteUrl(path),
    width: 1200,
    height: 630,
  };
}

export function softwareApplicationSchema({
  name,
  description,
  path,
  category = "UtilitiesApplication",
  keywords = [],
}: {
  name: string;
  description: string;
  path: string;
  category?: string;
  keywords?: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: category,
    operatingSystem: "Any",
    keywords: keywords.join(", "),
    isAccessibleForFree: true,
    creator: {
      "@type": "Person",
      name: siteConfig.creator,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}
