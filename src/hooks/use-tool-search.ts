"use client";

import { useMemo } from "react";

import type { Tool, ToolCategorySlug } from "@/types/tool";

interface UseToolSearchOptions {
  tools: Tool[];
  query: string;
  category: ToolCategorySlug | "all";
}

export function useToolSearch({
  tools,
  query,
  category,
}: UseToolSearchOptions) {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        category === "all" || tool.categorySlug === category;

      if (!normalizedQuery) {
        return matchesCategory;
      }

      const searchText = [
        tool.title,
        tool.description,
        tool.category,
        ...tool.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchText.includes(normalizedQuery);
    });
  }, [category, query, tools]);
}
