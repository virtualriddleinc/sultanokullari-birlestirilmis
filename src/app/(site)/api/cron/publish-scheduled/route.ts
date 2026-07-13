import { getPayloadClient } from "@/lib/payload";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/**
 * Zamanlanmış yayın cron endpoint.
 * Authorization: Bearer $CRON_SECRET
 * Örnek: curl -H "Authorization: Bearer $CRON_SECRET" /api/cron/publish-scheduled
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Yetkisiz", { status: 401 });
  }

  const payload = await getPayloadClient();
  const now = new Date().toISOString();
  const collections = ["news", "events", "pages"] as const;
  const published: Array<{ collection: string; id: string | number }> = [];

  for (const collection of collections) {
    const due = await payload.find({
      collection,
      draft: true,
      limit: 50,
      depth: 0,
      where: {
        and: [
          { _status: { equals: "draft" } },
          { publishAt: { less_than_equal: now } },
        ],
      },
      overrideAccess: true,
    });

    for (const doc of due.docs) {
      await payload.update({
        collection,
        id: doc.id,
        data: {
          _status: "published",
          publishAt: null,
        },
        draft: false,
        overrideAccess: true,
      });
      published.push({ collection, id: doc.id });
    }
  }

  if (published.length) {
    revalidatePath("/", "layout");
    revalidatePath("/guncel/haberler");
    revalidatePath("/guncel/etkinlikler");
  }

  return Response.json({
    ok: true,
    publishedCount: published.length,
    published,
  });
}
