/* -------------------------------------------------------------------------
   Hero slider veri modülü
   ─────────────────────────────────────────────────────────────────────────
   navigation.ts ile aynı desende statik typed veri.
   KRİTİK: Tüm metinler ilgili sayfa içeriklerinden birebir alınmıştır;
   hiçbir kelime değiştirilemez (projekurallari.md §1).
   Başlık ve açıklama birbirinden bağımsız, kendi içinde tam cümlelerdir
   (başlık, açıklamanın devamı değildir).
   Karakter sınırları: src/lib/hero-slide-limits.ts (Yönetim Paneli).
   ------------------------------------------------------------------------- */

import { PAGE_MEDIA } from "@/lib/menu-images";

export interface HeroSlide {
  id: string;
  /** Kart üstündeki pill etiketi (sayfa / bölüm başlığı) */
  tagline: string;
  /** Üç satıra bölünmüş başlık — kelimeler sayfa metninden birebir */
  titleLines: [string, string, string];
  /** Başlıktan bağımsız, kendi içinde tam cümle */
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
  /** Görsel yakınlaştırma (1–3); varsayılan 1 */
  mediaScale?: number;
  /** naturalWidth / naturalHeight; yoksa konteyner oranı kullanılır */
  mediaAspect?: number;
  /** Slayt görüntülenme süresi (saniye) */
  displayDuration?: number;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "nesil-tasavvurumuz",
    tagline: "NESİL TASAVVURUMUZ",
    titleLines: [
      "Yeryüzünde iyiliğin,",
      "merhametin ve adâletin",
      "temsilcisi bir nesil...",
    ],
    description:
      "Nesil tasavvurumuzun merkezinde; yalnızca başarılı ve donanımlı öğrenciler değil, vicdanı diri, merhameti güçlü, adaleti gözeten ve her varlığa emanet bilinciyle yaklaşan şahsiyetler yetiştirmek vardır.",
    buttonText: "Nesil Tasavvurumuz",
    buttonLink: "/kurumsal/nesil-tasavvurumuz",
    mediaUrl: PAGE_MEDIA.nesilTasavvur.src,
    mediaType: PAGE_MEDIA.nesilTasavvur.type,
    posterUrl: PAGE_MEDIA.nesilTasavvur.poster,
    displayDuration: 6,
  },
  {
    id: "kademeler",
    tagline: "SULTAN MEKTEBİ MODELİ",
    titleLines: [
      "Bilginin hikmete, bilincin",
      "ise erdeme dönüştüğü özgün",
      "bir eğitim modeli.",
    ],
    description:
      "Her öğrenciyi ruhu, kalbi, bedeni ve şahsiyetiyle bir bütün olarak ele alır.",
    buttonText: "Sultan Mektebi Modeli & Kademeler",
    buttonLink: "/egitim/kademeler",
    mediaUrl: "/site-media/IMG_5381.jpg",
    mediaType: "image",
    displayDuration: 6,
  },
  {
    id: "nebevi-egitim",
    tagline: "NEBEVÎ EĞİTİM",
    titleLines: [
      "Nebevî terbiyeyi günlük",
      "okul yaşamının merkezine",
      "yerleştiriyoruz.",
    ],
    description:
      "Efendimizin (s.a.v.) örnekliği, programımızın tam kalbinde yer alır.",
    buttonText: "Nebevî Eğitim ve Kur'an-ı Kerîm",
    buttonLink: "/egitim/nebevi-egitim",
    mediaUrl: PAGE_MEDIA.nebeviEgitim.src,
    mediaType: PAGE_MEDIA.nebeviEgitim.type,
    posterUrl: PAGE_MEDIA.nebeviEgitim.poster,
    displayDuration: 6,
  },
  {
    id: "degerler-egitimi",
    tagline: "DEĞERLER VE MÂNEVİ EĞİTİM",
    titleLines: [
      "Okul hayatının tamamına",
      "yayılan bir mektep",
      "iklimi",
    ],
    description:
      "Sultan Eğitim Kurumları olarak eğitimi yalnızca bilgi aktarma süreci olarak değil; çocuğun kalbine, zihnine ve şahsiyetine dokunan bir inşa yolculuğu olarak görüyoruz.",
    buttonText: "Değerler ve Mânevî Eğitim",
    buttonLink: "/egitim/degerler-egitimi",
    mediaUrl: "/site-media/degerler.jpg",
    mediaType: "image",
    displayDuration: 6,
  },
  {
    id: "akademik-gelisim",
    tagline: "BİREYSEL TAKİP",
    titleLines: [
      "Her evladımızın",
      "kabiliyetini emanet",
      "bilinciyle takip ediyoruz.",
    ],
    description:
      "Her evladımızın kabiliyetini emanet bilinciyle takip ediyor, ilmini ve gayretini adım adım büyütüyoruz.",
    buttonText: "Akademik Gelişim ve Tâkib",
    buttonLink: "/akademik/gelisim",
    mediaUrl: "/videos/akademik.mp4",
    mediaType: "video",
    posterUrl: "/videos/akademik-poster.jpg",
    displayDuration: 6,
  },
];
