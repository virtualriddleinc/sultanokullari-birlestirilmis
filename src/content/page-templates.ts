/** Kurumsal kimlik sayfası şablonu — sayfa içerikleri (site-icerigi.docx kaynaklı). */

import type { PageStoryRow } from "@/components/layout/page-story-section";
import {
  anaokulu,
  ciftDil,
  degerler,
  ilkokul,
  nebevi,
  ortaokul,
} from "@/content/egitim";
import { kurulusParagraflari, kurumsalTimeline } from "@/content/kurumsal";
import {
  ogrenciCalismalari,
  ogretmenCalismalari,
  rehberlikGiris,
  veliAkademisi,
  veliCalismalari,
} from "@/content/rehberlik";
import { olcmeGiris } from "@/content/olcme";

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
  intro:
    "Sultan eğitim kurumları olarak gayemiz, milli ve Mânevî değerlerle kuşanmış, millet ve ümmet bilincine sahip nesiller yetiştirmektir.",
  story: {
    eyebrow: "Niyetimiz",
    motto: "Gayemiz ve istikametimizle âtiyeye yürüyoruz",
    rows: [
      {
        eyebrow: "Gayemiz",
        text: kurulusParagraflari[1],
        highlights: [
          "milli ve Mânevî değerlerle",
          "millet ve ümmet bilincine",
          "ahlâklı, dürüst, çalışkan, saygılı",
        ],
      },
      {
        eyebrow: "İstikametimiz",
        text: kurulusParagraflari[0],
        highlights: [
          "fennî ve İslami ilimlerle",
          "Nebevî eğitim modeliyle",
          "2016-2017",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Niyetimizi ve istikametimizi yansıtan kampüs ve eğitim atmosferinden bir seçki.",
  } satisfies OverlayPageGallery,
} as const;

export const nesilTasavvurumuz = {
  intro: "Yetişmesini hedeflediğimiz neslin tasavvuru ve ufku.",
  story: {
    eyebrow: "Nesil Tasavvurumuz",
    motto: "Kökü mâzide, ufku âtîde bir nesil yetiştirmek",
    rows: [
      {
        eyebrow: "Tasavvurumuz",
        text: kurulusParagraflari[2],
        highlights: ["Anadolu ve Fen lisesi", "Eğitim Külliyesi"],
      },
      {
        eyebrow: "Gayemiz",
        text: kurulusParagraflari[1],
        highlights: [
          "geçmişini bilip geleceğine sahip çıkan",
          "çağın sorunlarını fark ederek",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  timeline: kurumsalTimeline,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Nesil tasavvurumuzu yansıtan eğitim ve kampüs yaşamından fotoğraf ve videolar.",
  } satisfies OverlayPageGallery,
} as const;

export const kurumsalDegerlerimiz = {
  intro:
    "Mâddî ve Mânevî eğitimi birbirini tamamlayan ve ayrılmaz bir bütünün parçaları olarak görüyor, buna uygun eğitim planları oluşturuyoruz.",
  story: {
    eyebrow: "Değerlerimiz",
    motto: "Değerlerini yaşatan sultanlar bu okulda",
    rows: [
      {
        eyebrow: "Temel değerler",
        text: kurulusParagraflari[1],
        highlights: [
          "milli ve Mânevî değerlerle",
          "ahlâklı, dürüst, çalışkan, saygılı",
          "çevresine örnek",
        ],
      },
      {
        eyebrow: "Eğitim anlayışı",
        text: "Çocuklarımıza Mâddî ve Mânevî değerlerimizi öğretiyor ve bu değerlerle bireysel ve toplumsal hayatına yön veren nesiller yetiştiriyoruz.",
        highlights: [
          "Mâddî ve Mânevî değerlerimizi",
          "bireysel ve toplumsal hayatına yön veren",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Kurumsal değerlerimizi yaşatan okul atmosferinden fotoğraf ve videolar.",
  } satisfies OverlayPageGallery,
} as const;

export const kademeler = {
  intro:
    "Bilginin hikmete, bilincin ise erdeme dönüştüğü özgün bir eğitim modeli",
  story: {
    eyebrow: "Sultan Mektebi Modeli",
    motto: "Her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bütün olarak ele alırız",
    rows: [
      {
        eyebrow: "Model",
        text: "Her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bir bütün olarak ele alır; kökü mâzide, ufku âtîde bir nesil yetiştirmeyi amaçlar.",
        highlights: [
          "ruhu, kalbi, bedeni ve şahsiyetiyle",
          "kökü mâzide, ufku âtîde",
        ],
      },
      {
        eyebrow: "Kademeler",
        text: "Anaokulu, ilkokul ve ortaokul kademelerinde uygulanır.",
        highlights: ["Anaokulu, ilkokul ve ortaokul"],
      },
    ],
  } satisfies OverlayPageStory,
  kademeSatirlari: [
    {
      eyebrow: "Anaokulu",
      text: anaokulu.intro[0],
      highlights: ["îmân ve irfân tohumlarını", "ruhsal ve bedensel gelişimlerine"],
    },
    {
      eyebrow: "İlkokul",
      text: ilkokul.paragraflar[0],
      highlights: ["okuma ve yazma sevgisini", "ilk ilahî emre"],
    },
    {
      eyebrow: "Ortaokul",
      text: ortaokul.paragraflar[0],
      highlights: ["sağlam ağacımızın meyvelerini", "ortaokulumuzda"],
    },
  ] satisfies readonly PageStoryRow[],
  gallery: {
    title: "Görsel Galeri",
    description:
      "Sultan Mektebi Modeli ve kademelerimizden fotoğraf ve videolardan bir seçki.",
  } satisfies OverlayPageGallery,
} as const;

export const akademikGelisim = {
  intro:
    "Her evladımızın kabiliyetini emanet bilinciyle tâkib ediyor, ilmini ve gayretini adım adım büyütüyoruz.",
  story: {
    eyebrow: "Akademik Gelişim",
    motto: "Öğrenme süreçlerini çeşitli araç ve yöntemlerle değerlendiriyoruz",
    rows: [
      {
        eyebrow: "Tâkib",
        text: olcmeGiris,
        highlights: ["akademik ve Mânevî başarılarını", "ödüllendiriyoruz"],
      },
      {
        eyebrow: "Emanet bilinci",
        text: "Her evladımızın kabiliyetini emanet bilinciyle tâkib ediyor, ilmini ve gayretini adım adım büyütüyoruz.",
        highlights: ["emanet bilinciyle", "adım adım büyütüyoruz"],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Akademik gelişim ve ölçme-değerlendirme süreçlerimizden görsel bir seçki.",
  } satisfies OverlayPageGallery,
} as const;

export const yabanciDil = {
  intro:
    "Arapça ve İngilizce; alanında uzman yabancı öğretmenlerle okul öncesi kademesinden itibaren dinleme, anlama, konuşma, okuma ve yazma becerilerinin tümünü dengeli geliştiren program.",
  story: {
    eyebrow: "Çift Yabancı Dil",
    motto: ciftDil.motto,
    rows: ciftDil.intro.map((text, i) => ({
      eyebrow:
        i === 0
          ? "Çift dil"
          : i === 1
            ? "Beceriler"
            : "Gelecek",
      text,
      highlights:
        i === 0
          ? ["Arapça ve İngilizce", "uzman yabancı öğretmenlerimiz"]
          : i === 1
            ? [
                "dinleme, anlama, konuşma, okuma ve yazma",
                "yabancı dil öğrenme",
              ]
            : ["İngilizce ve Arapça", "çok iyi gelecek"],
    })),
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Çift yabancı dil eğitimi ve atölye çalışmalarından fotoğraf ve videolar.",
  } satisfies OverlayPageGallery,
} as const;

export const rehberlikKocluk = {
  intro: "Başarıdan ziyade şahsiyete odaklanan bir model uyguluyoruz",
  story: {
    eyebrow: "Rehberlik",
    motto: "Her birinin ayrı bir birey olduğunun bilincindeyiz",
    rows: [
      {
        eyebrow: "Yaklaşımımız",
        text: rehberlikGiris,
        highlights: [
          "akademik, duygusal, Mânevî ve sosyal",
          "dört başlık altında",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  calismaBasliklari: [
    { title: "Öğrenci çalışmaları", items: ogrenciCalismalari },
    { title: "Veli çalışmaları", items: veliCalismalari },
    { title: "Öğretmen çalışmaları", items: ogretmenCalismalari },
  ],
  gallery: {
    title: "Görsel Galeri",
    description:
      "Rehberlik ve eğitim koçluğu çalışmalarımızdan fotoğraf ve videolar.",
  } satisfies OverlayPageGallery,
} as const;

export const veliSayfasi = {
  intro: "Başarıdan ziyade şahsiyete odaklanan bir model uyguluyoruz",
  story: {
    eyebrow: "Veli Akademisi",
    motto: "Okul–veli işbirliğiyle çocuğun gelişim yolculuğu",
    rows: [
      {
        eyebrow: "Veli olmak",
        text: "Çocuklarımızın ruhsal ve bedensel gelişiminde doğru rehberliğin hayati önem taşıdığının bilincindeyiz.",
        highlights: ["ruhsal ve bedensel gelişiminde", "doğru rehberliğin"],
      },
      {
        eyebrow: "Veli Akademisi",
        text: veliAkademisi,
        highlights: [
          "iletişim ve işbirliğini güçlendirmek",
          "seminerler",
          "ebeveyn kitap buluşmaları",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Veli akademisi ve okul–veli etkinliklerinden fotoğraf ve videolar.",
  } satisfies OverlayPageGallery,
} as const;

export const sultandaYasam = {
  intro:
    "Özel Sultan Okulları'nda eğitim; öğrencilerimizin akademik gelişimlerinin yanında kişisel, sosyal ve ahlâkî becerilerini de desteklemeyi amaçlar.",
  story: {
    eyebrow: "Sultanda Yaşam",
    motto: "Akademik gelişimin yanında kişisel, sosyal ve ahlâkî beceriler",
    rows: [
      {
        eyebrow: "Yaşam",
        text: "Özel Sultan Okulları'nda eğitim; öğrencilerimizin akademik gelişimlerinin yanında kişisel, sosyal ve ahlâkî becerilerini de desteklemeyi amaçlar.",
        highlights: [
          "akademik gelişimlerinin yanında",
          "kişisel, sosyal ve ahlâkî becerilerini",
        ],
      },
      {
        eyebrow: "Okul ortamı",
        text: "Ayakkabısız okul projemizle öğrencilerimize temiz, kendilerini rahat ve huzurlu hissettikleri sıcak bir okul ortamı hazırladık.",
        highlights: ["Ayakkabısız okul projemizle", "temiz", "huzurlu"],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Sultanda yaşam ve okul atmosferinden fotoğraf ve videolardan bir seçki.",
  } satisfies OverlayPageGallery,
} as const;

export const anaokuluSayfasi = {
  intro:
    "Fıtrat üzere güvenli ve sevgi dolu bir başlangıç; Kur’an ve Peygamber (s.a.s) muhabbetiyle bütünleşik okul öncesi eğitim.",
  story: {
    eyebrow: "Anaokulu",
    motto: "Saf fıtratın muhafazası için sevgi dolu bir başlangıç",
    rows: [
      {
        eyebrow: "Program",
        text: anaokulu.intro[0],
        highlights: ["îmân ve irfân tohumlarını", "ruhsal ve bedensel gelişimlerine"],
      },
      {
        eyebrow: "Emanet bilinci",
        text: anaokulu.intro[1],
        highlights: ["gönüllerine hitap", "bedeni, zihni ve ahlâkî gelişimlerini"],
      },
      {
        eyebrow: "Kur’an yolculuğu",
        text: anaokulu.intro[2],
        highlights: [
          "“Kur’an”",
          "“Peygamber (s.a.s) Ahlâkı”",
          "Kur’an ve Peygamber (s.a.s) muhabbetini",
        ],
      },
      {
        eyebrow: "Âtiye hayali",
        text: anaokulu.intro[3],
        highlights: ["ilim sancağını âtiye taşıyor", "geleceğin Aliler’ini"],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Anaokulu programımızdan fotoğraf ve videolardan bir seçki. Büyütmek için bir görsele dokunun.",
  } satisfies OverlayPageGallery,
} as const;

export const ilkokulSayfasi = {
  intro:
    "Okuma sevgisi, milli ve Mânevî değerler, Kur’an ve siyer dersleriyle güçlü temeller.",
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
      highlights:
        i === 0
          ? ["ilk ilahî emre", "okuma ve yazma sevgisini"]
          : i === 1
            ? [
                "milli ve Mânevî değerlerine",
                "Zaman bendedir ve mekân bana emanettir!",
              ]
            : i === 2
              ? ["Kur’an-ı Kerîm", "îmân ve irfân tohumlarını", "ilim yağmurlarıyla"]
              : ["yapılandırmacı yaklaşım", "fen laboratuvarında"],
    })),
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "İlkokul programımızdan fotoğraf ve videolardan bir seçki. Büyütmek için bir görsele dokunun.",
  } satisfies OverlayPageGallery,
} as const;

export const ortaokulSayfasi = {
  intro:
    "Kökleri sağlam, teknolojiyi bilinçli kullanan ve topluma yön verecek yiğit gençler.",
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
      highlights:
        i === 0
          ? ["sağlam ağacımızın meyvelerini", "ortaokulumuzda"]
          : i === 1
            ? ["vefâyla merhameti", "yiğit gençler"]
            : [
                "robotik kodlama",
                "İngilizce drama",
                "münâzara ve yarışma kulüpleri",
              ],
    })),
  } satisfies OverlayPageStory,
  etut: {
    eyebrow: "Etüt",
    text: ortaokul.etut,
    highlights: [
      "haftada üç gün",
      "konu tekrarı ve soru çözümüyle",
      "gerekli ders desteğini",
    ],
  } satisfies PageStoryRow,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Ortaokul programımızdan fotoğraf ve videolardan bir seçki. Büyütmek için bir görsele dokunun.",
  } satisfies OverlayPageGallery,
} as const;

export const nebeviEgitimSayfasi = {
  intro:
    "Peygamber Efendimizin (s.a.s) muallîm oluşunu rehber alan; siyer, Peygamber (s.a.s) Ahlâkı ve üsve-i hasene örnekliğiyle çocuklarımızın gönüllerine dokunan program.",
  story: {
    eyebrow: "Nebevî Eğitim",
    motto: "Üsve-i hasene ile gönüllere işlenen muhabbet",
    rows: [
      {
        text: nebevi.intro[0],
        highlights: [
          "üsve-i hasene",
          `“${nebevi.hadithQuote}”`,
          "çağlar ötesi",
        ],
      },
      {
        text: nebevi.intro[1],
        highlights: [
          "Siyer",
          "Peygamber (s.a.s) Ahlâkı",
          "saf ve duru gönüllerine",
        ],
      },
    ],
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Nebevî eğitim programımızdan fotoğraf ve videolardan bir seçki. Büyütmek için bir görsele dokunun.",
  } satisfies OverlayPageGallery,
} as const;

export const degerlerEgitimiSayfasi = {
  intro:
    "Müfredatın her alanına nakış nakış işlenmiş değerler eğitimi; komisyon planı, sınıf rehberliği ve etkinliklerle yaşatılır.",
  story: {
    eyebrow: "Değerler Eğitimi",
    motto: "Müfredata nakış nakış işlenmiş değerler omurgası",
    rows: degerler.intro.map((text, i) => ({
      eyebrow:
        i === 0
          ? "Fıtrat üzere"
          : i === 1
            ? "Komisyon planı"
            : "Sınıf etkinlikleri",
      text,
      highlights:
        i === 0
          ? ["değerler eğitimi", "nakış nakış işlenmiş"]
          : i === 1
            ? [
                "Değerler Eğitimi Komisyonu",
                "dürüstlük, sorumluluk, yardımlaşma",
              ]
            : ["pano", "duvar gazetesi", "şiir, kompozisyon"],
    })),
  } satisfies OverlayPageStory,
  gallery: {
    title: "Görsel Galeri",
    description:
      "Değerler eğitimi programımızdan fotoğraf ve videolardan bir seçki. Büyütmek için bir görsele dokunun.",
  } satisfies OverlayPageGallery,
} as const;
