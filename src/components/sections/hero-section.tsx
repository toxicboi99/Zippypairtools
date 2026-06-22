import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  Search,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { featuredSearches, popularTools } from "@/constants/tools";
import { heroStats, siteConfig } from "@/constants/site";
import { getToneForCategoryTitle } from "@/lib/category-tones";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const previewTools = popularTools.slice(0, 4);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-primary/10 via-background to-background" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles aria-hidden="true" />
            Curated SaaS toolbox
          </Badge>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Search, compare, and launch everyday utilities for documents,
            images, media, AI writing, development, calculations, conversion,
            and security from one polished SaaS surface.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#tools-search">
                Search tools
                <Search aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#categories">
                Browse categories
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" aria-label="Featured searches">
            {featuredSearches.map((term) => (
              <a
                key={term}
                href="#tools-search"
                className="rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {term}
              </a>
            ))}
          </div>

          <dl className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-card p-4">
                <dt className="text-xs font-medium uppercase text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                  {stat.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          aria-label="Tool directory preview"
          className="rounded-lg border bg-card p-4 shadow-2xl shadow-primary/10 sm:p-5"
        >
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileSearch aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Tool discovery
                </p>
                <p className="text-xs text-muted-foreground">
                  Fresh matches in one view
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto hidden sm:inline-flex">
                Live
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
              <Search aria-hidden="true" className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                remove background
              </span>
              <kbd className="ml-auto rounded border bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
                /
              </kbd>
            </div>

            <div className="mt-4 grid gap-3">
              {previewTools.map((tool) => {
                const tone = getToneForCategoryTitle(tool.category);
                const Icon = tool.icon;

                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition hover:border-primary/40 hover:bg-accent"
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg border",
                        tone.icon,
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {tool.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {tool.category}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock3 aria-hidden="true" className="size-4 text-primary" />
                  Fast launches
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Frequent tasks stay close at hand.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 text-chart-2"
                  />
                  Clean states
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Empty search and category filters are handled.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
