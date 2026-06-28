"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, tools } from "@/constants/tools";
import { useToolSearch } from "@/hooks/use-tool-search";
import type { ToolCategorySlug } from "@/types/tool";
import { ToolCard } from "@/components/tools/tool-card";

type ActiveCategory = ToolCategorySlug | "all";

export function SearchToolsSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("all");
  const filteredTools = useToolSearch({
    tools,
    query,
    category: activeCategory,
  });

  const displayedTools = filteredTools.slice(0, 12);
  const hasResults = displayedTools.length > 0;

  return (
    <section id="tools-search" className="border-y bg-card/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Search tools"
          title="Find the exact utility for the job"
          description="Filter by category, search by task, and open focused tool pages from a responsive directory layout."
          icon={Search}
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <form role="search" className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search PDF, image, AI, developer, calculator..."
              aria-label="Search all tools"
              className="h-12 pl-11 pr-4 text-base"
            />
          </form>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            <SlidersHorizontal aria-hidden="true" />
            All
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.slug;

            return (
              <Button
                key={category.slug}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.slug)}
              >
                <Icon aria-hidden="true" />
                {category.title}
              </Button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <p aria-live="polite">
            Showing {displayedTools.length} of {filteredTools.length} matching
            tools
          </p>
          {query || activeCategory !== "all" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
            >
              Reset filters
            </Button>
          ) : null}
        </div>

        {hasResults ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                slug={tool.slug}
                category={tool.category}
                href={tool.href}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border bg-background p-10 text-center">
            <Search
              aria-hidden="true"
              className="mx-auto size-10 text-muted-foreground"
            />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No tools found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term or clear the selected category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
