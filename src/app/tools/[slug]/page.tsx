import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Boxes, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { PDFToolsWorkspace } from "@/frontend/components/pdf/pdf-tools-workspace";
import { SummarizeWorkspace } from "@/frontend/components/ai/summarize-workspace";
import { ShareFilesWorkspace } from "@/frontend/components/tools/share-files-workspace";
import { LinkToQrWorkspace } from "@/frontend/components/tools/link-to-qr-workspace";
import { SyncClipboardWorkspace } from "@/frontend/components/tools/sync-clipboard-workspace";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { getPDFToolConfig } from "@/frontend/constants/pdf-tools";
import {
  JsonLdScript,
  breadcrumbSchema,
  buildPageMetadata,
  collectionPageSchema,
  faqSchema,
  howToSchema,
  imageObjectSchema,
  itemListSchema,
  softwareApplicationSchema,
} from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";
import { categories, getToolBySlug, tools } from "@/frontend/constants/tools";
import {
  getCategoryByRouteSlug,
  getCategoryToolPaths,
} from "@/frontend/lib/sitemap";
import { getToneForCategoryTitle } from "@/frontend/utils/category-tones";
import { cn } from "@/frontend/utils/cn";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CategoryLandingPageProps {
  slug: string;
  category: {
    title: string;
    description: string;
  };
}

