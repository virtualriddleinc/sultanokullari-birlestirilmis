import "server-only";

import type { SiteMedia } from "@/content/site-media";
import type { SiteEvent, SiteNews } from "@/content/guncel";
import { staticEvents, staticNews } from "@/content/guncel";
import type { NedenItem } from "@/content/neden-sultan";
import type { InstagramPost } from "@/content/instagram";
import type { HeroSlide } from "@/features/hero/slides";
import type { Branch } from "@/content/branches";

import { HERO_SLIDES } from "@/features/hero/slides";
import { hexGalleryMedia, featuredVideo, mediaPageItems, yemekhaneMedia } from "@/content/site-media";
import { yemekhaneParagraphs } from "@/content/yemekhane";
import { nedenSultanItems } from "@/content/neden-sultan";
import {
  instagramHandle,
  instagramPosts,
  instagramProfileUrl,
} from "@/content/instagram";
import type { CmsBranch } from "@/lib/branches-data";
import { getPublishedBranches } from "@/lib/branches-data";
import { getPublishedEvents, getPublishedNews } from "@/lib/guncel-data";
import { mapPayloadMediaGroup } from "@/lib/payload-media";
import { getPayloadClient } from "@/lib/payload";
import { normalizeHeroSlide } from "@/lib/hero-slide-limits";
import type { JourneyChapter, QuickLinkItem } from "@/lib/home-shared";

export type { JourneyChapter, QuickLinkItem } from "@/lib/home-shared";

type FetchOptions = {
  draft?: boolean;
};

export type HomePageData = {
  heroSlides: HeroSlide[];
  mission: {
    tagline: string;
    titleLines: [string, string, string];
    description: string;
    secondaryDescription: string;
    levels: string[];
    decorMedia: SiteMedia[];
  };
  journey: {
    headline: string;
    chapters: JourneyChapter[];
  };
  neden: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    marqueeValues: string[];
    items: NedenItem[];
  };
  videoSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    video: SiteMedia;
  };
  branchesSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    branches: CmsBranch[];
  };
  guncelSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    featuredEventLabel: string;
    upcomingEventsLabel: string;
    newsLabel: string;
    featuredEventMedia: SiteMedia;
    events: SiteEvent[];
    news: SiteNews[];
  };
  instagramSection: {
    eyebrow: string;
    title: string;
    description: string;
    handle: string;
    profileUrl: string;
    posts: InstagramPost[];
  };
  quickLinksSection: {
    eyebrow: string;
    title: string;
    description: string;
    links: QuickLinkItem[];
  };
  infoModal: {
    enabled: boolean;
    brandLabel: string;
    title: string;
    subtitle: string;
    submitLabel: string;
    dismissLabel: string;
    kvkkText: string;
  };
  yemekhaneSection: {
    paragraphs: string[];
    media?: SiteMedia;
  };
};

const DEFAULT_MISSION = {
  tagline: "Gâyemiz · Ufkumuz",
  titleLines: [
    "Değer merkezli eğitim,",
    "güçlü bir gelecek vizyonu ile birleşiyor.",
    "",
  ] as [string, string, string],
  description:
    "Peygamber Efendimizin (s.a.s) izinde, üsve-i hasene olmayı hedefleyen; ilim, hikmet ve ahlâkla bütünleşmiş nesiller yetiştiriyoruz.",
  secondaryDescription:
    "Anaokulu, ilkokul ve ortaokul kademeleriyle bütüncül bir eğitim yolculuğu; okul öncesinden üniversiteye, câmi ve hâfızlık binasıyla bütünleşik Eğitim Külliyesi ufkumuz.",
  levels: ["Anaokulu", "İlkokul", "Ortaokul"],
  decorMedia: hexGalleryMedia.slice(0, 6) as unknown as SiteMedia[],
};

const DEFAULT_JOURNEY_HEADLINE =
  "Peygamber Efendimiz'in (s.a.s) İzinde Geleceğe Örnek Nesiller...";

