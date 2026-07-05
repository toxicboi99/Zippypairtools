import type { LucideIcon } from "lucide-react";

import { Badge } from "@/frontend/components/ui/badge";
import { cn } from "@/frontend/utils/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <Badge
        variant="outline"
        className="mb-4 border-primary/20 bg-primary/10 text-primary"
      >
        {Icon ? <Icon aria-hidden="true" /> : null}
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
