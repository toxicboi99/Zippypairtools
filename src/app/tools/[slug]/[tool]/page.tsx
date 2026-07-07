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
} from "@/frontend/data/expanded-tools";
import { getCanonicalCategoryPath } from "@/frontend/lib/sitemap";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  JsonLdScript,
  breadcrumbSchema,
  buildPageMetadata,
  faqSchema,
  howToSchema,
  imageObjectSchema,
  softwareApplicationSchema,
} from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";

const ExpandedToolWorkspace = dynamic(
  () =>
    import("@/frontend/components/tools/expanded-tool-workspace").then(
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

  return buildPageMetadata({
    title: `${tool.title} for ${tool.category}`,
    description: tool.description,
    path,
    keywords: [tool.title, tool.category, ...tool.keywords],
    category: tool.category,
  });
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
  const path = `/tools/${tool.categorySlug}/${tool.slug}`;
  const faqs = [
    {
      question: `What is ${tool.title}?`,
      answer: `${tool.title} is a free ${tool.category.toLowerCase()} utility that provides ${tool.description.toLowerCase()}`,
    },
    {
      question: `Who should use ${tool.title}?`,
      answer:
        "It is useful for people who need a quick browser-based workflow with clear inputs, settings, preview states, and copy-ready or download-ready output.",
    },
    {
      question: `Does ${tool.title} require installation?`,
      answer:
        "No. The tool is designed to run from the ZippyPair Tools website without installing desktop software.",
    },
  ];
  const detailSections = [
    {
      heading: `About ${tool.title}`,
      body: `${tool.title} is a focused ${tool.category.toLowerCase()} page on ${siteConfig.name}. It explains the task, provides a practical workspace, and gives search engines a clear entity relationship between the category, the tool, and related utility pages.`,
    },
    {
      heading: "Features",
      body: "The page includes a dedicated input area, settings, preview or result state, accessible form controls, related tools, FAQs, breadcrumbs, and a call-to-action for continuing the workflow.",
    },
    {
      heading: "Benefits",
      body: `Use ${tool.title} for quick browser-based work when you want a clear interface, fewer distractions, and a reviewable output. The page is designed for repeated everyday tasks on desktop and mobile screens.`,
    },
    {
      heading: "How it works",
      body: "Add the required input, adjust the visible settings, run the tool, then review the result before copying, downloading, publishing, or sharing it. For high-stakes work, compare the output with your source material.",
    },
    {
      heading: "Privacy information",
      body: "Do not submit confidential, regulated, or sensitive files unless you are comfortable using an online utility. Public guidance on ZippyPair Tools encourages responsible inputs, transparent review, and careful handling of outputs.",
    },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          softwareApplicationSchema({
            name: tool.title,
            description: tool.description,
            path,
            keywords: tool.keywords,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: categoryData?.title ?? tool.category,
              path: getCanonicalCategoryPath(tool.categorySlug),
            },
            { name: tool.title, path },
          ]),
          faqSchema(faqs),
          howToSchema({
            name: `How to use ${tool.title}`,
            description: `A simple workflow for using ${tool.title} on ${siteConfig.name}.`,
            steps: [
              "Open the tool page and read the task description.",
              "Add the required file, text, URL, or values.",
              "Adjust the available settings for the result you need.",
              "Run the workflow and review the output before using it.",
            ],
          }),
          imageObjectSchema({
            name: `${tool.title} preview image`,
            path: "/opengraph-image.svg",
            caption: `${tool.title} on ${siteConfig.name}`,
          }),
        ]}
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

          <nav
            aria-label="Breadcrumb"
            className="mt-5 text-sm text-muted-foreground"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={getCanonicalCategoryPath(tool.categorySlug)}
                  className="transition hover:text-foreground"
                >
                  {categoryData?.title ?? tool.category}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{tool.title}</li>
            </ol>
          </nav>

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

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Short answer",
                text: `${tool.title} helps you complete a focused ${tool.category.toLowerCase()} task from the browser with a clear input and output workflow.`,
              },
              {
                title: "Common use cases",
                text: "Use it for daily productivity, quick file or text preparation, repeatable team workflows, and fast checks before publishing or sharing work.",
              },
              {
                title: "Result review",
                text: "Review generated, converted, or processed output carefully before relying on it for client, legal, financial, academic, or production work.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <h2 className="font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mt-12" aria-labelledby="expanded-tool-details">
            <h2
              id="expanded-tool-details"
              className="text-2xl font-semibold text-foreground"
            >
              {tool.title} guide
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {detailSections.map((section) => (
                <Card key={section.heading}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground">
                      {section.heading}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {section.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="expanded-tool-faqs">
            <h2
              id="expanded-tool-faqs"
              className="text-2xl font-semibold text-foreground"
            >
              {tool.title} FAQs
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {faqs.map((item) => (
                <Card key={item.question}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
