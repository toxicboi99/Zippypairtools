import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import {
  expandedTools,
  getExpandedCategory,
  getExpandedTool,
  getRelatedExpandedTools,
} from "@/data/expanded-tools";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/constants/site";

const ExpandedToolWorkspace = dynamic(
  () =>
    import("@/components/tools/expanded-tool-workspace").then(
      (mod) => mod.ExpandedToolWorkspace,
    ),
  {
    loading: () => (
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border bg-card p-6">
          <div className="h-6 w-44 rounded bg-muted" />
          <div className="mt-5 h-72 rounded-lg bg-muted/70" />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="h-5 w-28 rounded bg-muted" />
          <div className="mt-5 space-y-3">
            <div className="h-11 rounded bg-muted/70" />
            <div className="h-11 rounded bg-muted/70" />
          </div>
        </div>
      </div>
    ),
  },
);

interface ExpandedToolPageProps {
  params: Promise<{
    slug: string;
    tool: string;
  }>;
}

export function generateStaticParams() {
  return expandedTools.map((tool) => ({
    slug: tool.categorySlug,
    tool: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: ExpandedToolPageProps): Promise<Metadata> {
  const { slug, tool: toolSlug } = await params;
  const tool = getExpandedTool(slug, toolSlug);

  if (!tool) return {};

  const path = `/tools/${tool.categorySlug}/${tool.slug}`;
  const title = `${tool.title} | ${siteConfig.name}`;

  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: tool.description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: tool.description,
    },
  };
}

export default async function ExpandedToolPage({
  params,
}: ExpandedToolPageProps) {
  const { slug, tool: toolSlug } = await params;
  const tool = getExpandedTool(slug, toolSlug);

  if (!tool) {
    notFound();
  }

  const categoryData = getExpandedCategory(tool.categorySlug);
  const relatedTools = getRelatedExpandedTools(tool);
  const path = `${siteConfig.url}/tools/${tool.categorySlug}/${tool.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    url: path,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/#categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to categories
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <Badge variant="outline" className="mb-5">
                {tool.category}
              </Badge>
              <div className="flex items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Sparkles aria-hidden="true" className="size-7" />
                </span>
                <div>
                  <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                    {tool.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>

            <aside>
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                    Category
                  </h2>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {categoryData?.title ?? tool.category}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {categoryData?.description}
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>

          <ExpandedToolWorkspace tool={tool} relatedTools={relatedTools} />
        </div>
      </section>
    </>
  );
}
