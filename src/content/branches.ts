import { z } from "zod";
import { branchGalleryMedia } from "@/content/site-media";

const galleryItemSchema = z.object({
  kind: z.enum(["image", "video"]).default("image"),
  src: z.string(),
  alt: z.string(),
  poster: z.string().optional(),
});

export const branchSchema = z.object({
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string(),
  phone: z.string(),
  levels: z.array(z.string()),
  /** Yakında açılacak kampüsler için iletişim/harita blokları sadeleştirilir. */
  upcoming: z.boolean().optional(),
  /** Her şube sayfasında Galeri zorunlu. */
  gallery: z.array(galleryItemSchema),
});

export type Branch = z.infer<typeof branchSchema>;

/**
 * Web Sitesi İçerik Çalışması.pdf — OKULLARIMIZ
 * Konya/Mevlânâ PDF’de yok; silinmedi (upcoming), karar bekleniyor.
 */
export const branches: Branch[] = branchSchema.array().parse([
  {
    slug: "sancaktepe",
    name: "Özel Sultan Anne Anaokulu",
    city: "İstanbul",
    district: "Sancaktepe",
    address: "Eyüp Sultan, Emsal Sk. No: 7 D:1, 34885 Sancaktepe / İstanbul",
    phone: "0506 057 60 72",
    levels: ["Anaokulu"],
    gallery: branchGalleryMedia.sancaktepe,
  },
  {
    slug: "basiskele",
    name: "Özel Sultan Okulları Anaokulu, İlkokul ve Ortaokulu",
    city: "Kocaeli",
    district: "Başiskele",
    address: "Sultanbaba Sokağı, Yaylacık Cd. No:45/1, 41140 Başiskele/Kocaeli",
    phone: "0532 327 88 34",
    levels: ["Anaokulu", "İlkokul", "Ortaokul"],
    gallery: branchGalleryMedia.basiskele,
  },
  {
    slug: "serdivan",
    name: "Özel Sultan Anne Anaokulu",
    city: "Sakarya",
    district: "Serdivan",
    address: "Köprübaşı, Fevzi Çakmak Cd. No: 46, 54130 Serdivan / Sakarya",
    phone: "0552 070 24 90",
    levels: ["Anaokulu"],
    gallery: branchGalleryMedia.serdivan,
  },
  {
    slug: "sincan",
    name: "Özel Sincan Sultan Anne Anaokulu",
    city: "Ankara",
    district: "Sincan",
    address: "Pınarbaşı, 128. Sk. No:23, 31270 Sincan / Ankara",
    phone: "0546 916 06 60",
    levels: ["Anaokulu"],
    gallery: branchGalleryMedia.sincan,
  },
  {
    slug: "mevlana",
    name: "Sultan Okulları Mevlânâ",
    city: "Konya",
    district: "Mevlânâ",
    address: "Konya — Mevlânâ (Yakında açılacak)",
    phone: "0532 327 88 34",
    levels: [],
    upcoming: true,
    gallery: branchGalleryMedia.mevlana,
  },
]);

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((b) => b.slug === slug);
}

/** Ana sayfa / footer ile aynı: «İlçe – İl» */
export function formatBranchLocation(
  branch: Pick<Branch, "district" | "city">,
): string {
  const district = branch.district?.trim() ?? "";
  const city = branch.city?.trim() ?? "";
  if (district && city) return `${district} – ${city}`;
  return district || city;
}
