import type { MetadataRoute } from "next";

import { siteConfig } from "@/frontend/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/dashboard/",
          "/private/",
          "/server-sitemap.xml",
        ],
      },
    ],
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      `${siteConfig.url}/sitemap-pages.xml`,
      `${siteConfig.url}/sitemap-tools.xml`,
      `${siteConfig.url}/sitemap-blog.xml`,
      `${siteConfig.url}/sitemap-categories.xml`,
      `${siteConfig.url}/sitemap-images.xml`,
    ],
    host: siteConfig.url,
  };
}
