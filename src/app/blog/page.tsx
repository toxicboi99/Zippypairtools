import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  JsonLdScript,
  breadcrumbSchema,
  buildPageMetadata,
  faqSchema,
} from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";

export const metadata = buildPageMetadata({
  title: "ZippyPair Tools Blog",
  description:
    "Practical guides for using online PDF, image, AI, developer, calculator, conversion, SEO, and security tools responsibly.",
  path: "/blog",
  keywords: ["online tools blog", "PDF tools guide", "AI writing tools", "ZippyPair"],
});

const guides = [
  {
    title: "How to choose the right PDF workflow",
    description:
      "Use merge, split, compress, convert, and remove-page tools based on the exact document outcome you need.",
    href: "/tools/pdf-merge",
  },
  {
    title: "A quick checklist before using AI writing tools",
    description:
      "Set the audience, length, tone, and review standard before publishing AI-assisted summaries, rewrites, or translations.",
    href: "/tools/summarize",
  },
  {
    title: "What to check before uploading files online",
    description:
      "Review file sensitivity, ownership, output requirements, and whether a temporary online utility is appropriate for the task.",
    href: "/privacy-policy",
  },
];

const faqs = [
  {
    question: "Does ZippyPair Tools publish tool guides?",
    answer:
      "Yes. The blog hub collects practical guidance for choosing and using the site's online utilities responsibly.",
  },
  {
    question: "Are blog guides separate from the tools?",
    answer:
      "Yes. Guides explain workflows and safety checks, while tool pages provide the actual utility interfaces.",
  },
];

export default function BlogPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "ZippyPair Tools Blog",
            url: `${siteConfig.url}/blog`,
            publisher: {
              "@id": `${siteConfig.url}/#organization`,
            },
          },
        ]}
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">Guides</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              ZippyPair Tools Blog
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Practical, plain-language guidance for choosing tools, reviewing
              outputs, protecting files, and building faster everyday workflows.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group rounded-lg border bg-card p-5 transition hover:border-primary/40"
              >
                <FileText aria-hidden="true" className="size-5 text-primary" />
                <h2 className="mt-4 text-xl font-semibold text-foreground">
                  {guide.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Read guide
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>

          <section className="mt-12" aria-labelledby="blog-faqs">
            <h2 id="blog-faqs" className="text-2xl font-semibold text-foreground">
              Blog FAQs
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
                <Card key={item.question}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground">{item.question}</h3>
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
