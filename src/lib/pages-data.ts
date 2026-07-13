import "server-only";

import { getPayloadClient } from "@/lib/payload";
import type { Page } from "@/payload-types";

type FetchOptions = {
  draft?: boolean;
};

export function buildPagePath(page: Pick<Page, "slug" | "pathPrefix">): string {
  const prefix = page.pathPrefix || "kurumsal";
  if (prefix === "root") return `/${page.slug}`;
  return `/${prefix}/${page.slug}`;
}

export async function getPageBySlug(
  slug: string,
  options: FetchOptions = {},
): Promise<Page | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: options.draft
        ? { slug: { equals: slug } }
        : {
            and: [
              { slug: { equals: slug } },
              { _status: { equals: "published" } },
            ],
          },
      limit: 1,
      depth: 2,
      draft: options.draft,
    });
    return result.docs[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPageByPath(
  pathPrefix: string,
  slug: string,
  options: FetchOptions = {},
): Promise<Page | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: options.draft
        ? {
            and: [
              { slug: { equals: slug } },
              { pathPrefix: { equals: pathPrefix } },
            ],
          }
        : {
            and: [
              { slug: { equals: slug } },
              { pathPrefix: { equals: pathPrefix } },
              { _status: { equals: "published" } },
            ],
          },
      limit: 1,
      depth: 2,
      draft: options.draft,
    });
    return result.docs[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedPages(
  options: FetchOptions = {},
): Promise<Page[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: options.draft ? {} : { _status: { equals: "published" } },
      limit: 200,
      depth: 1,
      draft: options.draft,
      sort: "title",
    });
    return result.docs;
  } catch {
    return [];
  }
}