const DEFAULT_NEDEN = {
  eyebrow: "Ayırt edici yaklaşım",
  title: "Neden",
  titleHighlight: "Sultan Okulları?",
  description:
    "Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hâfızlık ufkuna uzanan güçlü bir kurum dili.",
  ctaLabel: `${nedenSultanItems.length} maddenin tamamı`,
  ctaHref: "/kurumsal/neden-sultan",
  marqueeValues: [
    "İlim",
    "Hikmet",
    "Ahlâk",
    "Nebevî eğitim",
    "Hâfızlık",
    "Doğa",
    "Butik okul",
  ],
};

const DEFAULT_VIDEO = {
  eyebrow: "Tanıtım · Sinematik bakış",
  title: "Okul atmosferini yakından görün.",
  description:
    "Sultan Okulları'nın sınıf, bahçe ve etkinlik atmosferinden seçilen kısa bir tanıtım kesiti.",
  ctaLabel: "Görüşme planla",
  ctaHref: "/iletisim",
  video: featuredVideo,
};

const DEFAULT_BRANCHES_SECTION = {
  eyebrow: "Okullarımız",
  title: "Size en yakın Sultan okulunu keşfedin",
  description:
    "Size en yakın Sultan okulunu seçerek yol tarifi alabilir, okulumuza güvenli ve pratik bir şekilde ulaşabilirsiniz.",
  ctaLabel: "Sizi Arayalım",
  ctaHref: "/iletisim",
};

const DEFAULT_GUNCEL = {
  eyebrow: "Duyurular",
  title: "Etkinlikler ve haberler",
  description: "Okul takvimi, duyurular ve kurum içinden kısa gelişmeler tek alanda.",
  ctaLabel: "Tüm içerikler",
  ctaHref: "/guncel/haberler",
  featuredEventLabel: "Öne çıkan etkinlik",
  upcomingEventsLabel: "Yaklaşan etkinlikler",
  newsLabel: "Haberler",
  featuredEventMedia: mediaPageItems[1] as SiteMedia,
};

const DEFAULT_INSTAGRAM = {
  eyebrow: "Sosyal medya vitrini",
  title: "Sosyal Medyada Biz",
  description:
    "Sultan Okulları'nın resmî sosyal medya hesaplarından okul atmosferi, etkinlikler ve kısa video paylaşımları — kareler kendi hızında yana doğru akar.",
  handle: instagramHandle,
  profileUrl: instagramProfileUrl,
  posts: instagramPosts,
};

const DEFAULT_QUICK_LINKS = {
  eyebrow: "Kısa yollar",
  title: "Aradığınız sayfaya hızla ulaşın",
  description:
    "Kademeler, olanaklar ve duyurular için en sık kullanılan bağlantılar — şeritte gezinin veya tıklayın.",
  links: [
    { href: "/egitim/kademeler", label: "Kademeler", description: "Sultan Mektebi Modeli", iconKey: "book-open" },
    { href: "/egitim/nebevi-egitim", label: "Nebevî Eğitim", description: "Kur'an-ı Kerîm", iconKey: "graduation-cap" },
    { href: "/akademik/yabanci-dil", label: "Atölyeler", description: "Yabancı dil & atölye", iconKey: "palette" },
    { href: "/#yemekhane", label: "Yemekhane", description: "Kantinsiz okul projesi", iconKey: "hand-heart" },
    { href: "/rehberlik/egitim-koclugu", label: "Rehberlik", description: "Eğitim koçluğu", iconKey: "heart-handshake" },
    { href: "/kurumsal/burs-olanaklari", label: "Burs", description: "Burs olanakları", iconKey: "sprout" },
    { href: "/guncel/haberler", label: "Duyurular", description: "Haber ve etkinlikler", iconKey: "radio" },
    { href: "/iletisim", label: "İletişim", description: "Bizimle iletişime geçin", iconKey: "phone" },
  ],
};

