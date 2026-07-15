import {
  branches as staticBranches,
  getBranchBySlug as getStaticBranchBySlug,
  type Branch,
} from "@/content/branches";
import { mapPayloadMediaGroup } from "@/lib/payload-media";
import { getPayloadClient } from "@/lib/payload";
import {
  branchPreviewMedia,
  branchGalleryMedia,
  galleryFromLevels,
} from "@/content/site-media";
import type { SiteMedia } from "@/content/site-media";

type FetchOptions = {
  draft?: boolean;
};

function mapCmsBranch(doc: Record<string, unknown>): Branch {
  const slug = doc.slug as string;
  const levelsRaw = doc.levels as Array<{ level?: string }> | undefined;
  const staticFallback = staticBranches.find((b) => b.slug === slug);
  const previewFallback = branchPreviewMedia[slug];

  const levels =
    (levelsRaw?.map((l) => l.level).filter(Boolean) as string[]) ||
    staticFallback?.levels ||
    [];

  // Galeri = okulun kademelerine göre Anaokulu/İlkokul/Ortaokul havuzu
  const levelGallery = galleryFromLevels(levels);
  const gallery =
    levelGallery.length > 0
      ? levelGallery
      : (branchGalleryMedia[slug] ?? staticFallback?.gallery ?? []);

  const preview = mapPayloadMediaGroup(
    doc.previewMedia as Parameters<typeof mapPayloadMediaGroup>[0],
    previewFallback,
  );

  return {
    slug,
    name: (doc.name as string) || staticFallback?.name || slug,
    city: (doc.city as string) || staticFallback?.city || "",
    district: (doc.district as string) || staticFallback?.district || "",
    address: (doc.address as string) || staticFallback?.address || "",
    phone: (doc.phone as string) || staticFallback?.phone || "",
    levels,
    upcoming: Boolean(doc.upcoming),
    gallery,
    ...(preview ? {} : {}),
  };
}

export type CmsBranch = Branch & {
  citySlug?: string;
  campusSlug?: string;
  previewMedia?: SiteMedia;
};

function mapCmsBranchExtended(doc: Record<string, unknown>): CmsBranch {
  const slug = doc.slug as string;
  const previewFallback = branchPreviewMedia[slug];
  const preview = mapPayloadMediaGroup(
    doc.previewMedia as Parameters<typeof mapPayloadMediaGroup>[0],
    previewFallback,
  );
  const base = mapCmsBranch(doc);
  return {
    ...base,
    citySlug: (doc.citySlug as string) || getStaticCitySlug(slug),
    campusSlug: (doc.campusSlug as string) || getStaticCampusSlug(slug),
    previewMedia: preview,
  };
}

function isNextBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

function staticFallbackBranches(): CmsBranch[] {
  return staticBranches.map((b) => ({
    ...b,
    citySlug: getStaticCitySlug(b.slug),
    campusSlug: getStaticCampusSlug(b.slug),
    previewMedia: branchPreviewMedia[b.slug],
  }));
}

export async function getPublishedBranches(
  options: FetchOptions = {},
): Promise<CmsBranch[]> {
  // Build sırasında DB bağlantısı yoktur; statik veri kullanılır.
  if (isNextBuild() && !options.draft) {
    return staticFallbackBranches();
  }
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "branches",
      limit: 50,
      sort: "name",
      depth: 2,
      draft: options.draft,
      where: options.draft
        ? undefined
        : { isPublished: { equals: true } },
    });

    if (result.docs.length === 0) {
      return staticBranches.map((b) => ({
        ...b,
        citySlug: getStaticCitySlug(b.slug),
        campusSlug: getStaticCampusSlug(b.slug),
        previewMedia: branchPreviewMedia[b.slug],
      }));
    }

    return result.docs.map((doc) =>
      mapCmsBranchExtended(doc as unknown as Record<string, unknown>),
    );
  } catch (error) {
    console.warn("Şube verisi CMS'ten alınamadı, statik veri kullanılıyor.", error);
    return staticFallbackBranches();
  }
}

export async function getBranchBySlugFromCms(
  slug: string,
  options: FetchOptions = {},
): Promise<CmsBranch | undefined> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "branches",
      where: {
        and: [
          { slug: { equals: slug } },
          ...(options.draft ? [] : [{ isPublished: { equals: true } }]),
        ],
      },
      limit: 1,
      depth: 2,
      draft: options.draft,
    });

    if (result.docs[0]) {
      return mapCmsBranchExtended(
        result.docs[0] as unknown as Record<string, unknown>,
      );
    }
  } catch {
    /* fallback */
  }

  const staticBranch = getStaticBranchBySlug(slug);
  if (!staticBranch) return undefined;
  return {
    ...staticBranch,
    citySlug: getStaticCitySlug(slug),
    campusSlug: getStaticCampusSlug(slug),
    previewMedia: branchPreviewMedia[slug],
  };
}

const STATIC_CITY_SLUG: Record<string, string> = {
  sancaktepe: "istanbul",
  basiskele: "kocaeli",
  serdivan: "sakarya",
  sincan: "ankara",
  mevlana: "konya",
};

const STATIC_CAMPUS_SLUG: Record<string, string> = {
  sancaktepe: "sancaktepe",
  basiskele: "basiskele",
  serdivan: "serdivan",
  sincan: "sincan",
  mevlana: "mevlana",
};

function getStaticCitySlug(branchSlug: string): string {
  return STATIC_CITY_SLUG[branchSlug] ?? "";
}

function getStaticCampusSlug(branchSlug: string): string {
  return STATIC_CAMPUS_SLUG[branchSlug] ?? branchSlug;
}

export async function buildCampusRouteMap(
  options: FetchOptions = {},
): Promise<Record<string, Record<string, string>>> {
  const branches = await getPublishedBranches(options);
  const map: Record<string, Record<string, string>> = {};
  for (const b of branches) {
    if (!b.citySlug || !b.campusSlug) continue;
    if (!map[b.citySlug]) map[b.citySlug] = {};
    map[b.citySlug][b.campusSlug] = b.slug;
  }
  return map;
}
