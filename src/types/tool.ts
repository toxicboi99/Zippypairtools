import type { LucideIcon } from "lucide-react";

export type ToolCategorySlug =
  | "pdf"
  | "image"
  | "video"
  | "ai"
  | "developer"
  | "calculator"
  | "conversion"
  | "security";

export type CategoryTone = "primary" | "teal" | "amber" | "rose" | "orange";

export interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  category: string;
}

export interface Tool extends ToolCardProps {
  categorySlug: ToolCategorySlug;
  keywords: string[];
  popular?: boolean;
}

export interface ToolCategory {
  title: string;
  slug: ToolCategorySlug;
  description: string;
  icon: LucideIcon;
  tone: CategoryTone;
}

export interface SiteStat {
  label: string;
  value: string;
  description: string;
}
