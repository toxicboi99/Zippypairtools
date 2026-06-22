import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getToneForCategoryTitle } from "@/lib/category-tones";
import { cn } from "@/lib/utils";
import type { ToolCardProps } from "@/types/tool";

export function ToolCard({
  title,
  description,
  icon: Icon,
  slug,
  category,
}: ToolCardProps) {
  const tone = getToneForCategoryTitle(category);

  return (
    <Card className="group h-full overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-lg border",
              tone.icon,
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <Badge variant="outline" className={cn("max-w-36", tone.badge)}>
            <span className="truncate">{category}</span>
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight text-foreground">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <Link
          href={`/tools/${slug}`}
          aria-label={`Open ${title}`}
          className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3"
        >
          Open tool
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
