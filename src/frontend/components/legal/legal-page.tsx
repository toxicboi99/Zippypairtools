import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { JsonLdScript, breadcrumbSchema, faqSchema } from "@/frontend/constants/seo";
import type { LegalPage as LegalPageData } from "@/frontend/constants/legal-pages";
import { Card, CardContent } from "@/frontend/components/ui/card";

export function LegalPage({ page }: { page?: LegalPageData }) {
  if (!page) {
    notFound();
  }

  const faqs = page.faqs ?? [
    {
      question: `What is the purpose of the ${page.title} page?`,
      answer: page.description,
    },
    {
      question: "How can I contact ZippyPair Tools about this page?",
      answer:
        "Use the contact page or support email listed on the site to ask policy, privacy, copyright, accessibility, or product questions.",
    },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.title, path: `/${page.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Updated {page.updated}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {page.description}
          </p>

          <div className="mt-10 space-y-6">
            {page.sections.map((section) => (
              <Card key={section.heading}>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="mt-10" aria-labelledby="page-faqs">
            <h2 id="page-faqs" className="text-2xl font-semibold text-foreground">
              Quick answers
            </h2>
            <div className="mt-5 space-y-4">
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

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Browse tools
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Read FAQs
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
