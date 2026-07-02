/**
 * Mega menü / sayfa hero görselleri — tek kaynak.
 * Dosyalar: public/images/menu-gorselleri/
 */
export const MENU_IMAGES = {
  kurumsalKimlik: "/images/menu-gorselleri/kurumsal-kimlik.jpg",
  kurumsalDegerler: "/images/menu-gorselleri/kurumsal-degerlerimiz.jpg",
  niyetimiz: "/images/menu-gorselleri/niyetimiz.jpg",
  egitim: "/images/menu-gorselleri/degerler-egitimi.jpg",
  akademik: "/images/menu-gorselleri/akademik.jpg",
  rehberlik: "/images/menu-gorselleri/rehberlik-egitim-koclugu.jpg",
  yasam: "/images/menu-gorselleri/yasam.jpg",
  istanbul: "/images/menu-gorselleri/istanbul.webp",
  kocaeli: "/images/menu-gorselleri/kocaeli.jpg",
  sakarya: "/images/menu-gorselleri/sakarya.jpg",
  ankara: "/images/menu-gorselleri/ankara.png",
  konya: "/images/menu-gorselleri/konya.jpg",
} as const;

export type PageMedia = {
  src: string;
  type: "image" | "video";
  poster?: string;
  alt: string;
};

export const PAGE_MEDIA = {
  kurumsalKimlik: {
    src: MENU_IMAGES.kurumsalKimlik,
    type: "image",
    alt: "Kurumsal Kimliğimiz",
  },
  niyetimiz: {
    src: MENU_IMAGES.niyetimiz,
    type: "image",
    alt: "Niyetimiz ve İstikametimiz",
  },
  kurumsalDegerler: {
    src: MENU_IMAGES.kurumsalDegerler,
    type: "image",
    alt: "Kurumsal Değerlerimiz",
  },
  nesilTasavvur: {
    src: "/videos/nesil-tasavvurumuz.mp4",
    type: "video",
    poster: "/videos/nesil-tasavvurumuz-poster.jpg",
    alt: "Nesil Tasavvurumuz",
  },
  kademeler: {
    src: "/videos/kademeler.mp4",
    type: "video",
    poster: MENU_IMAGES.egitim,
    alt: "Sultan Mektebi Modeli ve Kademeler",
  },
  degerlerEgitimi: {
    src: MENU_IMAGES.egitim,
    type: "image",
    alt: "Değerler ve Mânevî Eğitim",
  },
  akademikGelisim: {
    src: MENU_IMAGES.akademik,
    type: "image",
    alt: "Akademik Gelişim ve Tâkib",
  },
  yabanciDil: {
    src: "/videos/yabanci-dil.mp4",
    type: "video",
    poster: "/videos/yabanci-dil-poster.jpg",
    alt: "Yabancı Dil ve Atölyeler",
  },
  rehberlikKocluk: {
    src: MENU_IMAGES.rehberlik,
    type: "image",
    alt: "Rehberlik ve Eğitim Koçluğu",
  },
  veli: {
    src: "/videos/sultanda-veli.mp4",
    type: "video",
    poster: "/videos/sultanda-veli-poster.jpg",
    alt: "Sultanda Veli Olmak ve Veli Akademisi",
  },
  yasam: {
    src: MENU_IMAGES.yasam,
    type: "image",
    alt: "Sultanda Yaşam",
  },
  sultandaYasamVideo: {
    src: "/videos/sultanda-yasam.mp4",
    type: "video",
    poster: MENU_IMAGES.yasam,
    alt: "Sultanda Yaşam",
  },
  anaokulu: {
    src: "/site-media/VID-20260429-WA0181.mp4",
    type: "video",
    poster: "/site-media/IMG-20260429-WA0133.jpg",
    alt: "Anaokulu programı",
  },
  ilkokul: {
    src: "/site-media/IMG-20260429-WA0082.jpg",
    type: "image",
    alt: "İlkokul sınıf atmosferi",
  },
  ortaokul: {
    src: "/site-media/IMG-20260429-WA0175.jpg",
    type: "image",
    alt: "Ortaokul kademe vitrini",
  },
  nebeviEgitim: {
    src: "/site-media/VID-20260429-WA0127.mp4",
    type: "video",
    poster: "/site-media/IMG-20260429-WA0090.jpg",
    alt: "Nebevî eğitim ve Kur'an-ı Kerîm",
  },
} as const satisfies Record<string, PageMedia>;

/** Şube slug → kampüs menü görseli */
export const BRANCH_MENU_IMAGES: Record<string, string> = {
  sancaktepe: MENU_IMAGES.istanbul,
  basiskele: MENU_IMAGES.kocaeli,
  serdivan: MENU_IMAGES.sakarya,
  sincan: MENU_IMAGES.ankara,
  mevlana: MENU_IMAGES.konya,
};
