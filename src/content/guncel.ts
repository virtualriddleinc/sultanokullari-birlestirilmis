import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  branchSlug: z.string().nullable(),
  excerpt: z.string(),
});

export const newsSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
});

export type SiteEvent = z.infer<typeof eventSchema>;
export type SiteNews = z.infer<typeof newsSchema>;

/** Statik örnek etkinlikler (docx’te takvim yok; şablon veri). */
export const staticEvents: SiteEvent[] = eventSchema.array().parse([
  {
    id: "e1",
    title: "Veli bilgilendirme buluşması",
    date: "2026-05-15",
    branchSlug: null,
    excerpt:
      "Tüm şubeler için genel veli bilgilendirme oturumu planlanmaktadır.",
  },
]);

export const staticNews: SiteNews[] = [];

export const medyaFiltreleri = [
  "Tümü",
  "Etkinlik",
  "Mezuniyet",
  "Atölyeler",
  "Doğa faaliyetleri",
] as const;
