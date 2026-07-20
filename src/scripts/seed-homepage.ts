import { config } from "dotenv";

config({ path: ".env.local" });

import { HERO_SLIDES } from "@/features/hero/slides";
import { branches } from "@/content/branches";
import { nedenSultanItems } from "@/content/neden-sultan";
import {
  instagramHandle,
  instagramPosts,
  instagramProfileUrl,
} from "@/content/instagram";
import {
  branchGalleryMedia,
  branchPreviewMedia,
  featuredVideo,
  mediaPageItems,
} from "@/content/site-media";
import { PAGE_MEDIA } from "@/lib/menu-images";
import { DEFAULT_MISSION } from "@/lib/mission-defaults";
import { HERO_SLIDE_LIMITS, truncateHeroText } from "@/lib/hero-slide-limits";

const BRANCH_ROUTES: Record<string, { citySlug: string; campusSlug: string }> = {
  sancaktepe: { citySlug: "istanbul", campusSlug: "sancaktepe" },
  basiskele: { citySlug: "kocaeli", campusSlug: "basiskele" },
  serdivan: { citySlug: "sakarya", campusSlug: "serdivan" },
  sincan: { citySlug: "ankara", campusSlug: "sincan" },
  mevlana: { citySlug: "konya", campusSlug: "mevlana" },
};

function toMediaGroup(media: {
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
}) {
  return {
    kind: media.kind,
    src: media.src,
    alt: media.alt,
    poster: media.poster ?? undefined,
  };
}

/** Yolculuk medyası — eski `/videos/*` marka seti + tematik poster/görseller */
const JOURNEY_CHAPTER_MEDIA = [
  {
    kind: "image" as const,
    src: "/site-media/IMG-20260429-WA0114.jpg",
    alt: "Nebevî eğitim",
  },
  {
    kind: "video" as const,
    src: PAGE_MEDIA.nebeviEgitim.src,
    alt: "Hâfızlık",
    poster: PAGE_MEDIA.nebeviEgitim.poster,
  },
  {
    kind: "video" as const,
    src: "/videos/bilim.mp4",
    alt: "Keşf-i Bilim",
    poster: "/videos/bilim-poster.jpg",
  },
  {
    kind: "image" as const,
    src: "/site-media/sanat.jpg",
    alt: "Sanat ve Spor",
  },
  {
    kind: "image" as const,
    src: "/site-media/ayakkabisiz.JPG",
    alt: "Ayakkabısız okul",
  },
] as const;

const JOURNEY_CHAPTERS = [
  {
    order: 1,
    eyebrow: "01 / Köken",
    title: "Nebevî eğitim",
    body: "Peygamberimizi (s.a.s) tanıyan, seven ve hayatına rehber edinen; üsve-i hasene ile İslâm ahlâkı ile ahlâklanmış nesiller yetiştiriyoruz.",
    ctaLabel: "Nebevî eğitim",
    ctaHref: "/egitim/nebevi-egitim",
    iconKey: "book-open-text",
    chapterMedia: toMediaGroup(JOURNEY_CHAPTER_MEDIA[0]),
  },
  {
    order: 2,
    eyebrow: "02 / Kalp",
    title: "Hâfızlık",
    body: "Mescid-rahle usulüyle Kur'an ile bütünleşen; kalbe erişen ilmi irfâna çeviren bir hâfızlık programı.",
    ctaLabel: "Hâfızlık programı",
    ctaHref: "/egitim/hafizlik",
    iconKey: "compass",
    chapterMedia: toMediaGroup(JOURNEY_CHAPTER_MEDIA[1]),
  },
  {
    order: 3,
    eyebrow: "03 / Bilim",
    title: "Keşf-i Bilim",
    body: "Okul öncesinden başlayan bilim eğitimini yaparak ve yaşayarak destekliyoruz; Cezeri, İbni Sina ve Ali Kuşçuyla geçmişe, bilimsel projelerle geleceğe yolculuk.",
    ctaLabel: "Atölye ve kulüpler",
    ctaHref: "/atolyeler-ve-kulupler",
    iconKey: "flask-conical",
    chapterMedia: toMediaGroup(JOURNEY_CHAPTER_MEDIA[2]),
  },
  {
    order: 4,
    eyebrow: "04 / Keşif",
    title: "Sanat ve Spor",
    body: "Her öğrencimizin ilgi ve yeteneklerini keşfetmesine zemin hazırlıyoruz: Hüsn-ü Hat, Ebru, okçuluk, binicilik ve yüzme ile köklü bir yetişme.",
    ctaLabel: "Atölye ve kulüpler",
    ctaHref: "/atolyeler-ve-kulupler",
    iconKey: "palette",
    chapterMedia: toMediaGroup(JOURNEY_CHAPTER_MEDIA[3]),
  },
  {
    order: 5,
    eyebrow: "05 / İklim",
    title: "Ayakkabısız okul",
    body: "Temiz, huzurlu ve ailesinde gibi hisseden öğrenciler için tasarlanmış sıcak ve güvenli butik okul iklimi.",
    ctaLabel: "Neden Sultan?",
    ctaHref: "/kurumsal/neden-sultan",
    iconKey: "sparkles",
    chapterMedia: toMediaGroup(JOURNEY_CHAPTER_MEDIA[4]),
  },
];

