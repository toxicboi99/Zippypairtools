import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { PDFToolsWorkspace } from "@/frontend/components/pdf/pdf-tools-workspace";
import { SummarizeWorkspace } from "@/frontend/components/ai/summarize-workspace";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { getPDFToolConfig } from "@/frontend/constants/pdf-tools";
import {
  JsonLdScript,
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
} from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";
import { categories, getToolBySlug, tools } from "@/frontend/constants/tools";
import { getToneForCategoryTitle } from "@/frontend/utils/category-tones";
import { cn } from "@/frontend/utils/cn";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return tools
    .filter((tool) => !tool.slug.includes("/"))
    .map((tool) => ({
      slug: tool.slug,
    }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.title,
    description: tool.description,
    keywords: [tool.title, tool.category, ...tool.keywords],
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
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
            { name: tool.category, path: "/#categories" },
            { name: tool.title, path },
          ]),
          faqSchema(faqs),
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
                  href="/#categories"
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
