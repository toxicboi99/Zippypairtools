import { CategorySections } from "@/frontend/components/sections/category-sections";
import { HeroSection } from "@/frontend/components/sections/hero-section";
import { PopularToolsSection } from "@/frontend/components/sections/popular-tools-section";
import { SearchToolsSection } from "@/frontend/components/sections/search-tools-section";
import { Card, CardContent } from "@/frontend/components/ui/card";
import {
  JsonLdScript,
  buildPageMetadata,
  faqSchema,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";
import { categories } from "@/frontend/constants/tools";

export const metadata = buildPageMetadata({
  title: "ZippyPair Tools",
  description: siteConfig.description,
  path: "/",
  keywords: [
    "free online tools",
    "PDF tools",
    "image tools",
    "AI writing tools",
    "developer tools",
    "calculators",
    "converters",
  ],
});

const homeFaqs = [
  {
    question: "What is ZippyPair Tools?",
    answer:
      "ZippyPair Tools is a free online toolbox for PDF, image, media, AI writing, developer, calculator, conversion, security, text, SEO, social, and file workflows.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "No. ZippyPair Tools is designed for browser-based workflows with focused inputs, clear settings, and reviewable results.",
  },
  {
    question: "Which tools should I start with?",
    answer:
      "Popular starting points include PDF Merge, PDF Split, Compress PDF, JPG to PDF, Remove Background, JSON Formatter, Password Generator, and Summarize.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLdScript
        data={[
          organizationSchema,
          websiteSchema,
          softwareApplicationSchema({
            name: siteConfig.name,
            description: siteConfig.description,
            path: "/",
            keywords: categories.map((category) => category.title),
          }),
          faqSchema(homeFaqs),
        ]}
      />
      <HeroSection />
      <SearchToolsSection />
      <PopularToolsSection />
      <CategorySections />
      <section className="py-16 sm:py-20" aria-labelledby="home-ai-answers">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">Quick answers</p>
            <h2
              id="home-ai-answers"
              className="mt-3 text-3xl font-semibold tracking-normal text-foreground"
            >
              What ZippyPair Tools helps you do
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Use ZippyPair Tools when you need a fast, browser-based utility
              for documents, images, media, AI writing, code formatting,
              calculations, conversions, SEO checks, text cleanup, social
              workflows, file handling, or security values.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {homeFaqs.map((item) => (
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
        </div>
      </section>
    </>
  );
}