const DEFAULT_INFO_MODAL = {
  enabled: true,
  brandLabel: "Sultan Okulları",
  title: "Sizi Arayalım!",
  subtitle:
    "Numaranızı bırakın, eğitim danışmanımız en kısa sürede sizi arayıp tüm sorularınızı yanıtlasın.",
  submitLabel: "Beni Arayın",
  dismissLabel: "Şimdi değil",
  kvkkText:
    "KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesini, tarafıma arama yapılmasını ve SMS gönderilmesini kabul ediyorum.",
};

const DEFAULT_YEMEKHANE = {
  paragraphs: [...yemekhaneParagraphs],
  media: yemekhaneMedia as SiteMedia,
};

function mapInfoModal(
  infoRaw?: Record<string, unknown>,
): HomePageData["infoModal"] {
  return {
    enabled: infoRaw?.enabled !== false,
    brandLabel: (infoRaw?.brandLabel as string) || DEFAULT_INFO_MODAL.brandLabel,
    title: (infoRaw?.title as string) || DEFAULT_INFO_MODAL.title,
    subtitle: (infoRaw?.subtitle as string) || DEFAULT_INFO_MODAL.subtitle,
    submitLabel: (infoRaw?.submitLabel as string) || DEFAULT_INFO_MODAL.submitLabel,
    dismissLabel: (infoRaw?.dismissLabel as string) || DEFAULT_INFO_MODAL.dismissLabel,
    kvkkText: (infoRaw?.kvkkText as string) || DEFAULT_INFO_MODAL.kvkkText,
  };
}

export async function getInfoModalData(
  options: FetchOptions = {},
): Promise<HomePageData["infoModal"]> {
  try {
    const payload = await getPayloadClient();
    const global = await payload.findGlobal({
      slug: "ana-sayfa",
      depth: 0,
      draft: options.draft,
    });
    const infoRaw = (global as unknown as Record<string, unknown>).infoModal as
      | Record<string, unknown>
      | undefined;
    return mapInfoModal(infoRaw);
  } catch {
    return mapInfoModal(undefined);
  }
}

function mapHeroSlide(doc: Record<string, unknown>, index: number): HeroSlide {
  const fallback = HERO_SLIDES[index];
  const media = mapPayloadMediaGroup(
    doc.slideMedia as Parameters<typeof mapPayloadMediaGroup>[0],
    fallback
      ? { kind: fallback.mediaType, src: fallback.mediaUrl, alt: fallback.tagline, poster: fallback.posterUrl }
      : undefined,
  );

  const focalRaw = doc.focalPoint as { x?: number; y?: number } | null | undefined;

  return normalizeHeroSlide({
    id: String(doc.id ?? index),
    tagline: (doc.tagline as string) || fallback?.tagline || "",
    titleLines: [
      (doc.titleLine1 as string) || fallback?.titleLines[0] || "",
      (doc.titleLine2 as string) || fallback?.titleLines[1] || "",
      (doc.titleLine3 as string) || fallback?.titleLines[2] || "",
    ],
    description: (doc.description as string) || fallback?.description || "",
    buttonText: (doc.buttonText as string) || fallback?.buttonText || "",
    buttonLink: (doc.buttonLink as string) || fallback?.buttonLink || "",
    mediaUrl: media?.src || fallback?.mediaUrl || "",
    mediaType: media?.kind || fallback?.mediaType || "image",
    posterUrl: media?.poster || fallback?.posterUrl,
    focalPoint:
      focalRaw && typeof focalRaw.x === "number" && typeof focalRaw.y === "number"
        ? { x: focalRaw.x, y: focalRaw.y }
        : fallback?.focalPoint,
    mediaScale:
      typeof doc.mediaScale === "number"
        ? doc.mediaScale
        : fallback?.mediaScale,
    mediaAspect:
      typeof doc.mediaAspect === "number"
        ? doc.mediaAspect
        : fallback?.mediaAspect,
    displayDuration: (doc.displayDuration as number) || fallback?.displayDuration || 6,
  });
}

const JOURNEY_FALLBACK_ICONS = [
  "book-open-text",
  "compass",
  "flask-conical",
  "palette",
  "sparkles",
] as const;

