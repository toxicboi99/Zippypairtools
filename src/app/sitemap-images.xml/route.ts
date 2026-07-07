import { buildImageSitemap, imageEntries, xmlResponse } from "@/frontend/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(buildImageSitemap(imageEntries));
}
