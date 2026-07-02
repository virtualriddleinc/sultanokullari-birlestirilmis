/**
 * Navigasyon verisi — yapısal iskelet.
 * title ve description alanları şimdilik boş bırakılmıştır;
 * içerik sonraki aşamada docs/content/site-metin-icerigi.pdf'ten doldurulacaktır.
 * İkon isimleri lucide-react PascalCase export adlarıyla eşleşir.
 *
 * Tüm görseller /public/images/ altından string path ile servis edilir.
 */

/* Bölüm görselleri */
const IMG = {
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

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  img?: string;
  video?: string;
  isNew?: boolean;
}

export interface NavSection {
  key: string;
  label: string;
  /** İki satırlı başlık gösterimi (opsiyonel) */
  labelLines?: [string, string];
  /** PDF'ten doldurulacak */
  title: string;
  /** PDF'ten doldurulacak */
  description: string;
  featured: {
    /** PDF'ten doldurulacak */
    label: string;
    img: string;
    video?: string;
    icon: string;
  };
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    key: "kurumsal",
    label: "Kurumsal",
    title: "",
    description:
      "İlimde âlim, ibadette âbid, gayrette mücahit bir neslin yetiştiği çift kanatlı eğitim modeli",
    featured: {
      label: "",
      img: IMG.kurumsalKimlik,
      icon: "Landmark",
    },
    items: [
      {
        label: "Kurumsal Kimliğimiz",
        href: "/kurumsal/kurumsal-kimligimiz",
        icon: "Building2",
        img: IMG.kurumsalKimlik,
      },
      {
        label: "Niyetimiz ve İstikametimiz",
        href: "/kurumsal/niyetimiz-istikametimiz",
        icon: "Compass",
        img: IMG.niyetimiz,
      },
      {
        label: "Nesil Tasavvurumuz",
        href: "/kurumsal/nesil-tasavvurumuz",
        icon: "Users",
        video: "/videos/nesil-tasavvurumuz.mp4",
      },
      {
        label: "Kurumsal Değerlerimiz",
        href: "/kurumsal/kurumsal-degerlerimiz",
        icon: "Heart",
        img: IMG.kurumsalDegerler,
      },
    ],
  },
  {
    key: "egitim",
    label: "Eğitim",
    title: "",
    description:
      "Bilginin hikmete, bilincin ise erdeme dönüştüğü özgün bir eğitim modeli",
    featured: {
      label: "Sultan Mektep Modeli & Kademeler",
      img: IMG.egitim,
      video: "/videos/kademeler.mp4",
      icon: "BookOpen",
    },
    items: [
      {
        label: "Sultan Mektep Modeli & Kademeler",
        href: "/egitim/kademeler",
        icon: "GraduationCap",
        video: "/videos/kademeler.mp4",
        img: IMG.egitim,
      },
      {
        label: "Nebevî Eğitim ve Kur'an-ı Kerîm",
        href: "/egitim/nebevi-egitim",
        icon: "Book",
        video: "/videos/nebevi-egitim.mp4",
      },
      {
        label: "Değerler ve Mânevî Eğitim",
        href: "/egitim/degerler-egitimi",
        icon: "Star",
        img: IMG.egitim,
      },
    ],
  },
  {
    key: "akademik",
    label: "Akademik",
    title: "",
    description:
      "Her evladımızın kabiliyetini emanet bilinciyle takip ediyor, ilmini ve gayretini adım adım büyütüyoruz",
    featured: {
      label: "Akademik Gelişim ve Takip",
      img: IMG.akademik,
      video: "/videos/akademik-gelisim.mp4",
      icon: "Award",
    },
    items: [
      {
        label: "Akademik Gelişim ve Takip",
        href: "/akademik/gelisim",
        icon: "TrendingUp",
        video: "/videos/akademik-gelisim.mp4",
      },
      {
        label: "Yabancı Dil & Atölyeler",
        href: "/akademik/yabanci-dil",
        icon: "Globe",
        video: "/videos/yabanci-dil.mp4",
      },
    ],
  },
  {
    key: "rehberlik",
    label: "Rehberlik & Veli",
    labelLines: ["Rehberlik", "& Veli"],
    title: "",
    description: "Başarıdan ziyade şahsiyete odaklanan bir model uyguluyoruz",
    featured: {
      label: "Rehberlik ve Eğitim Koçluğu",
      img: IMG.rehberlik,
      icon: "HeartHandshake",
    },
    items: [
      {
        label: "Rehberlik ve Eğitim Koçluğu",
        href: "/rehberlik/egitim-koclugu",
        icon: "Users",
        img: IMG.rehberlik,
      },
      {
        label: "Sultanda Veli Olmak & Veli Akademisi",
        href: "/rehberlik/veli",
        icon: "UserCheck",
        video: "/videos/sultanda-veli.mp4",
      },
    ],
  },
  {
    key: "yasam",
    label: "Sultanda Yaşam",
    title: "",
    description:
      "Özel Sultan Okulları'nda eğitim; öğrencilerimizin akademik gelişimlerinin yanında kişisel, sosyal ve ahlaki becerilerini de desteklemeyi amaçlar.",
    featured: {
      label: "Sultanda Yaşam",
      img: IMG.yasam,
      video: "/videos/sultanda-yasam.mp4",
      icon: "Coffee",
    },
    items: [
      {
        label: "Sultanda Yaşam",
        href: "/yasam/sultanda-yasam",
        icon: "Smile",
        video: "/videos/sultanda-yasam.mp4",
      },
    ],
  },
  {
    key: "okullar",
    label: "Okullarımız",
    title: "",
    description:
      "Size en yakın Sultan okulunu seçerek yol tarifi alabilir, okulumuza güvenli ve pratik bir şekilde ulaşabilirsiniz.",
    featured: {
      label: "Okullarımız",
      img: IMG.istanbul,
      icon: "Map",
    },
    items: [
      {
        label: "İstanbul – Sancaktepe",
        href: "/okullarimiz/istanbul/sancaktepe",
        icon: "MapPin",
        img: IMG.istanbul,
      },
      {
        label: "Kocaeli – Başiskele",
        href: "/okullarimiz/kocaeli/basiskele",
        icon: "MapPin",
        img: IMG.kocaeli,
      },
      {
        label: "Sakarya – Serdivan",
        href: "/okullarimiz/sakarya/serdivan",
        icon: "MapPin",
        img: IMG.sakarya,
      },
      {
        label: "Ankara – Sincan",
        href: "/okullarimiz/ankara/sincan",
        icon: "MapPin",
        img: IMG.ankara,
      },
      {
        label: "Konya – Mevlânâ",
        href: "/okullarimiz/konya/mevlana",
        icon: "MapPin",
        img: IMG.konya,
        isNew: true,
      },
    ],
  },
];
