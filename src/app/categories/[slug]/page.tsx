import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Boxes } from "lucide-react";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  JsonLdScript,
  breadcrumbSchema,
  buildPageMetadata,
  collectionPageSchema,
  faqSchema,
  itemListSchema,
} from "@/frontend/constants/seo";
import { categories } from "@/frontend/constants/tools";
import {
  getCategoryByRouteSlug,
  getCategoryToolPaths,
} from "@/frontend/lib/sitemap";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryByRouteSlug(slug);

  if (!category) return {};

  return buildPageMetadata({
    title: category.title,
    description: `${category.description} Browse related tools by category on ZippyPair Tools.`,
    path: `/categories/${slug}`,
    keywords: [category.title, "ZippyPair Tools", "online tool category"],
    category: category.title,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryByRouteSlug(slug);

  if (!category) {
    notFound();
  }

  const path = `/categories/${slug}`;
  const categoryTools = getCategoryToolPaths(slug);
  const faqs = [
    {
      question: `What is included in ${category.title}?`,
      answer: `${category.title} includes related ZippyPair Tools pages for users who want to compare options before opening a specific utility.`,
    },
    {
      question: "Why does this category page exist?",
      answer:
        "It creates a clear crawlable hub for internal linking, discovery, breadcrumbs, and answer-engine context.",
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
            { name: "Categories", path: "/#categories" },
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

          <div className="mt-8 flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Boxes aria-hidden="true" className="size-7" />
            </span>
            <div>
              <p className="text-sm font-medium text-primary">Category</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                {category.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                {category.description} Use this category hub to find matching
                tools, compare workflows, and continue to a focused utility page.
              </p>
            </div>
          </div>

          <section className="mt-12" aria-labelledby="category-tools">
            <h2 id="category-tools" className="text-2xl font-semibold text-foreground">
              Tools in this category
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
              Category FAQs
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
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
