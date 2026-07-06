import type { MetadataRoute } from "next";

import {
  staticPageEntries,
  toMetadataSitemap,
  toolEntries,
} from "@/frontend/lib/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return toMetadataSitemap([...staticPageEntries, ...toolEntries]);
}
