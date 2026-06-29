import "server-only";

import type { SiteEvent, SiteNews } from "@/content/guncel";
import type { CmsFaqItem } from "@/lib/seo/cms-seo";
import { getPayloadClient } from "@/lib/payload";

export type SiteNewsDetail = SiteNews & {
  slug: string;
  body?: unknown;
  featuredImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
  geoCitationSummary?: string;
  faqItems?: CmsFaqItem[];
};

export type SiteEventDetail = SiteEvent & {
  slug: string;
  body?: unknown;
  featuredImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
  geoCitationSummary?: string;
  faqItems?: CmsFaqItem[];
};

function toIsoDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function mapNews(doc: {
  id: number | string;
  title: string;
  date: string | Date;
  excerpt: string;
  slug?: string | null;
}): SiteNews & { slug?: string } {
  return {
    id: String(doc.id),
    title: doc.title,
    date: toIsoDate(doc.date),
    excerpt: doc.excerpt,
    slug: doc.slug ?? undefined,
  };
}

function mapEvent(doc: {
  id: number | string;
  title: string;
  date: string | Date;
  excerpt: string;
  slug?: string | null;
  branch?: { slug?: string } | number | string | null;
  branchSlug?: string | null;
}): SiteEvent & { slug?: string } {
  let branchSlug: string | null = null;
  if (doc.branch && typeof doc.branch === "object" && "slug" in doc.branch) {
    branchSlug = doc.branch.slug?.trim() ? doc.branch.slug : null;
  } else if (doc.branchSlug?.trim()) {
    branchSlug = doc.branchSlug;
  }
  return {
    id: String(doc.id),
    title: doc.title,
    date: toIsoDate(doc.date),
    excerpt: doc.excerpt,
    branchSlug,
    slug: doc.slug ?? undefined,
  };
}

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === "object" && "url" in media) {
    return media.url as string;
  }
  return undefined;
}

function mapSeoFields(doc: Record<string, unknown>) {
  return {
    seoTitle: (doc.seoTitle as string | undefined) ?? undefined,
    seoDescription: (doc.seoDescription as string | undefined) ?? undefined,
    ogImageUrl: mediaUrl(doc.ogImage) ?? undefined,
    noIndex: Boolean(doc.noIndex),
    geoCitationSummary: (doc.geoCitationSummary as string | undefined) ?? undefined,
    faqItems: Array.isArray(doc.faqItems)
      ? doc.faqItems
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const question = "question" in item ? String(item.question ?? "") : "";
            const answer = "answer" in item ? String(item.answer ?? "") : "";
            if (!question || !answer) return null;
            return { question, answer };
          })
          .filter((item): item is CmsFaqItem => Boolean(item))
      : undefined,
  };
}

type FetchOptions = {
  draft?: boolean;
};

export async function getPublishedNews(
  options: FetchOptions = {},
): Promise<(SiteNews & { slug?: string })[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      where: options.draft
        ? {}
        : {
            _status: {
              equals: "published",
            },
          },
      sort: "-date",
      limit: 100,
      depth: 0,
      draft: options.draft,
    });

    return result.docs.map(mapNews);
  } catch (error) {
    console.warn("[guncel-data] Haberler yüklenemedi:", error);
    return [];
  }
}

export async function getNewsBySlug(
  slug: string,
  options: FetchOptions = {},
): Promise<SiteNewsDetail | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      where: options.draft
        ? { slug: { equals: slug } }
        : {
            and: [
              { slug: { equals: slug } },
              { _status: { equals: "published" } },
            ],
          },
      limit: 1,
      depth: 1,
      draft: options.draft,
    });

    const doc = result.docs[0];
    if (!doc) return null;

    return {
      ...mapNews(doc),
      slug: doc.slug as string,
      body: doc.body,
      featuredImageUrl: mediaUrl(doc.featuredImage),
      ...mapSeoFields(doc as unknown as Record<string, unknown>),
    };
  } catch {
    return null;
  }
}

export async function getPublishedEvents(
  options: FetchOptions = {},
): Promise<(SiteEvent & { slug?: string })[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "events",
      where: options.draft
        ? {}
        : {
            _status: {
              equals: "published",
            },
          },
      sort: "date",
      limit: 100,
      depth: 1,
      draft: options.draft,
    });

    return result.docs.map(mapEvent);
  } catch (error) {
    console.warn("[guncel-data] Etkinlikler yüklenemedi:", error);
    return [];
  }
}

export async function getEventBySlug(
  slug: string,
  options: FetchOptions = {},
): Promise<SiteEventDetail | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "events",
      where: options.draft
        ? { slug: { equals: slug } }
        : {
            and: [
              { slug: { equals: slug } },
              { _status: { equals: "published" } },
            ],
          },
      limit: 1,
      depth: 1,
      draft: options.draft,
    });

    const doc = result.docs[0];
    if (!doc) return null;

    return {
      ...mapEvent(doc),
      slug: doc.slug as string,
      body: doc.body,
      featuredImageUrl: mediaUrl(doc.featuredImage),
      ...mapSeoFields(doc as unknown as Record<string, unknown>),
    };
  } catch {
    return null;
  }
}

export async function getAllPublishedSlugs(): Promise<{
  news: string[];
  events: string[];
}> {
  const [news, events] = await Promise.all([
    getPublishedNews(),
    getPublishedEvents(),
  ]);

  return {
    news: news.map((item) => item.slug).filter((slug): slug is string => Boolean(slug)),
    events: events
      .map((item) => item.slug)
      .filter((slug): slug is string => Boolean(slug)),
  };
}