const JOURNEY_FALLBACK_MEDIA = [
  { kind: "video" as const, src: "/site-media/VID-20260429-WA0127.mp4", alt: "Nebevî eğitim", poster: "/site-media/IMG-20260429-WA0090.jpg" },
  { kind: "video" as const, src: "/site-media/VID-20260429-WA0119.mp4", alt: "Hâfızlık", poster: "/site-media/IMG-20260429-WA0122.jpg" },
  { kind: "image" as const, src: "/site-media/IMG-20260429-WA0086.jpg", alt: "Keşf-i Bilim" },
  { kind: "video" as const, src: "/site-media/VID-20260429-WA0141.mp4", alt: "Sanat ve Spor", poster: "/site-media/IMG-20260429-WA0130.jpg" },
  { kind: "image" as const, src: "/site-media/IMG-20260429-WA0089.jpg", alt: "Ayakkabısız okul" },
];

const DEFAULT_JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    eyebrow: "01 / Köken",
    title: "Nebevî eğitim",
    body: "Peygamberimizi (s.a.s) tanıyan, seven ve hayatına rehber edinen; üsve-i hasene ile İslam ahlâkı ile ahlâklanmış nesiller yetiştiriyoruz.",
    cta: { href: "/egitim/nebevi-egitim", label: "Nebevî eğitim" },
    iconKey: "book-open-text",
    media: JOURNEY_FALLBACK_MEDIA[0],
  },
  {
    eyebrow: "02 / Kalp",
    title: "Hâfızlık ve Otağ-ı Hümâyun",
    body: "Mescid-rahle usulüyle Kur'an ile bütünleşen; kalbe erişen ilmi irfâna çeviren bir hâfızlık programı.",
    cta: { href: "/egitim/hafizlik", label: "Hâfızlık programı" },
    iconKey: "compass",
    media: JOURNEY_FALLBACK_MEDIA[1],
  },
  {
    eyebrow: "03 / Bilim",
    title: "Keşf-i Bilim",
    body: "Okul öncesinden başlayan bilim eğitimini yaparak ve yaşayarak destekliyoruz; Cezeri, İbni Sina ve Ali Kuşçuyla geçmişe, bilimsel projelerle geleceğe yolculuk.",
    cta: { href: "/atolyeler-ve-kulupler", label: "Atölye ve kulüpler" },
    iconKey: "flask-conical",
    media: JOURNEY_FALLBACK_MEDIA[2],
  },
  {
    eyebrow: "04 / Keşif",
    title: "Sanat ve Spor",
    body: "Her öğrencimizin ilgi ve yeteneklerini keşfetmesine zemin hazırlıyoruz: Hüsn-ü Hat, Ebru, okçuluk, binicilik ve yüzme ile köklü bir yetişme.",
    cta: { href: "/atolyeler-ve-kulupler", label: "Atölye ve kulüpler" },
    iconKey: "palette",
    media: JOURNEY_FALLBACK_MEDIA[3],
  },
  {
    eyebrow: "05 / İklim",
    title: "Ayakkabısız okul",
    body: "Temiz, huzurlu ve ailesinde gibi hisseden öğrenciler için tasarlanmış sıcak ve güvenli butik okul iklimi.",
    cta: { href: "/kurumsal/neden-sultan", label: "Neden Sultan?" },
    iconKey: "sparkles",
    media: JOURNEY_FALLBACK_MEDIA[4],
  },
];

function mapJourneyChapter(doc: Record<string, unknown>, index: number): JourneyChapter {
  const media = mapPayloadMediaGroup(
    doc.chapterMedia as Parameters<typeof mapPayloadMediaGroup>[0],
    JOURNEY_FALLBACK_MEDIA[index],
  )!;

  return {
    eyebrow: doc.eyebrow as string,
    title: doc.title as string,
    body: doc.body as string,
    cta: {
      href: doc.ctaHref as string,
      label: doc.ctaLabel as string,
    },
    iconKey: (doc.iconKey as string) || JOURNEY_FALLBACK_ICONS[index] || "book-open-text",
    media,
  };
}

