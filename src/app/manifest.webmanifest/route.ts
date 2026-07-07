import { siteConfig } from "@/frontend/constants/site";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      name: siteConfig.name,
      short_name: siteConfig.shortName,
      description: siteConfig.description,
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#080b12",
      theme_color: "#22c55e",
      categories: ["productivity", "utilities", "business"],
      icons: [
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