async function seedHomepage() {
  const { getPayloadClient } = await import("@/lib/payload");
  const payload = await getPayloadClient();

  const existingGayemiz = await payload.findGlobal({ slug: "gayemiz", depth: 0 });
  if ((existingGayemiz.decorCells?.length ?? 0) > 0) {
    console.log("Gâyemiz global zaten dolu — atlanıyor.");
  } else {
    const { tagline, titleLine, description, buttonText } = HERO_SLIDE_LIMITS;
    const lim = (text: string, max: number) => truncateHeroText(text, max);
    await payload.updateGlobal({
      slug: "gayemiz",
      data: {
        levels: DEFAULT_MISSION.levels.map((l) => ({
          label: l.label,
          description: lim(l.description, description),
          href: l.href,
          ctaLabel: lim(l.ctaLabel, buttonText),
        })),
        decorCells: DEFAULT_MISSION.decorCells.map((c) => ({
          slot: c.slot,
          tagline: lim(c.tagline, tagline),
          titleLine1: lim(c.titleLines[0], titleLine),
          titleLine2: lim(c.titleLines[1], titleLine),
          titleLine3: lim(c.titleLines[2], titleLine),
          description: lim(c.description, description),
          buttonText: lim(c.buttonText, buttonText),
          buttonLink: c.buttonLink,
          media: toMediaGroup(c.media),
          focalPoint: { x: 50, y: 50 },
          mediaScale: 1,
        })),
      },
    });
    console.log("Gâyemiz global seed edildi.");
  }

  const existingGlobal = await payload.findGlobal({ slug: "ana-sayfa", depth: 0 });
  if (existingGlobal?.journey?.headline) {
    console.log("Ana sayfa global zaten dolu — atlanıyor.");
  } else {
    await payload.updateGlobal({
      slug: "ana-sayfa",
      data: {
        journey: {
          headline:
            "Peygamber Efendimiz'in (s.a.s) İzinde Geleceğe Örnek Nesiller...",
        },
        neden: {
          eyebrow: "Ayırt edici yaklaşım",
          title: "Neden",
          titleHighlight: "Sultan Okulları?",
          description:
            "Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hâfızlık ufkuna uzanan güçlü bir kurum dili.",
          ctaLabel: `${nedenSultanItems.length} maddenin tamamı`,
          ctaHref: "/kurumsal/neden-sultan",
          marqueeValues: [
            { value: "İlim" },
            { value: "Hikmet" },
            { value: "Ahlâk" },
            { value: "Nebevî eğitim" },
            { value: "Hâfızlık" },
            { value: "Doğa" },
            { value: "Butik okul" },
          ],
        },
        videoSection: {
          eyebrow: "Tanıtım · Sinematik bakış",
          title: "Okul atmosferini yakından görün.",
          description:
            "Sultan Okulları'nın sınıf, bahçe ve etkinlik atmosferinden seçilen bir kare.",
          ctaLabel: "Görüşme planla",
          ctaHref: "/iletisim",
          featuredVideo: toMediaGroup(featuredVideo),
        },
        branchesSection: {
          eyebrow: "Okullarımız",
          title: "Size en yakın Sultan okulunu keşfedin",
          description:
            "Size en yakın Sultan okulunu seçerek yol tarifi alabilir, okulumuza güvenli ve pratik bir şekilde ulaşabilirsiniz.",
          ctaLabel: "Sizi Arayalım",
          ctaHref: "/iletisim",
        },
        guncelSection: {
          eyebrow: "Duyurular",
          title: "Etkinlikler ve haberler",
          description: "",
          ctaLabel: "Tüm içerikler",
          ctaHref: "/guncel/haberler",
          featuredEventLabel: "Öne çıkan etkinlik",
          upcomingEventsLabel: "Yaklaşan etkinlikler",
          newsLabel: "Haberler",
          featuredEventMedia: toMediaGroup(mediaPageItems[1]),
        },
        instagramSection: {
          eyebrow: "Sosyal medya vitrini",
          title: "Sosyal Medyada Biz",
          description: "",
          handle: instagramHandle,
          profileUrl: instagramProfileUrl,
        },
        quickLinksSection: {
          eyebrow: "",
          title: "",
          description: "",
          links: [
            { href: "/egitim/kademeler", label: "Kademeler", description: "", iconKey: "book-open" },
            { href: "/egitim/nebevi-egitim", label: "Nebevî Eğitim", description: "", iconKey: "graduation-cap" },
            { href: "/akademik/yabanci-dil", label: "Atölyeler", description: "", iconKey: "palette" },
            { href: "/yasam/sultanda-yasam", label: "Yemekhane", description: "", iconKey: "hand-heart" },
            { href: "/rehberlik/egitim-koclugu", label: "Rehberlik", description: "", iconKey: "heart-handshake" },
            { href: "/kurumsal/burs-olanaklari", label: "Burs", description: "", iconKey: "sprout" },
            { href: "/guncel/haberler", label: "Duyurular", description: "", iconKey: "radio" },
            { href: "/iletisim", label: "İletişim", description: "", iconKey: "phone" },
          ],
        },
        infoModal: {
          enabled: true,
          brandLabel: "Sultan Okulları",
          title: "Sizi Arayalım!",
          subtitle:
            "Numaranızı bırakın, eğitim danışmanımız en kısa sürede sizi arayıp tüm sorularınızı yanıtlasın.",
          submitLabel: "Beni Arayın",
          dismissLabel: "Şimdi değil",
          kvkkText:
            "KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesini, tarafıma arama yapılmasını ve SMS gönderilmesini kabul ediyorum.",
        },
      },
    });
    console.log("Ana sayfa global seed tamamlandı.");
  }

  const heroExisting = await payload.find({
    collection: "hero-slides",
    limit: 100,
    pagination: false,
  });
  for (const doc of heroExisting.docs) {
    await payload.delete({
      collection: "hero-slides",
      id: doc.id,
    });
  }
  if (heroExisting.totalDocs > 0) {
    console.log(`${heroExisting.totalDocs} mevcut hero slaytı silindi.`);
  }
  for (let i = 0; i < HERO_SLIDES.length; i++) {
    const slide = HERO_SLIDES[i];
    await payload.create({
      collection: "hero-slides",
      data: {
        tagline: slide.tagline,
        titleLine1: slide.titleLines[0],
        titleLine2: slide.titleLines[1],
        titleLine3: slide.titleLines[2],
        description: slide.description,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        displayDuration: slide.displayDuration ?? 6,
        slideMedia: {
          kind: slide.mediaType,
          src: slide.mediaUrl,
          alt: slide.tagline,
          poster: slide.posterUrl,
        },
      },
    });
  }
  console.log(`${HERO_SLIDES.length} hero slaytı eklendi.`);

  const journeyExisting = await payload.find({
    collection: "journey-chapters",
    limit: 100,
    pagination: false,
  });
  for (const doc of journeyExisting.docs) {
    const eyebrow = String(doc.eyebrow ?? "")
      .trim()
      .toLocaleLowerCase("tr-TR");
    const title = String(doc.title ?? "")
      .trim()
      .toLocaleLowerCase("tr-TR");
    if (eyebrow.includes("sofra") || title === "kantinsiz okul") {
      await payload.delete({
        collection: "journey-chapters",
        id: doc.id,
      });
      console.log(`Kaldırılan yolculuk slaytı: ${doc.eyebrow} / ${doc.title}`);
    }
  }

  const journeyAfterCleanup = await payload.find({
    collection: "journey-chapters",
    limit: 1,
  });
  if (journeyAfterCleanup.totalDocs === 0) {
    for (const chapter of JOURNEY_CHAPTERS) {
      const { order: _order, ...chapterData } = chapter;
      await payload.create({
        collection: "journey-chapters",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: chapterData as any,
      });
    }
    console.log(`${JOURNEY_CHAPTERS.length} yolculuk bölümü eklendi.`);
  }

  const nedenExisting = await payload.find({
    collection: "neden-sultan-items",
    limit: 1,
  });
  if (nedenExisting.totalDocs === 0) {
    for (let i = 0; i < nedenSultanItems.length; i++) {
      const item = nedenSultanItems[i];
      await payload.create({
        collection: "neden-sultan-items",
        data: {
          headline: item.headline,
          body: item.body,
        },
      });
    }
    console.log(`${nedenSultanItems.length} Neden Sultan maddesi eklendi.`);
  }

  const instaExisting = await payload.find({
    collection: "instagram-posts",
    limit: 1,
  });
  if (instaExisting.totalDocs === 0) {
    for (let i = 0; i < instagramPosts.length; i++) {
      const post = instagramPosts[i];
      await payload.create({
        collection: "instagram-posts",
        data: {
          title: post.title,
          description: post.description,
          externalUrl: post.url,
          postMedia: post.videoSrc
            ? {
                kind: "video",
                src: post.videoSrc,
                alt: post.title,
              }
            : undefined,
        },
      });
    }
    console.log(`${instagramPosts.length} Instagram gönderisi eklendi.`);
  }

  const branchExisting = await payload.find({
    collection: "branches",
    limit: 50,
  });
  if (branchExisting.totalDocs === 0) {
    for (const branch of branches) {
      const routes = BRANCH_ROUTES[branch.slug];
      const preview = branchPreviewMedia[branch.slug];
      const gallery = branchGalleryMedia[branch.slug] ?? [];
      await payload.create({
        collection: "branches",
        data: {
          slug: branch.slug,
          name: branch.name,
          city: branch.city,
          district: branch.district,
          citySlug: routes?.citySlug ?? "",
          campusSlug: routes?.campusSlug ?? branch.slug,
          address: branch.address,
          phone: branch.phone,
          levels: branch.levels.map((level) => ({ level })),
          upcoming: branch.upcoming ?? false,
          previewMedia: preview ? toMediaGroup(preview) : undefined,
          gallery: gallery.map((g) => ({ item: toMediaGroup(g) })),
        },
      });
    }
    console.log(`${branches.length} şube eklendi.`);
  } else {
    // Kademe galerileri güncellendiğinde CMS şube galerilerini senkronla
    for (const doc of branchExisting.docs) {
      const slug = doc.slug as string;
      const gallery = branchGalleryMedia[slug];
      if (!gallery) continue;
      await payload.update({
        collection: "branches",
        id: doc.id,
        data: {
          gallery: gallery.map((g) => ({ item: toMediaGroup(g) })),
        },
      });
    }
    console.log(
      `${branchExisting.docs.length} şube galerisi kademe medyasıyla güncellendi.`,
    );
  }

  console.log("Ana sayfa seed işlemi tamamlandı.");
}

seedHomepage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed başarısız:", error);
    process.exit(1);
  });
