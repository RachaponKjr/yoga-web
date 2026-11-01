import type { MetadataRoute } from "next";
import { publicPages, SITE_URL } from "@/lib/seo";
import { contentSitemap } from "@/lib/sitemap-data";

// Revalidate the generated XML and public API data once per hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const api = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.yogabyniti.com/api/v1";
  const content = await contentSitemap(api, SITE_URL);
  return [
    ...publicPages.map((path) => ({
      url: new URL(path, SITE_URL).href,
      changeFrequency: (path === "/blog" || path === "/yoga-time" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...content,
  ];
}
