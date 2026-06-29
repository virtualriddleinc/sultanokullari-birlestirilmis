/* -------------------------------------------------------------------------
   Hero slider veri modülü
   ─────────────────────────────────────────────────────────────────────────
   navigation.ts ile aynı desende statik typed veri.
   KRİTİK: Tüm metinler docs/content/site-metin-icerigi.pdf'ten birebir
   alınmıştır; hiçbir kelime değiştirilemez (projekurallari.md §1).
   Başlık satırları, PDF cümlelerinin satır kırılımıyla bölünmüş hâlidir;
   açıklamalar cümlenin devamı veya PDF'teki komşu cümledir.
   ------------------------------------------------------------------------- */

import { MENU_IMAGES } from "@/lib/menu-images";

export interface HeroSlide {
  id: string;
  /** Kart üstündeki pill etiketi (PDF bölüm başlığı) */
  tagline: string;
  /** Üç satıra bölünmüş başlık — kelimeler PDF'ten birebir */
  titleLines: [string, string, string];
  /** Başlığın devamı veya PDF'teki komşu cümle */
  description: string;
  /** Site haritasındaki sayfa adı (projekurallari.md §2) */
  buttonText: string;
  buttonLink: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  /** Video için poster karesi */
  posterUrl?: string;
  /** Medya odak noktası (yüzde); varsayılan merkez */
  focalPoint?: { x: number; y: number };
  /** Slayt görüntülenme süresi (saniye) */
  displayDuration?: number;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "kurumsal",
    tagline: "KURUMSAL KİMLİĞİMİZ",
    titleLines: ["İlimde âlim,", "ibadette âbid,", "gayrette mücahit"],
    description: "bir neslin yetiştiği çift kanatlı eğitim modeli",
    buttonText: "Kurumsal Kimliğimiz",
    buttonLink: "/kurumsal/kurumsal-kimligimiz",
    mediaUrl: MENU_IMAGES.kurumsalKimlik,
    mediaType: "image",
    displayDuration: 6,
  },
  {
    id: "egitim",
    tagline: "SULTAN MEKTEP MODELİ",
    titleLines: [
      "Bilginin hikmete,",
      "bilincin ise erdeme",
      "dönüştüğü özgün model",
    ],
    description:
      "Her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bütün ele alır; mazide kök, âtîde nesil yetişir.",
    buttonText: "Sultan Mektep Modeli & Kademeler",
    buttonLink: "/egitim/kademeler",
    mediaUrl: "/videos/kademeler.mp4",
    mediaType: "video",
    posterUrl: MENU_IMAGES.egitim,
    displayDuration: 6,
  },
  {
    id: "akademik",
    tagline: "AKADEMİK GELİŞİM VE BİREYSEL TAKİP",
    titleLines: [
      "Her evladımızın",
      "kabiliyetini emanet",
      "bilinciyle takip ediyor",
    ],
    description: "ilmini ve gayretini adım adım büyütüyoruz.",
    buttonText: "Akademik Gelişim ve Takip",
    buttonLink: "/akademik/gelisim",
    mediaUrl: MENU_IMAGES.akademik,
    mediaType: "image",
    displayDuration: 6,
  },
  {
    id: "rehberlik",
    tagline: "REHBERLİK VE EĞİTİM KOÇLUĞU",
    titleLines: [
      "Başarıdan ziyade",
      "şahsiyete odaklanan",
      "bir model uyguluyoruz",
    ],
    description:
      "Çocuklarımızın ruhsal ve bedensel gelişiminde doğru rehberliğin hayati önem taşıdığının bilincindeyiz.",
    buttonText: "Rehberlik ve Eğitim Koçluğu",
    buttonLink: "/rehberlik/egitim-koclugu",
    mediaUrl: MENU_IMAGES.rehberlik,
    mediaType: "image",
    displayDuration: 6,
  },
  {
    id: "yasam",
    tagline: "SULTANDA YAŞAM",
    titleLines: [
      "Özel Sultan Okulları'nda",
      "eğitim; akademik gelişimin",
      "yanında ahlaki becerileri",
    ],
    description:
      "öğrencilerimizin sosyal gelişimini desteklemeyi amaçlar.",
    buttonText: "Sultanda Yaşam",
    buttonLink: "/yasam/sultanda-yasam",
    mediaUrl: MENU_IMAGES.yasam,
    mediaType: "image",
    displayDuration: 6,
  },
];
