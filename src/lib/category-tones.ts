import { categories } from "@/constants/tools";
import type { CategoryTone } from "@/types/tool";

export const categoryToneClasses: Record<
  CategoryTone,
  {
    badge: string;
    icon: string;
    panel: string;
    text: string;
  }
> = {
  primary: {
    badge: "border-primary/20 bg-primary/10 text-primary",
    icon: "border-primary/20 bg-primary/10 text-primary",
    panel: "border-primary/20 bg-primary/5",
    text: "text-primary",
  },
  teal: {
    badge: "border-chart-2/20 bg-chart-2/10 text-chart-2",
    icon: "border-chart-2/20 bg-chart-2/10 text-chart-2",
    panel: "border-chart-2/20 bg-chart-2/5",
    text: "text-chart-2",
  },
  amber: {
    badge: "border-chart-3/20 bg-chart-3/10 text-chart-3",
    icon: "border-chart-3/20 bg-chart-3/10 text-chart-3",
    panel: "border-chart-3/20 bg-chart-3/5",
    text: "text-chart-3",
  },
  rose: {
    badge: "border-chart-4/20 bg-chart-4/10 text-chart-4",
    icon: "border-chart-4/20 bg-chart-4/10 text-chart-4",
    panel: "border-chart-4/20 bg-chart-4/5",
    text: "text-chart-4",
  },
  orange: {
    badge: "border-chart-5/20 bg-chart-5/10 text-chart-5",
    icon: "border-chart-5/20 bg-chart-5/10 text-chart-5",
    panel: "border-chart-5/20 bg-chart-5/5",
    text: "text-chart-5",
  },
};

export function getToneForCategoryTitle(title: string) {
  const category = categories.find((item) => item.title === title);

  return categoryToneClasses[category?.tone ?? "primary"];
}
