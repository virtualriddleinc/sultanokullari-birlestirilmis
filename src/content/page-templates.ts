/** Web Sitesi İçerik Çalışması.pdf — Sayfa şablon metinleri */

import type { PageStoryRow } from "@/components/layout/page-story-section";
import {
  anaokulu,
  ciftDil,
  degerler,
  ilkokul,
  nebevi,
  ortaokul,
  sultanMektepModeli,
} from "@/content/egitim";
import {
  kurumsalDegerlerGiris,
  kurumsalDegerlerMaddeleri,
  kurulusParagraflari,
  kurumsalTimeline,
  nesilTasavvurParagraflari,
  niyetimizParagraflari,
} from "@/content/kurumsal";
import {
  akademikGelisimBolumleri,
  akademikGelisimGiris,
} from "@/content/olcme";
import {
  ogrenciCalismalariDetay,
  ogretmenCalismalariDetay,
  ogrenciGelisimiGiris,
  ogretmenGelisimiGiris,
  rehberlikGiris,
  rehberlikHedefimiz,
  sultandaVeliOlmak,
  veliAkademisi,
  veliCalismalariDetay,
  veliGelisimiGiris,
} from "@/content/rehberlik";
import {
  ayakkabisizOkul,
  butikOkul,
  sultandaYasamBilgilendirme,
} from "@/content/sultanda-yasam";
import {
  helalGidaVeBeslenme,
  kantinsizOkul,
} from "@/content/yemekhane";

export type OverlayPageStory = {
  eyebrow: string;
  motto: string;
  rows: readonly PageStoryRow[];
};

export type OverlayPageGallery = {
  title: string;
  description: string;
};

