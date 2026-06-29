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
    const checks: { key: string; collection: string; min?: number; label: string }[] = [
      { key: "heroSlides", collection: "hero-slides", min: 1, label: "Hero slaytları" },
      { key: "branches", collection: "branches", min: 1, label: "Şubeler" },
      { key: "pages", collection: "pages", min: 1, label: "Kurumsal sayfalar" },
    ];

    for (const check of checks) {
      const result = await payload.count({ collection: check.collection as "hero-slides" });
      counts[check.key] = result.totalDocs;
      if (check.min && result.totalDocs < check.min) {
        issues.push({
          level: "warn",
          message: `${check.label} boş veya eksik (${result.totalDocs} kayıt).`,
          action: "npm run seed:homepage veya seed:pages çalıştırın.",
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
