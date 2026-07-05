import { TrendingUp } from "lucide-react";

import { SectionHeading } from "@/frontend/components/sections/section-heading";
import { ToolCard } from "@/frontend/components/tools/tool-card";
import { popularTools } from "@/frontend/constants/tools";

export function PopularToolsSection() {
  return (
    <section id="popular" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular tools"
          title="High-frequency workflows, ready first"
          description="The most common document, image, AI, developer, calculator, and security tasks are surfaced for quick repeat use."
          icon={TrendingUp}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularTools.slice(0, 8).map((tool) => (
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
      </div>
    </section>
  );
}
