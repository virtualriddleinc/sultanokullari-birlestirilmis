import "server-only";

import type { PageStoryRow } from "@/components/layout/page-story-section";
import type { SiteMedia } from "@/content/site-media";
import type { PageMedia } from "@/lib/menu-images";
import { mapPayloadMediaGroup } from "@/lib/payload-media";
import type { Page } from "@/payload-types";

/** Payload tipleri regenerate edilene kadar overlay alanları için genişletilmiş Page */
export type PageWithOverlay = Page & {
  storyEyebrow?: string | null;
  storyMotto?: string | null;
  storyRows?: Array<{
    eyebrow?: string | null;
    text: string;
    highlights?: Array<{ text: string }> | null;
  }> | null;
  galleryTitle?: string | null;
  galleryDescription?: string | null;
  galleryItems?: Array<{ item?: unknown }> | null;
  heroMedia?: unknown;
  pathPrefix?: string | null;
  template?: string | null;
};

export type CmsOverlayContent = {
  title: string;
  intro?: string;
  story: {
    eyebrow: string;
    motto: string;
    rows: PageStoryRow[];
  };
  gallery: {
    title: string;
    description: string;
    items: SiteMedia[];
  };
  heroMedia?: SiteMedia;
};

export function fromPageMedia(media?: PageMedia): SiteMedia | undefined {
  if (!media) return undefined;
  return {
    kind: media.type,
    src: media.src,
    alt: media.alt,
    poster: media.poster,
  };
}

export function toPageMedia(media?: SiteMedia): PageMedia | undefined {
  if (!media) return undefined;
  return {
    src: media.src,
    type: media.kind,
    alt: media.alt,
    poster: media.poster,
  };
}

function mapStoryRows(page: PageWithOverlay): PageStoryRow[] {
  const rows = page.storyRows;
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return rows.map((row) => ({
    eyebrow: row.eyebrow ?? undefined,
    text: row.text,
    highlights: Array.isArray(row.highlights)
      ? row.highlights.map((h) => h.text).filter(Boolean)
      : [],
  }));
}

function mapGalleryItems(page: PageWithOverlay): SiteMedia[] {
  const items = page.galleryItems;
  if (!Array.isArray(items)) return [];
  return items
    .map((entry) =>
      mapPayloadMediaGroup(
        entry.item as Parameters<typeof mapPayloadMediaGroup>[0],
      ),
    )
    .filter((m): m is SiteMedia => Boolean(m));
}

/** CMS overlay alanlarını UI modeline çevirir; boş alanlarda fallback kullanır */
export function mapCmsOverlayContent(
  page: PageWithOverlay | Page | null,
  fallback: {
    title: string;
    intro?: string;
    story: { eyebrow: string; motto: string; rows: readonly PageStoryRow[] };
    gallery: {
      title: string;
      description: string;
      items?: readonly SiteMedia[];
    };
    heroMedia?: SiteMedia | PageMedia;
  },
): CmsOverlayContent {
  const heroFallback =
    fallback.heroMedia && "kind" in fallback.heroMedia
      ? fallback.heroMedia
      : fromPageMedia(fallback.heroMedia as PageMedia | undefined);

  if (!page) {
    return {
      title: fallback.title,
      intro: fallback.intro,
      story: {
        eyebrow: fallback.story.eyebrow,
        motto: fallback.story.motto,
        rows: [...fallback.story.rows],
      },
      gallery: {
        title: fallback.gallery.title,
        description: fallback.gallery.description,
        items: [...(fallback.gallery.items ?? [])],
      },
      heroMedia: heroFallback,
    };
  }

  const overlay = page as PageWithOverlay;
  const cmsRows = mapStoryRows(overlay);
  const cmsGallery = mapGalleryItems(overlay);
  const hero = mapPayloadMediaGroup(
    overlay.heroMedia as Parameters<typeof mapPayloadMediaGroup>[0],
    heroFallback,
  );

  return {
    title: overlay.title || fallback.title,
    intro: overlay.intro ?? fallback.intro,
    story: {
      eyebrow: overlay.storyEyebrow || fallback.story.eyebrow,
      motto: overlay.storyMotto || fallback.story.motto,
      rows: cmsRows.length > 0 ? cmsRows : [...fallback.story.rows],
    },
    gallery: {
      title: overlay.galleryTitle || fallback.gallery.title,
      description:
        overlay.galleryDescription || fallback.gallery.description,
      items:
        cmsGallery.length > 0
          ? cmsGallery
          : [...(fallback.gallery.items ?? [])],
    },
    heroMedia: hero ?? heroFallback,
  };
}
