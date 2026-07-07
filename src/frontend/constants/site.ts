import type { SiteStat } from "@/frontend/types/tool";

export const siteConfig = {
  name: "ZippyPair Tools",
  shortName: "ZippyPair",
  organization: "ZippyPair",
  publisher: "ZippyPair",
  author: "Ritesh Prasad Sah",
  creator: "Ritesh Prasad Sah",
  copyright: "© 2026 ZippyPair. All Rights Reserved.",
  description:
    "A fast, production-ready online toolbox for documents, images, media, AI writing, developer utilities, calculators, conversions, and security helpers.",
  url: "https://zippypair.online",
  domain: "zippypair.online",
  contactEmail: "support@zippypair.online",
  gtmId: "GTM-KCDNRPCX",
};

export const navLinks = [
  { label: "Search", href: "/#tools-search" },
  { label: "Popular", href: "/#popular" },
  { label: "Categories", href: "/#categories" },
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
      { label: "PDF tools", href: "/categories/pdf" },
      { label: "Image tools", href: "/categories/image" },
      { label: "Developer tools", href: "/categories/developer" },
      { label: "Security tools", href: "/categories/security" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Popular tools", href: "/#popular" },
      { label: "Search", href: "/#tools-search" },
      { label: "Categories", href: "/#categories" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms-and-conditions" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Cookies", href: "/cookie-policy" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Content Policy", href: "/content-policy" },
      { label: "Advertising Policy", href: "/advertising-policy" },
      { label: "DMCA", href: "/dmca" },
      { label: "Community Guidelines", href: "/community-guidelines" },
    ],
  },
];
