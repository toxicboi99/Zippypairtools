import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  JsonLdScript,
  absoluteUrl,
  breadcrumbSchema,
  buildPageMetadata,
  imageObjectSchema,
} from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";
import { blogPosts, getBlogPost } from "@/frontend/data/blog-posts";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return {};

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: [post.category, ...post.keywords],
    category: post.category,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const path = `/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting"],
    headline: post.title,
    description: post.description,
    url: absoluteUrl(path),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: siteConfig.creator,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl("/opengraph-image.svg"),
    keywords: post.keywords.join(", "),
  };

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
          articleSchema,
          imageObjectSchema({
            name: `${post.title} preview image`,
            path: "/opengraph-image.svg",
            caption: post.description,
          }),
        ]}
      />
      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to blog
          </Link>

          <header className="mt-8">
            <p className="text-sm font-medium text-primary">{post.category}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {post.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="size-4" />
                Updated {post.updatedAt}
              </span>
              <span>By {siteConfig.creator}</span>
            </div>
          </header>

          <div className="mt-10 space-y-6">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-foreground">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Card className="mt-12">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Continue with a related page
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Open the matching ZippyPair Tools page to apply this guidance.
                </p>
              </div>
              <Link
                href={post.relatedHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                Open related page
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </article>
    </>
  );
}
