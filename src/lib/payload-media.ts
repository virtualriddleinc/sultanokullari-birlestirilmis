import type { Media } from "@/payload-types";
import type { SiteMedia } from "@/content/site-media";

export type PayloadMediaGroup = {
  kind?: "image" | "video" | null;
  media?: number | Media | null;
  src?: string | null;
  alt?: string | null;
  poster?: string | null;
};

function resolveUploadUrl(media: Media | number | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined;
  if (media.url) return media.url;
  if (media.filename) return `/api/media/file/${media.filename}`;
  return undefined;
}

export function mapPayloadMediaGroup(
  group: PayloadMediaGroup | null | undefined,
  fallback?: SiteMedia,
): SiteMedia | undefined {
  if (!group && fallback) return fallback;
  if (!group) return undefined;

  const uploadSrc = resolveUploadUrl(
    typeof group.media === "object" ? group.media : null,
  );
  const src = uploadSrc || group.src || fallback?.src;
  if (!src) return fallback;

  const kind = (group.kind || fallback?.kind || "image") as "image" | "video";
  const alt = group.alt || fallback?.alt || "";

  return {
    kind,
    src,
    alt,
    poster: group.poster || fallback?.poster,
  };
}

export function mapPayloadMediaGroups(
  groups: Array<{ media?: PayloadMediaGroup | null }> | null | undefined,
  fallbacks: readonly SiteMedia[] = [],
): SiteMedia[] {
  if (!groups?.length) return [...fallbacks];
  return groups.map((g, i) => mapPayloadMediaGroup(g.media, fallbacks[i])!).filter(Boolean);
}
