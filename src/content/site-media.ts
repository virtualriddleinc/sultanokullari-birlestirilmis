import { BRANCH_MENU_IMAGES } from "@/lib/menu-images";

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
    "Hafızlık ve değerler eğitimi atmosferinden video kesiti",
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
    "Hafızlık halkasından kısa video",
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
  image("IMG-20260429-WA0114.jpg", "Hafızlık halkasından bir kare"),
  image("IMG-20260429-WA0112.jpg", "Bahçede oyun anı"),
  video(
    "VID-20260429-WA0165.mp4",
    "Sınıf etkinliğinden kısa video",
    "IMG-20260429-WA0177.jpg",
  ),
  image("IMG-20260429-WA0111.jpg", "Okul töreninden bir kare"),
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

export const featuredVideo = video(
  "VID-20260429-WA0156.mp4",
  "Sultan Okulları tanıtım videosu",
  "IMG-20260429-WA0140.jpg",
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

export const branchGalleryMedia: Record<string, SiteMedia[]> = {
  sancaktepe: [
    image("IMG-20260429-WA0137.jpg", "Sancaktepe okul galerisinden fotoğraf"),
    image("IMG-20260429-WA0036.jpg", "Sancaktepe etkinlik alanı"),
    video(
      "VID-20260429-WA0159.mp4",
      "Sancaktepe okul galerisinden video",
      "IMG-20260429-WA0108.jpg",
    ),
  ],
  basiskele: [
    image("IMG-20260429-WA0100.jpg", "Başiskele okul galerisinden fotoğraf"),
    image("IMG-20260429-WA0145.jpg", "Başiskele sınıf ve kampüs alanı"),
    video(
      "VID-20260429-WA0171.mp4",
      "Başiskele okul galerisinden video",
      "IMG-20260429-WA0142.jpg",
    ),
  ],
  serdivan: [
    image("IMG-20260429-WA0104.jpg", "Serdivan okul galerisinden fotoğraf"),
    image("IMG-20260429-WA0084.jpg", "Serdivan sınıf ve etkinlik alanı"),
    video(
      "VID-20260429-WA0162.mp4",
      "Serdivan okul galerisinden video",
      "IMG-20260429-WA0158.jpg",
    ),
  ],
  sincan: [
    image("IMG-20260429-WA0039.jpg", "Sincan okul galerisinden fotoğraf"),
    image("IMG-20260429-WA0109.jpg", "Sincan sınıf ve etkinlik alanı"),
    video(
      "VID-20260429-WA0163.mp4",
      "Sincan okul galerisinden video",
      "IMG-20260429-WA0035.jpg",
    ),
  ],
  mevlana: [
    {
      kind: "image",
      src: BRANCH_MENU_IMAGES.mevlana,
      alt: "Konya Mevlânâ kampüsü — yakında",
    },
    image("IMG-20260429-WA0089.jpg", "Sultan Okulları okul atmosferi"),
    image(
      "IMG-20260429-WA0086.jpg",
      "Keşf-i Bilim ve okul yaşamından bir kare",
    ),
  ],
};

export const educationGalleryMedia = {
  anaokulu: [
    headerMedia.anaokulu,
    image("IMG-20260429-WA0142.jpg", "Anaokulu etkinliklerinden fotoğraf"),
    image("IMG-20260429-WA0104.jpg", "Anaokulu sınıf atmosferi"),
  ],
  ilkokul: [
    headerMedia.ilkokul,
    image("IMG-20260429-WA0122.jpg", "İlkokul etkinliklerinden fotoğraf"),
    video(
      "VID-20260429-WA0126.mp4",
      "İlkokul etkinliklerinden video",
      "IMG-20260429-WA0090.jpg",
    ),
  ],
  ortaokul: [
    headerMedia.ortaokul,
    image("IMG-20260429-WA0139.jpg", "Ortaokul sosyal alanlarından fotoğraf"),
    video(
      "VID-20260429-WA0144.mp4",
      "Ortaokul sosyal alanlarından video",
      "IMG-20260429-WA0113.jpg",
    ),
  ],
  nebevi: [
    heroMedia[0],
    image("IMG-20260429-WA0114.jpg", "Nebevî eğitim galerisinden fotoğraf"),
    image("IMG-20260429-WA0112.jpg", "Değerler eğitimi etkinliği"),
  ],
  hafizlik: [
    heroMedia[2],
    image("IMG-20260429-WA0121.jpg", "Hafızlık galerisinden fotoğraf"),
    image("IMG-20260429-WA0143.jpg", "Hafızlık ve etkinlik atmosferi"),
  ],
  degerler: [
    image("IMG-20260429-WA0112.jpg", "Değerler eğitimi panosundan bir kare"),
    image("IMG-20260429-WA0111.jpg", "Sınıf değerler etkinliği"),
    video(
      "VID-20260429-WA0165.mp4",
      "Sınıf etkinliklerinden kısa video",
      "IMG-20260429-WA0177.jpg",
    ),
  ],
  ciftDil: [
    image("IMG-20260429-WA0086.jpg", "Çift yabancı dil dersinden bir kare"),
    image("IMG-20260429-WA0038.jpg", "Sanat ve dil atölyesi atmosferi"),
    video(
      "VID-20260429-WA0118.mp4",
      "Atölye atmosferinden kısa video",
      "IMG-20260429-WA0102.jpg",
    ),
  ],
} as const;

export const mediaPageItems = [
  featuredVideo,
  ...hexGalleryMedia.slice(0, 5),
] as const satisfies readonly SiteMedia[];
