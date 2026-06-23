import type { LucideIcon } from "lucide-react";

export type CategoryTone = "primary" | "teal" | "amber" | "rose" | "orange";

export type ToolCategorySlug =
  | "pdf"
  | "image"
  | "media"
  | "ai"
  | "developer"
  | "calculator"
  | "converter"
  | "security";

export interface ToolCategory {
  slug: ToolCategorySlug;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: CategoryTone;
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: ToolCategorySlug;
  icon: LucideIcon;
  keywords: string[];
  popular?: boolean;
}

export interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  category: string;
}

export interface SiteStat {
  label: string;
  value: string;
  description: string;
}