export const niyetimizIstikametimiz = {
  intro: niyetimizParagraflari[0],
  story: {
    eyebrow: "Niyetimiz ve İstikametimiz",
    motto: "Niyetimiz (Gayemiz)",
    rows: [
      {
        eyebrow: "Niyetimiz (Gayemiz)",
        text: niyetimizParagraflari[0],
        highlights: [
          "çift kanatlı",
          "İslâm fıtratlarını muhafaza ederek",
          "şahsiyetli nesiller",
        ],
      },
      {
        eyebrow: "İstikametimiz",
        text: niyetimizParagraflari[1],
        highlights: [
          "adalet ile merhameti",
          "medeniyet inşasına",
          "insanlığa rehberlik",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const nesilTasavvurumuz = {
  intro: nesilTasavvurParagraflari[0],
  story: {
    eyebrow: "Nesil Tasavvurumuz",
    motto: "Kökü mazide, ufku âtîde",
    rows: [
      {
        text: nesilTasavvurParagraflari[0],
        highlights: [
          "iyiliğin, merhametin ve adaletin",
          "kökü mazide, ufku âtîde",
        ],
      },
      {
        text: nesilTasavvurParagraflari[1],
        highlights: [
          "vicdanı diri",
          "merhameti güçlü",
          "emanet bilinciyle",
        ],
      },
      {
        text: nesilTasavvurParagraflari[2],
        highlights: ["Kanuni Sultan Süleyman", "Ebussuûd Efendi"],
      },
      {
        text: nesilTasavvurParagraflari[3],
        highlights: ["Karıncanın dahi hakkını"],
      },
      {
        text: nesilTasavvurParagraflari[4],
        highlights: [
          "yaradılanı Yaradan’dan ötürü",
          "ailesine huzur",
          "topluma güven",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const kurumsalDegerlerimiz = {
  intro: kurumsalDegerlerGiris[0],
  story: {
    eyebrow: "Kurumsal Değerlerimiz",
    motto: "Kalbi incelten, zihni aydınlatan, şahsiyeti olgunlaştıran bir eğitim iklimi",
    rows: [
      {
        eyebrow: "Değerlerimiz",
        text: kurumsalDegerlerGiris[0],
        highlights: [
          "kalbine hikmet",
          "zihnine nur",
          "şahsiyetine istikamet",
        ],
      },
      {
        eyebrow: "Emanet",
        text: kurumsalDegerlerGiris[1],
        highlights: ["mükerrem bir can", "asli vazifesidir"],
      },
      {
        eyebrow: "Sultan Mektebi",
        text: kurumsalDegerlerGiris[2],
        highlights: [
          "kalbi incelten",
          "zihni aydınlatan",
          "şahsiyeti olgunlaştıran",
        ],
      },
      ...kurumsalDegerlerMaddeleri.map((m) => ({
        eyebrow: m.title,
        text: m.text,
        highlights: [m.title] as string[],
      })),
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const kademeler = {
  intro: sultanMektepModeli.intro[0],
  story: {
    eyebrow: "Sultan Mektep Modeli",
    motto: "Bilginin hikmete, bilincin ise erdeme dönüştüğü özgün bir eğitim modeli",
    rows: [
      {
        eyebrow: "Model",
        text: sultanMektepModeli.intro[0],
        highlights: [
          "bilginin hikmete",
          "bilincin ise erdeme",
          "kökü mazide, ufku âtîde",
        ],
      },
      {
        eyebrow: "Yaklaşım",
        text: sultanMektepModeli.intro[1],
        highlights: [
          "Türkiye Yüzyılı Maarif Modeli",
          "çift kanatlı",
        ],
      },
      {
        eyebrow: "Nihai hedef",
        text: sultanMektepModeli.nihaiHedef,
        highlights: ["İnsan-ı Kâmil"],
      },
      ...sultanMektepModeli.pillars.map((p) => ({
        eyebrow: p.title,
        text: p.text,
        highlights: [p.title] as string[],
      })),
    ],
  } satisfies OverlayPageStory,
  kademeSatirlari: sultanMektepModeli.kademeler.map((k) => ({
    eyebrow: k.title,
    text: k.text,
    highlights: [k.title] as string[],
  })) satisfies readonly PageStoryRow[],
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const akademikGelisim = {
  intro: akademikGelisimGiris[0],
  story: {
    eyebrow: "Akademik Gelişim ve Bireysel Tâkib",
    motto: "Her evladımızın kabiliyetini emanet bilinciyle tâkib ediyoruz",
    rows: [
      {
        eyebrow: "Akademik tâkib",
        text: akademikGelisimGiris[0],
        highlights: [
          "bütüncül olarak izleyen",
          "mentor öğretmen",
          "rehberlik desteğiyle",
        ],
      },
      {
        eyebrow: "Amacımız",
        text: akademikGelisimGiris[1],
        highlights: ["emanet bilinciyle", "en üst seviyeye"],
      },
      ...akademikGelisimBolumleri.map((b) => ({
        eyebrow: b.title,
        text: b.text,
        highlights: [b.title] as string[],
      })),
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const yabanciDil = {
  intro: ciftDil.intro[0],
  story: {
    eyebrow: "Yabancı Dil Eğitimi",
    motto: ciftDil.motto,
    rows: [
      {
        eyebrow: "Yaklaşım",
        text: ciftDil.intro[0],
        highlights: [
          "Temel İngilizce dersi",
          "speaking dersi",
        ],
      },
      {
        eyebrow: "Program",
        text: ciftDil.intro[1],
        highlights: [
          "İngilizceyi bilen değil",
          "İngilizceyle iletişim kurabilen",
        ],
      },
      ...ciftDil.bolumler.map((b) => ({
        eyebrow: b.title,
        text: b.text,
        highlights: [b.title] as string[],
      })),
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const rehberlikKocluk = {
  intro: rehberlikGiris,
  story: {
    eyebrow: "Rehberlik ve Eğitim Koçluğu",
    motto: "Başarıdan ziyade şahsiyete odaklanan bir model",
    rows: [
      {
        eyebrow: "Yaklaşımımız",
        text: rehberlikGiris,
        highlights: [
          "nevi şahsına münhasır",
          "başarıdan ziyade şahsiyete",
          "üç temel sütun",
        ],
      },
      {
        eyebrow: "Hedefimiz",
        text: rehberlikHedefimiz,
        highlights: [
          "bütüncül bir rehberlik sistemiyle",
          "safî fıtratını koruyarak",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  calismaBasliklari: [
    {
      title: "1. Öğrenci Gelişimi",
      description: ogrenciGelisimiGiris,
      items: ogrenciCalismalariDetay,
    },
    {
      title: "2. Öğretmen Gelişimi",
      description: ogretmenGelisimiGiris,
      items: ogretmenCalismalariDetay,
    },
    {
      title: "3. Veli Gelişimi",
      description: veliGelisimiGiris,
      items: veliCalismalariDetay,
    },
  ],
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const veliSayfasi = {
  intro: sultandaVeliOlmak[0],
  story: {
    eyebrow: "Sultanda Veli Olmak",
    motto: "Aynı niyet ve istikamette buluşmak",
    rows: [
      {
        eyebrow: "Sultanda Veli Olmak",
        text: sultandaVeliOlmak[0],
        highlights: [
          "aynı niyet ve istikamette",
          "yol arkadaşımızdır",
        ],
      },
      {
        eyebrow: "Okul-aile iş birliği",
        text: sultandaVeliOlmak[1],
        highlights: [
          "veli görüşmeleri",
          "seminerler",
          "rehberlik çalışmalarıyla",
        ],
      },
      {
        eyebrow: "Ortak dil",
        text: sultandaVeliOlmak[2],
        highlights: [
          "aynı değer dünyasında",
          "bilgili, erdemli, sorumluluk sahibi",
        ],
      },
      {
        eyebrow: "Veli Akademisi",
        text: veliAkademisi,
        highlights: [
          "Veli Akademisi",
          "uzman seminerleri",
          "okul-aile iş birliği",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const sultandaYasam = {
  intro: sultandaYasamBilgilendirme.giris,
  story: {
    eyebrow: "Sultanda Yaşam",
    motto: "Butik okul, ayakkabısız okul, helâl gıda ve kantinsiz okul",
    rows: [
      {
        eyebrow: "1. Butik Okul",
        text: butikOkul.join(" "),
        highlights: [
          "butik okul",
          "az öğrenciyle çok ilgi",
        ],
      },
      {
        eyebrow: "2. Ayakkabısız Okul",
        text: ayakkabisizOkul,
        highlights: ["Temizlik imandandır", "Ayakkabısız Okul"],
      },
      {
        eyebrow: "3. Helâl Gıda ve Beslenme",
        text: helalGidaVeBeslenme.intro,
        highlights: [
          "Her lokmada güven, her günde sağlık",
          "sağlıklı beslenmesini",
        ],
      },
      ...helalGidaVeBeslenme.bolumler.map((b) => ({
        eyebrow: b.title,
        text: b.text,
        highlights: [b.title] as string[],
      })),
      {
        eyebrow: "4. Kantinsiz Okul",
        text: kantinsizOkul.join(" "),
        highlights: [
          "kantinsiz okul",
          "gönül rahatlığı",
        ],
      },
      {
        eyebrow: "Velilere Bilgilendirme",
        text: sultandaYasamBilgilendirme.giris,
        highlights: [
          "kişisel, sosyal ve ahlaki",
          "okul-aile iş birliğini",
        ],
      },
      ...sultandaYasamBilgilendirme.bolumler.map((b) => ({
        eyebrow: b.title,
        text: b.text,
        highlights: [b.title] as string[],
      })),
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

/** PDF dışı kademe sayfaları — eski içerik korundu; karar bekleniyor */
export const anaokuluSayfasi = {
  intro: anaokulu.intro[0],
  story: {
    eyebrow: "Anaokulu",
    motto: "Saf fıtratın muhafazası için sevgi dolu bir başlangıç",
    rows: anaokulu.intro.map((text, i) => ({
      eyebrow:
        i === 0
          ? "Program"
          : i === 1
            ? "Emanet bilinci"
            : i === 2
              ? "Kur’an yolculuğu"
              : "Âtiye hayali",
      text,
      highlights: [] as string[],
    })),
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const ilkokulSayfasi = {
  intro: ilkokul.paragraflar[0],
  story: {
    eyebrow: "İlkokul",
    motto: "İlk ilahî emir olan “Oku” ile başlayan bir yolculuk",
    rows: ilkokul.paragraflar.map((text, i) => ({
      eyebrow:
        i === 0
          ? "Okuma sevgisi"
          : i === 1
            ? "Hedefimiz"
            : i === 2
              ? "İlim yağmurları"
              : "Yapılandırmacı yaklaşım",
      text,
      highlights: [] as string[],
    })),
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const ortaokulSayfasi = {
  intro: ortaokul.paragraflar[0],
  story: {
    eyebrow: "Ortaokul",
    motto: "Kökü sabit, dalları gökte olan güzel bir ağaç",
    rows: ortaokul.paragraflar.map((text, i) => ({
      eyebrow:
        i === 0
          ? "Meyve toplama"
          : i === 1
            ? "Yiğit gençler"
            : "Atölye ve kulüpler",
      text,
      highlights: [] as string[],
    })),
  } satisfies OverlayPageStory,
  etut: {
    eyebrow: "Etüt",
    text: ortaokul.etut,
    highlights: [] as string[],
  } satisfies PageStoryRow,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

/** PDF: Nebevî Eğitim ve Hâl Dili */
export const nebeviEgitimSayfasi = {
  intro: nebevi.intro[0],
  story: {
    eyebrow: "Nebevî Eğitim ve Hâl Dili",
    motto: "Nebevî Eğitim ve Hâl Dili",
    rows: [
      {
        eyebrow: "Nebevî Eğitim ve Hâl Dili",
        text: nebevi.intro[0],
        highlights: [
          "muallim",
          "hâl dili",
          "Peygamber Efendimiz’in (s.a.s)",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

export const degerlerEgitimiSayfasi = {
  intro: degerler.intro[0],
  story: {
    eyebrow: "Değerler ve Manevi Eğitim",
    motto: "Okul hayatının tamamına yayılan bir mektep iklimi",
    rows: [
      ...degerler.intro.map((text, i) => ({
        eyebrow:
          i === 0
            ? "İnşa yolculuğu"
            : i === 1
              ? "Maarif Modeli"
              : i === 2
                ? "Mektep iklimi"
                : "Amacımız",
        text,
        highlights: [] as string[],
      })),
      ...degerler.bolumler.map((b) => ({
        eyebrow: b.title,
        text: b.text,
        highlights: [b.title] as string[],
      })),
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description: "",
  } satisfies OverlayPageGallery,
} as const;

/** Kurumsal kimlik — PDF Kimliğimiz paragrafları */
export const kurumsalKimligimiz = {
  intro: kurulusParagraflari[0],
  paragraphs: kurulusParagraflari,
  timeline: kurumsalTimeline,
} as const;
