import "dotenv/config";

import config from "@payload-config";
import { getPayload } from "payload";

import { getSiteUrl } from "../lib/seo/site-url";

const TIMEOUT_MS = 8_000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} zaman aşımı`)), TIMEOUT_MS);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function main() {
  const siteUrl = getSiteUrl();
  const paths: Array<{
    loc: string;
    changefreq: string;
    priority: number;
    lastmod: string;
  }> = [];

  try {
    const payload = await withTimeout(getPayload({ config }), "Payload bağlantısı");
    const [newsResult, eventsResult] = await withTimeout(
      Promise.all([
        payload.find({
          collection: "news",
          where: { _status: { equals: "published" } },
          limit: 200,
          depth: 0,
        }),
        payload.find({
          collection: "events",
          where: { _status: { equals: "published" } },
          limit: 200,
          depth: 0,
        }),
      ]),
      "CMS slug sorgusu",
    );

    for (const doc of newsResult.docs) {
      if (!doc.slug) continue;
      paths.push({
        loc: `${siteUrl}/guncel/haberler/${doc.slug}`,
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    }

    for (const doc of eventsResult.docs) {
      if (!doc.slug) continue;
      paths.push({
        loc: `${siteUrl}/guncel/etkinlikler/${doc.slug}`,
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    }
  } catch {
    // DB yoksa statik route'lar yeterli
  }

  process.stdout.write(JSON.stringify(paths));
  process.exit(0);
}

main().catch(() => {
  process.stdout.write("[]");
  process.exit(0);
});
