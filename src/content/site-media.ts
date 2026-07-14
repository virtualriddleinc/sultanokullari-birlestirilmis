import { BRANCH_MENU_IMAGES } from "@/lib/menu-images";
import {
  galleryAssets,
  generatedPageGalleries,
} from "@/content/gallery-media.generated";

export { galleryAssets };
const MEDIA_BASE = "/site-media";

export type SiteMedia = {
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
};

const image = (file: string, alt: string): SiteMedia => ({
  kind: "image",
  src: `${MEDIA_BASE}/${file}`,
  alt,
});

const video = (file: string, alt: string, poster?: string): SiteMedia => ({
  kind: "video",
  src: `${MEDIA_BASE}/${file}`,
  alt,
  poster: poster ? `${MEDIA_BASE}/${poster}` : undefined,
});

export const heroMedia = [
  video(
    "VID-20260429-WA0127.mp4",
    "Nebevî eğitim ve okul atmosferinden video kesiti",
    "IMG-20260429-WA0090.jpg",
  ),
  image("IMG-20260429-WA0089.jpg", "Okul içinde temiz ve huzurlu yaşam alanı"),
  video(
    "VID-20260429-WA0119.mp4",
    "Hâfızlık ve değerler eğitimi atmosferinden video kesiti",
    "IMG-20260429-WA0122.jpg",
  ),
  video(
    "VID-20260429-WA0141.mp4",
    "Spor ve sanat etkinliklerinden video kesiti",
    "IMG-20260429-WA0130.jpg",
  ),
  image(
    "IMG-20260429-WA0086.jpg",
    "Keşf-i Bilim — bilim ve keşif alanından bir kare",
  ),
] as const satisfies readonly SiteMedia[];

export const headerMedia = {
  hakkimizda: video(
    "VID-20260429-WA0134.mp4",
    "Sultan Okulları kurumsal tanıtım videosu",
  ),
  kurucuMesaji: image(
    "IMG-20260429-WA0113.jpg",
    "Kurucu mesajı için temsilî okul atmosferi",
  ),
  idariKadro: video(
    "VID-20260429-WA0119.mp4",
    "İdari kadro ve çalışma atmosferi videosu",
  ),
  insanKaynaklari: image(
    "IMG-20260429-WA0137.jpg",
    "İnsan kaynakları ve ekip iletişimi",
  ),
  anaokulu: video(
    "VID-20260429-WA0181.mp4",
    "Anaokulu programından kısa video",
    "IMG-20260429-WA0133.jpg",
  ),
  ilkokul: image("IMG-20260429-WA0082.jpg", "İlkokul sınıf atmosferi"),
  ortaokul: image("IMG-20260429-WA0175.jpg", "Ortaokul kademe vitrini"),
  nebevi: video(
    "VID-20260429-WA0127.mp4",
    "Nebevî eğitim ve siyer ortamından kısa video",
    "IMG-20260429-WA0090.jpg",
  ),
  hafizlik: video(
    "VID-20260429-WA0119.mp4",
    "Hâfızlık halkasından kısa video",
    "IMG-20260429-WA0114.jpg",
  ),
  degerler: image(
    "IMG-20260429-WA0112.jpg",
    "Değerler eğitimi sınıf etkinliği",
  ),
  ciftDil: image(
    "IMG-20260429-WA0086.jpg",
    "Çift yabancı dil eğitiminden bir kare",
  ),
  atolyeler: video(
    "VID-20260429-WA0124.mp4",
    "Atölye çalışmalarından kısa video",
    "IMG-20260429-WA0110.jpg",
  ),
  olanaklar: image(
    "IMG-20260429-WA0135.jpg",
    "Okul olanaklarından seçili kare",
  ),
  rehberlik: image(
    "IMG-20260429-WA0129.jpg",
    "Rehberlik ve öğrenci gelişimi alanı",
  ),
  sancaktepe: image("IMG-20260429-WA0138.jpg", "Sancaktepe kampüs fotoğrafı"),
  basiskele: image("IMG-20260429-WA0131.jpg", "Başiskele kampüs fotoğrafı"),
  serdivan: image("IMG-20260429-WA0041.jpg", "Serdivan kampüs fotoğrafı"),
  sincan: image("IMG-20260429-WA0106.jpg", "Sincan kampüs fotoğrafı"),
} as const;

export const hexGalleryMedia = [
  image("IMG-20260429-WA0123.jpg", "Kampüs yaşamından seçili kare"),
  video(
    "VID-20260429-WA0118.mp4",
    "Atölye atmosferinden kısa video",
    "IMG-20260429-WA0102.jpg",
  ),
  image("IMG-20260429-WA0114.jpg", "Hâfızlık halkasından bir kare"),
  image("IMG_1910.JPG", "Bahçede oyun anı"),
  video(
    "VID-20260429-WA0165.mp4",
    "Sınıf etkinliğinden kısa video",
    "IMG-20260429-WA0177.jpg",
  ),
  image("IMG_1685.JPG", "Okul töreninden bir kare"),
  video(
    "VID-20260429-WA0141.mp4",
    "Spor zamanından kısa video",
    "IMG-20260429-WA0130.jpg",
  ),
  image("IMG-20260429-WA0132.jpg", "Kütüphane ve sakin çalışma atmosferi"),
  image("IMG-20260429-WA0143.jpg", "Mezuniyet ve etkinlik karesi"),
  video(
    "VID-20260429-WA0170.mp4",
    "Doğa gezisinden kısa video",
    "IMG-20260429-WA0121.jpg",
  ),
  image("IMG-20260429-WA0038.jpg", "Sanat atölyesinden seçili kare"),
  image("IMG-20260429-WA0086.jpg", "Bilim ve keşif alanından seçili kare"),
] as const satisfies readonly SiteMedia[];