export async function getHomePageData(
  options: FetchOptions = {},
): Promise<HomePageData> {
  const [events, news, branches] = await Promise.all([
    getPublishedEvents(options),
    getPublishedNews(options),
    getPublishedBranches(options),
  ]);

  const guncelEvents = events.length > 0 ? events : staticEvents;
  const guncelNews = news.length > 0 ? news : staticNews;

  let globalData: Record<string, unknown> = {};
  let heroDocs: Record<string, unknown>[] = [];
  let journeyDocs: Record<string, unknown>[] = [];
  let nedenDocs: Record<string, unknown>[] = [];
  let instagramDocs: Record<string, unknown>[] = [];

  try {
    const payload = await getPayloadClient();
    const [global, hero, journey, neden, instagram] = await Promise.all([
      payload.findGlobal({
        slug: "ana-sayfa",
        depth: 2,
        draft: options.draft,
      }),
      payload.find({
        collection: "hero-slides",
        limit: 20,
        sort: "_order",
        depth: 2,
        draft: options.draft,
      }),
      payload.find({
        collection: "journey-chapters",
        limit: 20,
        sort: "_order",
        depth: 2,
        draft: options.draft,
      }),
      payload.find({
        collection: "neden-sultan-items",
        limit: 50,
        sort: "_order",
        depth: 0,
        draft: options.draft,
      }),
      payload.find({
        collection: "instagram-posts",
        limit: 20,
        sort: "_order",
        depth: 2,
        draft: options.draft,
      }),
    ]);

    globalData = global as unknown as Record<string, unknown>;
    heroDocs = hero.docs as unknown as Record<string, unknown>[];
    journeyDocs = journey.docs as unknown as Record<string, unknown>[];
    nedenDocs = neden.docs as unknown as Record<string, unknown>[];
    instagramDocs = instagram.docs as unknown as Record<string, unknown>[];
  } catch (error) {
    console.warn("Ana sayfa CMS verisi alınamadı, statik veri kullanılıyor.", error);
  }

  const missionRaw = globalData.mission as Record<string, unknown> | undefined;
  const journeyRaw = globalData.journey as Record<string, unknown> | undefined;
  const nedenRaw = globalData.neden as Record<string, unknown> | undefined;
  const videoRaw = globalData.videoSection as Record<string, unknown> | undefined;
  const branchesRaw = globalData.branchesSection as Record<string, unknown> | undefined;
  const guncelRaw = globalData.guncelSection as Record<string, unknown> | undefined;
  const instagramRaw = globalData.instagramSection as Record<string, unknown> | undefined;
  const quickRaw = globalData.quickLinksSection as Record<string, unknown> | undefined;
  const infoRaw = globalData.infoModal as Record<string, unknown> | undefined;
  const yemekhaneRaw = globalData.yemekhaneSection as
    | Record<string, unknown>
    | undefined;

  const heroSlides =
    heroDocs.length > 0
      ? heroDocs.map(mapHeroSlide)
      : HERO_SLIDES.map(normalizeHeroSlide);

  const decorMediaRaw = missionRaw?.decorMedia as
    | Array<{ media?: Parameters<typeof mapPayloadMediaGroup>[0] }>
    | undefined;
  const decorMedia =
    decorMediaRaw?.length
      ? decorMediaRaw
          .map((d, i) => mapPayloadMediaGroup(d.media, DEFAULT_MISSION.decorMedia[i]))
          .filter((m): m is SiteMedia => Boolean(m))
      : DEFAULT_MISSION.decorMedia;

  const levelsRaw = missionRaw?.levels as Array<{ label?: string }> | undefined;

  const journeyChapters =
    journeyDocs.length > 0
      ? journeyDocs.map(mapJourneyChapter)
      : DEFAULT_JOURNEY_CHAPTERS;

  const nedenItems: NedenItem[] =
    nedenDocs.length > 0
      ? nedenDocs.map((d) => ({
          headline: d.headline as string,
          body: d.body as string,
        }))
      : nedenSultanItems;

  const marqueeRaw = nedenRaw?.marqueeValues as Array<{ value?: string }> | undefined;

  const instagramPostsMapped: InstagramPost[] =
    instagramDocs.length > 0
      ? instagramDocs.map((d) => {
          const media = mapPayloadMediaGroup(
            d.postMedia as Parameters<typeof mapPayloadMediaGroup>[0],
          );
          return {
            id: String(d.id),
            url: (d.externalUrl as string) || instagramProfileUrl,
            kind: "reel" as const,
            title: d.title as string,
            description: (d.description as string) || undefined,
            videoSrc: media?.src,
          };
        })
      : instagramPosts;

  const quickLinksRaw = quickRaw?.links as
    | Array<{ href?: string; label?: string; description?: string; iconKey?: string }>
    | undefined;

  const yemekhaneParagraphsRaw = yemekhaneRaw?.paragraphs as
    | Array<{ text?: string }>
    | undefined;
  const yemekhaneParagraphsMapped =
    yemekhaneParagraphsRaw
      ?.map((p) => p.text?.trim())
      .filter((text): text is string => Boolean(text)) ?? [];

  return {
    heroSlides,
    mission: {
      tagline: (missionRaw?.tagline as string) || DEFAULT_MISSION.tagline,
      titleLines: [
        (missionRaw?.titleLine1 as string) || DEFAULT_MISSION.titleLines[0],
        (missionRaw?.titleLine2 as string) || DEFAULT_MISSION.titleLines[1],
        (missionRaw?.titleLine3 as string) || DEFAULT_MISSION.titleLines[2],
      ],
      description: (missionRaw?.description as string) || DEFAULT_MISSION.description,
      secondaryDescription:
        (missionRaw?.secondaryDescription as string) ||
        DEFAULT_MISSION.secondaryDescription,
      levels:
        levelsRaw?.map((l) => l.label).filter(Boolean) as string[] ||
        DEFAULT_MISSION.levels,
      decorMedia,
    },
    journey: {
      headline: (journeyRaw?.headline as string) || DEFAULT_JOURNEY_HEADLINE,
      chapters: journeyChapters,
    },
    neden: {
      eyebrow: (nedenRaw?.eyebrow as string) || DEFAULT_NEDEN.eyebrow,
      title: (nedenRaw?.title as string) || DEFAULT_NEDEN.title,
      titleHighlight:
        (nedenRaw?.titleHighlight as string) || DEFAULT_NEDEN.titleHighlight,
      description: (nedenRaw?.description as string) || DEFAULT_NEDEN.description,
      ctaLabel: (nedenRaw?.ctaLabel as string) || DEFAULT_NEDEN.ctaLabel,
      ctaHref: (nedenRaw?.ctaHref as string) || DEFAULT_NEDEN.ctaHref,
      marqueeValues:
        marqueeRaw?.map((v) => v.value).filter(Boolean) as string[] ||
        DEFAULT_NEDEN.marqueeValues,
      items: nedenItems,
    },
    videoSection: {
      ...DEFAULT_VIDEO,
      eyebrow: (videoRaw?.eyebrow as string) || DEFAULT_VIDEO.eyebrow,
      title: (videoRaw?.title as string) || DEFAULT_VIDEO.title,
      description: (videoRaw?.description as string) || DEFAULT_VIDEO.description,
      ctaLabel: (videoRaw?.ctaLabel as string) || DEFAULT_VIDEO.ctaLabel,
      ctaHref: (videoRaw?.ctaHref as string) || DEFAULT_VIDEO.ctaHref,
      video:
        mapPayloadMediaGroup(
          videoRaw?.featuredVideo as Parameters<typeof mapPayloadMediaGroup>[0],
          DEFAULT_VIDEO.video,
        ) || DEFAULT_VIDEO.video,
    },
    branchesSection: {
      eyebrow: (branchesRaw?.eyebrow as string) || DEFAULT_BRANCHES_SECTION.eyebrow,
      title: (branchesRaw?.title as string) || DEFAULT_BRANCHES_SECTION.title,
      description:
        (branchesRaw?.description as string) || DEFAULT_BRANCHES_SECTION.description,
      ctaLabel: (branchesRaw?.ctaLabel as string) || DEFAULT_BRANCHES_SECTION.ctaLabel,
      ctaHref: (branchesRaw?.ctaHref as string) || DEFAULT_BRANCHES_SECTION.ctaHref,
      branches,
    },
    guncelSection: {
      eyebrow: (guncelRaw?.eyebrow as string) || DEFAULT_GUNCEL.eyebrow,
      title: (guncelRaw?.title as string) || DEFAULT_GUNCEL.title,
      description: (guncelRaw?.description as string) || DEFAULT_GUNCEL.description,
      ctaLabel: (guncelRaw?.ctaLabel as string) || DEFAULT_GUNCEL.ctaLabel,
      ctaHref: (guncelRaw?.ctaHref as string) || DEFAULT_GUNCEL.ctaHref,
      featuredEventLabel:
        (guncelRaw?.featuredEventLabel as string) ||
        DEFAULT_GUNCEL.featuredEventLabel,
      upcomingEventsLabel:
        (guncelRaw?.upcomingEventsLabel as string) ||
        DEFAULT_GUNCEL.upcomingEventsLabel,
      newsLabel: (guncelRaw?.newsLabel as string) || DEFAULT_GUNCEL.newsLabel,
      featuredEventMedia:
        mapPayloadMediaGroup(
          guncelRaw?.featuredEventMedia as Parameters<typeof mapPayloadMediaGroup>[0],
          DEFAULT_GUNCEL.featuredEventMedia,
        ) || DEFAULT_GUNCEL.featuredEventMedia,
      events: guncelEvents,
      news: guncelNews,
    },
    instagramSection: {
      eyebrow: (instagramRaw?.eyebrow as string) || DEFAULT_INSTAGRAM.eyebrow,
      title: (instagramRaw?.title as string) || DEFAULT_INSTAGRAM.title,
      description:
        (instagramRaw?.description as string) || DEFAULT_INSTAGRAM.description,
      handle: (instagramRaw?.handle as string) || DEFAULT_INSTAGRAM.handle,
      profileUrl: (instagramRaw?.profileUrl as string) || DEFAULT_INSTAGRAM.profileUrl,
      posts: instagramPostsMapped,
    },
    quickLinksSection: {
      eyebrow: (quickRaw?.eyebrow as string) || DEFAULT_QUICK_LINKS.eyebrow,
      title: (quickRaw?.title as string) || DEFAULT_QUICK_LINKS.title,
      description: (quickRaw?.description as string) || DEFAULT_QUICK_LINKS.description,
      links:
        quickLinksRaw?.length
          ? quickLinksRaw.map((l) => ({
              href: l.href || "/",
              label: l.label || "",
              description: l.description || "",
              iconKey: l.iconKey || "book-open",
            }))
          : DEFAULT_QUICK_LINKS.links,
    },
    infoModal: mapInfoModal(infoRaw),
    yemekhaneSection: {
      paragraphs:
        yemekhaneParagraphsMapped.length > 0
          ? yemekhaneParagraphsMapped
          : DEFAULT_YEMEKHANE.paragraphs,
      media:
        mapPayloadMediaGroup(
          yemekhaneRaw?.media as Parameters<typeof mapPayloadMediaGroup>[0],
          DEFAULT_YEMEKHANE.media,
        ) || DEFAULT_YEMEKHANE.media,
    },
  };
}

export async function getNedenSultanItems(
  options: FetchOptions = {},
): Promise<NedenItem[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "neden-sultan-items",
      limit: 50,
      sort: "_order",
      depth: 0,
      draft: options.draft,
    });
    if (result.docs.length === 0) return nedenSultanItems;
    return result.docs.map((d) => ({
      headline: d.headline as string,
      body: d.body as string,
    }));
  } catch {
    return nedenSultanItems;
  }
}

export type { Branch };
