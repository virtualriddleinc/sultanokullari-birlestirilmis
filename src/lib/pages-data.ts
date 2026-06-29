import "server-only";

import { getPayloadClient } from "@/lib/payload";
import type { Page } from "@/payload-types";

export async function getPageBySlug(
  slug: string,
  options?: { draft?: boolean },
): Promise<Page | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      draft: options?.draft,
    });
    return result.docs[0] ?? null;
  } catch {
    return null;
  }
}
