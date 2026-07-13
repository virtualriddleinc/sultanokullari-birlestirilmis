import "server-only";

import { getPayloadClient } from "@/lib/payload";

export type SiteMediaItem = {
  id: string;
  title: string;
  kind: "foto" | "video";
  date: string;
  tags: string[];
  caption: string;
  alt: string;
  url: string;
  mimeType?: string;
};

type FetchOptions = {
  draft?: boolean;
};

function toIsoDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export async function getPublishedMediaItems(
  options: FetchOptions = {},
): Promise<SiteMediaItem[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "media-items",
      where: options.draft
        ? {}
        : {
            _status: {
              equals: "published",
            },
          },
      sort: "-date",
      limit: 200,
      depth: 1,
      draft: options.draft,
    });

    const mapped: SiteMediaItem[] = [];

    for (const doc of result.docs) {
      const media =
        doc.media && typeof doc.media === "object" ? doc.media : null;
      const url =
        media && "url" in media && media.url
          ? String(media.url)
          : media && "filename" in media && media.filename
            ? `/api/media/file/${media.filename}`
            : "";
      if (!url) continue;

      mapped.push({
        id: String(doc.id),
        title: doc.title,
        kind: doc.kind === "video" ? "video" : "foto",
        date: toIsoDate(doc.date),
        tags: Array.isArray(doc.tags)
          ? doc.tags
              .map((t) => (t?.tag ? String(t.tag).trim() : ""))
              .filter(Boolean)
          : [],
        caption: doc.caption?.trim() || "",
        alt: doc.alt || doc.title,
        url,
        mimeType: media?.mimeType ?? undefined,
      });
    }

    return mapped;
  } catch (error) {
    console.warn("[media-items-data] Medya arşivi yüklenemedi:", error);
    return [];
  }
}