export const yemekhaneMedia: SiteMedia = {
  kind: "video",
  src: "/videos/kantinsizokul.mp4",
  alt: "Kantinsiz okul — yemekhane ve sağlıklı beslenme",
  poster: "/videos/kantinsizokul-poster.jpg",
};

export const featuredVideo = image(
  "IMG_1545.JPG",
  "Sultan Okulları okul atmosferinden bir kare",
);

export const insanKaynaklariMedia = [
  headerMedia.insanKaynaklari,
  video(
    "VID-20260429-WA0119.mp4",
    "Sultan Okulları ekip ve çalışma atmosferinden kısa video",
    "IMG-20260429-WA0122.jpg",
  ),
  image(
    "IMG-20260429-WA0143.jpg",
    "Okul etkinliklerinde birlikte çalışan eğitim kadrosu",
  ),
  video(
    "VID-20260429-WA0134.mp4",
    "Sultan Okulları kurumsal atmosfer videosu",
    "IMG-20260429-WA0113.jpg",
  ),
] as const satisfies readonly SiteMedia[];

export const branchPreviewMedia: Record<string, SiteMedia> = {
  sancaktepe: {
    kind: "image",
    src: BRANCH_MENU_IMAGES.sancaktepe,
    alt: "İstanbul Sancaktepe kampüsü",
  },
  basiskele: {
    kind: "image",
    src: BRANCH_MENU_IMAGES.basiskele,
    alt: "Kocaeli Başiskele kampüsü",
  },
  serdivan: {
    kind: "image",
    src: BRANCH_MENU_IMAGES.serdivan,
    alt: "Sakarya Serdivan kampüsü",
  },
  sincan: {
    kind: "image",
    src: BRANCH_MENU_IMAGES.sincan,
    alt: "Ankara Sincan kampüsü",
  },
  mevlana: {
    kind: "image",
    src: BRANCH_MENU_IMAGES.mevlana,
    alt: "Konya Mevlânâ kampüsü — yakında",
  },
};

/** Eğitim sayfası galerileri — Görsel/ klasöründen (paylaşımlı asset havuzu) */
export const educationGalleryMedia = {
  anaokulu: generatedPageGalleries.anaokulu,
  ilkokul: generatedPageGalleries.ilkokul,
  ortaokul: generatedPageGalleries.ortaokul,
  nebevi: generatedPageGalleries.nebevi,
  /** Görsel klasöründe Hâfızlık yok — mevcut medya korunur */
  hafizlik: [
    heroMedia[2],
    image("IMG-20260429-WA0121.jpg", "Hâfızlık galerisinden fotoğraf"),
    image("IMG-20260429-WA0143.jpg", "Hâfızlık ve etkinlik atmosferi"),
  ],
  degerler: generatedPageGalleries.degerler,
  ciftDil: generatedPageGalleries.yabanciDil,
} as const satisfies Record<string, readonly SiteMedia[]>;

const LEVEL_GALLERY_BY_LABEL: Record<string, readonly SiteMedia[]> = {
  Anaokulu: educationGalleryMedia.anaokulu,
  İlkokul: educationGalleryMedia.ilkokul,
  Ortaokul: educationGalleryMedia.ortaokul,
};

/** Okul kademelerine göre ilgili eğitim galerilerini birleştirir (src ile dedupe). */
export function galleryFromLevels(levels: readonly string[]): SiteMedia[] {
  const seen = new Set<string>();
  const out: SiteMedia[] = [];
  for (const level of levels) {
    const items = LEVEL_GALLERY_BY_LABEL[level];
    if (!items) continue;
    for (const item of items) {
      if (seen.has(item.src)) continue;
      seen.add(item.src);
      out.push(item);
    }
  }
  return out;
}

/**
 * Okullarımız şube galerileri — her okulun kademelerine göre
 * Anaokulu / İlkokul / Ortaokul galerilerinden (merkezi asset havuzu).
 */
export const branchGalleryMedia: Record<string, SiteMedia[]> = {
  sancaktepe: galleryFromLevels(["Anaokulu"]),
  basiskele: galleryFromLevels(["Anaokulu", "İlkokul", "Ortaokul"]),
  serdivan: galleryFromLevels(["Anaokulu"]),
  sincan: galleryFromLevels(["Anaokulu"]),
  mevlana: [
    {
      kind: "image",
      src: BRANCH_MENU_IMAGES.mevlana,
      alt: "Konya Mevlânâ kampüsü — yakında",
    },
  ],
};

export const mediaPageItems = [
  featuredVideo,
  ...hexGalleryMedia.slice(0, 5),
] as const satisfies readonly SiteMedia[];

export const kurumsalKimlikGalleryMedia =
  generatedPageGalleries.kurumsalKimlik;

export const pageGalleryMedia = {
  niyetimiz: generatedPageGalleries.niyetimiz,
  nesilTasavvur: generatedPageGalleries.nesilTasavvur,
  kurumsalDegerler: generatedPageGalleries.kurumsalDegerler,
  kademeler: generatedPageGalleries.kademeler,
  akademikGelisim: generatedPageGalleries.akademikGelisim,
  yabanciDil: generatedPageGalleries.yabanciDil,
  rehberlikKocluk: generatedPageGalleries.rehberlikKocluk,
  veli: generatedPageGalleries.veli,
  sultandaYasam: generatedPageGalleries.sultandaYasam,
} as const satisfies Record<string, readonly SiteMedia[]>;
