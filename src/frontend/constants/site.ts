import type { SiteStat } from "@/frontend/types/tool";

export const siteConfig = {
  name: "ZippyPair Tools",
  shortName: "ZippyPair",
  description:
    "A fast, production-ready online toolbox for documents, images, media, AI writing, developer utilities, calculators, conversions, and security helpers.",
  url: "https://zippypair.tools",
};

export const navLinks = [
  { label: "Search", href: "#tools-search" },
  { label: "Popular", href: "#popular" },
  { label: "Categories", href: "#categories" },
];

export const heroStats: SiteStat[] = [
  {
    label: "Categories",
    value: "8",
    description: "Focused groups for everyday work",
  },
  {
    label: "Featured tools",
    value: "50+",
    description: "Designed for quick repeat use",
  },
  {
    label: "Signup",
    value: "0",
    description: "Start from the homepage",
  },
];

export const footerColumns = [
  {
    title: "Tools",
    links: [
      { label: "PDF tools", href: "#categories" },
      { label: "Image tools", href: "#categories" },
      { label: "Developer tools", href: "#categories" },
      { label: "Security tools", href: "#categories" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Popular tools", href: "#popular" },
      { label: "Search", href: "#tools-search" },
      { label: "Categories", href: "#categories" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];