export function generateStaticParams() {
  return Array.from(
    new Set([
      ...tools.filter((tool) => !tool.slug.includes("/")).map((tool) => tool.slug),
      ...categories.map((category) => category.slug),
    ]),
  ).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (tool) {
    return buildPageMetadata({
      title: tool.title,
      description: tool.description,
      path: `/tools/${tool.slug}`,
      keywords: [tool.title, tool.category, ...tool.keywords],
      category: tool.category,
    });
  }

  const category = getCategoryByRouteSlug(slug);

  if (category) {
      return buildPageMetadata({
        title: category.title,
        description: `${category.description} Browse related ${category.title.toLowerCase()} on ${siteConfig.name}.`,
      path: `/categories/${slug}`,
      keywords: [category.title, siteConfig.name, "tool category", "online tools"],
      category: category.title,
    });
  }

    return {};
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    const categoryData = getCategoryByRouteSlug(slug);

    if (!categoryData) {
      notFound();
    }

    return <CategoryLandingPage slug={slug} category={categoryData} />;
  }

  const category = categories.find((item) => item.slug === tool.categorySlug);
  const tone = getToneForCategoryTitle(tool.category);
  const Icon = tool.icon;
  const pdfToolConfig = getPDFToolConfig(tool.slug);
  const relatedTools = tools
    .filter(
      (item) =>
        item.categorySlug === tool.categorySlug && item.slug !== tool.slug,
    )
    .slice(0, 3);
  const path = `/tools/${tool.slug}`;
  const faqs = [
    {
      question: `What is ${tool.title}?`,
      answer: `${tool.title} is a free ${tool.category.toLowerCase()} utility on ${siteConfig.name}. It helps users ${tool.description.toLowerCase()}`,
    },
    {
      question: `How do I use ${tool.title}?`,
      answer:
        "Open the tool workspace, add the required file or text, review available settings, run the workflow, and check the result before downloading or copying it.",
    },
    {
      question: `Is ${tool.title} free?`,
      answer:
        "Yes. ZippyPair Tools is designed as a free online toolbox for common productivity workflows.",
    },
  ];
  const detailSections = [
    {
      heading: `About ${tool.title}`,
      body: `${tool.title} is part of the ${tool.category} collection on ${siteConfig.name}. The page is built around a focused task: help you understand what input is needed, choose the right settings, run the workflow, and review the result before using it elsewhere. This keeps the page useful for people searching for a specific utility and for answer engines that need a clear definition of what the tool does.`,
    },
    {
      heading: "Key features",
      body: `The workspace emphasizes clear labels, predictable actions, responsive layout, keyboard-accessible controls, and visible states for input, processing, output, and history. Related ${tool.category.toLowerCase()} tools are linked nearby so you can continue the broader workflow without returning to search results.`,
    },
    {
      heading: "Benefits",
      body: `Use ${tool.title} when you want a fast browser-based utility without installing desktop software or creating an account. The page is structured to support quick scanning, practical decision-making, and careful output review for students, creators, teams, developers, marketers, and small businesses.`,
    },
    {
      heading: "How it works",
      body: "Start by confirming the page matches your task, then add the required file, text, URL, or values. Review the available settings, run the workflow, and inspect the preview or result panel. For important work, compare the output with your source material before publishing, submitting, sharing, or archiving it.",
    },
    {
      heading: "Privacy information",
      body: `Only provide content you have the right to process. Avoid uploading confidential, regulated, or highly sensitive information unless you are comfortable using an online utility for that material. ZippyPair keeps public guidance focused on transparent workflows, reviewable outputs, and responsible use.`,
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
            { name: tool.category, path: `/categories/${tool.categorySlug}` },
            { name: tool.title, path },
          ]),
          faqSchema(faqs),
          howToSchema({
            name: `How to use ${tool.title}`,
            description: `A simple workflow for using ${tool.title} on ${siteConfig.name}.`,
            steps: [
              "Open the tool page and confirm it matches the task you want to complete.",
              "Add the file, text, URL, or values required by the workspace.",
              "Review available settings before running the workflow.",
              "Check the output carefully before copying, downloading, or sharing it.",
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
          <Button asChild variant="ghost" size="sm">
            <Link href="/#popular">
              <ArrowLeft aria-hidden="true" />
              Back to tools
            </Link>
          </Button>

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
                  href={`/categories/${tool.categorySlug}`}
                  className="transition hover:text-foreground"
                >
                  {tool.category}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{tool.title}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <Badge variant="outline" className={cn("mb-5", tone.badge)}>
              {tool.category}
            </Badge>
            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-lg border",
                  tone.icon,
                )}
              >
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <div>
                <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                  {tool.title}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>

            {pdfToolConfig ? (
              <PDFToolsWorkspace slug={tool.slug} />
            ) : slug === "summarize" ? (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Tool workspace
                  </h2>
                  <SummarizeWorkspace />
                </CardContent>
              </Card>
            ) : slug === "share-files" ? (
              <ShareFilesWorkspace />
            ) : slug === "link-to-qr" ? (
              <LinkToQrWorkspace />
            ) : slug === "sync-clipboard" ? (
              <SyncClipboardWorkspace />
            ) : (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Tool workspace
                  </h2>
                  <div className="mt-5 rounded-lg border bg-background p-6">
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <Icon
                        aria-hidden="true"
                        className={cn("size-10", tone.text)}
                      />
                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        {tool.title} workspace
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Add files, paste content, choose options, and review
                        results from one focused workspace.
                      </p>
                      <Button className="mt-5">
                        Start workflow
                        <ArrowRight aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                  Category
                </h2>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {category?.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {category?.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                  Ready states
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {["Upload", "Processing", "Result", "History"].map(
                    (state) => (
                      <li key={state} className="flex items-center gap-2">
                        <CheckCircle2
                          aria-hidden="true"
                          className="size-4 text-chart-2"
                        />
                        {state}
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Best for",
                text: `${tool.title} works well for fast ${tool.category.toLowerCase()} tasks where you want a focused input, clear settings, and a reviewable result.`,
              },
              {
                title: "Benefits",
                text: "Use it from the browser, keep the workflow simple, and move from input to output without installing extra software.",
              },
              {
                title: "Review step",
                text: "Always check the result before using it in important documents, publishing workflows, or client deliverables.",
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

          <section className="mt-12" aria-labelledby="tool-details">
            <h2 id="tool-details" className="text-2xl font-semibold text-foreground">
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

          <section className="mt-12" aria-labelledby="tool-faqs">
            <h2 id="tool-faqs" className="text-2xl font-semibold text-foreground">
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

          {relatedTools.length > 0 ? (
            <div className="mt-12">
            <h2 className="text-2xl font-semibold text-foreground">
              Related tools
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedTools.map((item) => {
                const RelatedIcon = item.icon;
                const relatedTone = getToneForCategoryTitle(item.category);

                return (
                  <Link
                    key={item.slug}
                    href={item.href ?? `/tools/${item.slug}`}
                    className="rounded-lg border bg-card p-4 transition hover:border-primary/40"
                  >
                    <RelatedIcon
                      aria-hidden="true"
                      className={cn("size-5", relatedTone.text)}
                    />
                    <h3 className="mt-3 font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function CategoryLandingPage({ slug, category }: CategoryLandingPageProps) {
  const categoryTools = getCategoryToolPaths(slug);
  const path = `/tools/${slug}`;
  const faqs = [
    {
      question: `What are ${category.title}?`,
      answer: `${category.title} on ${siteConfig.name} are grouped utilities for ${category.description.toLowerCase()}`,
    },
    {
      question: "How should I choose a tool?",
      answer:
        "Start with the exact output you need, open the closest tool page, review its description and settings, then test the result before using it in important work.",
    },
    {
      question: "Are these tools connected to related pages?",
      answer:
        "Yes. Category pages link to matching tool pages, and each tool page links back through breadcrumbs and related tool cards.",
    },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          collectionPageSchema({
            name: category.title,
            description: category.description,
            path,
          }),
          itemListSchema(categoryTools),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/#categories" },
            { name: category.title, path },
          ]),
          faqSchema(faqs),
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
                <Link href="/#categories" className="transition hover:text-foreground">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{category.title}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <Badge variant="outline" className="mb-5">
                Tool category
              </Badge>
              <div className="flex items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Boxes aria-hidden="true" className="size-7" />
                </span>
                <div>
                  <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                    {category.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                    {category.description} This collection helps users move
                    from a broad task family to the exact tool page with fewer
                    clicks and clearer search context.
                  </p>
                </div>
              </div>
            </div>

            <aside>
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground">
                    Included tools
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {categoryTools.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Every important page in this category is linked here to
                    reduce orphan-page risk and improve crawl discovery.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "What this category covers",
                text: `${category.title} collect related workflows so users and search engines can understand the entity group, compare options, and move to a specific utility page.`,
              },
              {
                title: "How to use the collection",
                text: "Scan the tool names, choose the page that matches your intended input and output, then use breadcrumbs or related tools to continue the workflow.",
              },
              {
                title: "Privacy and review",
                text: "Review tool descriptions before adding files, text, or URLs. Avoid highly sensitive inputs unless you are comfortable using an online utility.",
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

          <section className="mt-12" aria-labelledby="category-tool-list">
            <h2 id="category-tool-list" className="text-2xl font-semibold text-foreground">
              Browse {category.title}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="rounded-lg border bg-card p-5 transition hover:border-primary/40"
                >
                  <ArrowRight aria-hidden="true" className="size-5 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {tool.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="category-faqs">
            <h2 id="category-faqs" className="text-2xl font-semibold text-foreground">
              {category.title} FAQs
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
