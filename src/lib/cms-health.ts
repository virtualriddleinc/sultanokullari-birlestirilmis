import { getPayloadClient } from "@/lib/payload";

export type CmsHealthIssue = {
  level: "warn" | "error";
  message: string;
  action?: string;
};

export type CmsHealth = {
  ok: boolean;
  issues: CmsHealthIssue[];
  counts: Record<string, number>;
};

export async function getCmsHealth(): Promise<CmsHealth> {
  const issues: CmsHealthIssue[] = [];
  const counts: Record<string, number> = {};

  try {
    const payload = await getPayloadClient();
    const checks: {
      key: string;
      collection: string;
      min?: number;
      label: string;
      action?: string;
    }[] = [
      {
        key: "heroSlides",
        collection: "hero-slides",
        min: 1,
        label: "Hero slaytları",
        action: "npm run seed:homepage",
      },
      {
        key: "branches",
        collection: "branches",
        min: 1,
        label: "Şubeler",
        action: "npm run seed:homepage",
      },
      {
        key: "pages",
        collection: "pages",
        min: 1,
        label: "Sayfalar",
        action: "npm run seed:pages && npm run seed:overlay",
      },
      {
        key: "news",
        collection: "news",
        label: "Haberler",
      },
      {
        key: "events",
        collection: "events",
        label: "Etkinlikler",
      },
      {
        key: "mediaItems",
        collection: "media-items",
        label: "Medya arşivi",
        action: "Admin → Medya Arşivi'nden öğe ekleyin.",
      },
      {
        key: "staff",
        collection: "staff",
        label: "İdari kadro",
      },
    ];

    for (const check of checks) {
      const result = await payload.count({
        collection: check.collection as "pages",
      });
      counts[check.key] = result.totalDocs;
      if (check.min && result.totalDocs < check.min) {
        issues.push({
          level: "warn",
          message: `${check.label} boş veya eksik (${result.totalDocs} kayıt).`,
          action: check.action ?? "İlgili seed komutunu çalıştırın.",
        });
      }
    }

    // Seed edilmiş kurumsal slug'ların yayın durumunu kontrol et
    const criticalSlugs = [
      "hakkimizda",
      "burs-olanaklari",
      "kurumsal-kimligimiz",
      "niyetimiz-istikametimiz",
      "nesil-tasavvurumuz",
      "kurumsal-degerlerimiz",
    ];
    for (const slug of criticalSlugs) {
      const result = await payload.find({
        collection: "pages",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      });
      const doc = result.docs[0] as { _status?: string } | undefined;
      if (!doc) {
        issues.push({
          level: "warn",
          message: `Sayfa kaydı yok: ${slug}`,
          action: "npm run seed:pages",
        });
      } else if (doc._status && doc._status !== "published") {
        issues.push({
          level: "warn",
          message: `Sayfa taslakta: ${slug} — sitede görünmez.`,
          action: "Admin → Sayfalar → Yayınla",
        });
      }
    }

    return { ok: issues.every((i) => i.level !== "error"), issues, counts };
  } catch (error) {
    issues.push({
      level: "error",
      message: "Veritabanına bağlanılamadı.",
      action: String(error),
    });
    return { ok: false, issues, counts };
  }
}
