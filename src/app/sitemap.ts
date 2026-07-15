import type { MetadataRoute } from "next";

import { STATIC_SITE_ROUTES } from "@/lib/seo/static-routes";
import { absoluteUrl } from "@/lib/seo/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_SITE_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  // Dinamik import: payload.config → assertCmsEnv import-time throw'u
  // buradaki try/catch tarafından yakalanabilsin (statik import yakalanamaz).
  try {
    const { getAllPublishedSlugs } = await import("@/lib/guncel-data");
    const { news, events } = await getAllPublishedSlugs();
    const dynamicEntries: MetadataRoute.Sitemap = [
      ...news.map((slug) => ({
        url: absoluteUrl(`/guncel/haberler/${slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...events.map((slug) => ({
        url: absoluteUrl(`/guncel/etkinlikler/${slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
    return [...staticEntries, ...dynamicEntries];
  } catch {
    return staticEntries;
  }
}
