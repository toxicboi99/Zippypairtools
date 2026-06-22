import { Boxes } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { ToolCard } from "@/components/tools/tool-card";
import { Badge } from "@/components/ui/badge";
import { categories, tools } from "@/constants/tools";
import { categoryToneClasses } from "@/lib/category-tones";
import { cn } from "@/lib/utils";

export function CategorySections() {
  return (
    <section id="categories" className="border-t bg-card/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="A clean structure for every tool family"
          description="Each category is grouped around a familiar workflow, keeping the directory easy to scan across mobile, tablet, and desktop."
          icon={Boxes}
        />

        <div className="mt-12 space-y-12">
          {categories.map((category) => {
            const allCategoryTools = tools.filter(
              (tool) => tool.categorySlug === category.slug,
            );
            const categoryTools = allCategoryTools.slice(0, 4);
            const Icon = category.icon;
            const tone = categoryToneClasses[category.tone];

            return (
              <section
                key={category.slug}
                aria-labelledby={`${category.slug}-heading`}
                className={cn("rounded-lg border p-5 sm:p-6", tone.panel)}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex gap-4">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-lg border",
                        tone.icon,
                      )}
                    >
                      <Icon aria-hidden="true" className="size-6" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          id={`${category.slug}-heading`}
                          className="text-2xl font-semibold text-foreground"
                        >
                          {category.title}
                        </h3>
                        <Badge variant="outline" className={tone.badge}>
                          {allCategoryTools.length} tools
                        </Badge>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#tools-search"
                    className={cn(
                      "text-sm font-medium transition hover:opacity-80",
                      tone.text,
                    )}
                  >
                    Search this category
                  </a>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      slug={tool.slug}
                      category={tool.category}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
