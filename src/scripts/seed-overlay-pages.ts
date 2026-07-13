import { config } from "dotenv";

config({ path: ".env.local" });

import {
  akademikGelisim,
  anaokuluSayfasi,
  degerlerEgitimiSayfasi,
  ilkokulSayfasi,
  kademeler,
  nebeviEgitimSayfasi,
  ortaokulSayfasi,
  rehberlikKocluk,
  sultandaYasam,
  veliSayfasi,
  yabanciDil,
} from "@/content/page-templates";
import { hafizlik } from "@/content/egitim";
import type { PageStoryRow } from "@/components/layout/page-story-section";

type OverlaySeed = {
  title: string;
  slug: string;
  pathPrefix: "egitim" | "rehberlik" | "akademik" | "yasam" | "root";
  template: "overlay-story" | "egitim-segment" | "rehberlik";
  intro: string;
  storyEyebrow: string;
  storyMotto: string;
  storyRows: Array<{
    eyebrow?: string;
    text: string;
    highlights?: Array<{ text: string }>;
  }>;
  galleryTitle?: string;
  galleryDescription?: string;
  _status: "published";
};

function mapRows(rows: readonly PageStoryRow[]) {
  return rows.map((row) => ({
    eyebrow: row.eyebrow,
    text: row.text,
    highlights: row.highlights?.map((text) => ({ text })),
  }));
}

function fromTemplate(
  opts: {
    title: string;
    slug: string;
    pathPrefix: OverlaySeed["pathPrefix"];
    template?: OverlaySeed["template"];
    intro: string;
    story: {
      eyebrow: string;
      motto: string;
      rows: readonly PageStoryRow[];
    };
    gallery?: { title: string; description: string };
  },
): OverlaySeed {
  return {
    title: opts.title,
    slug: opts.slug,
    pathPrefix: opts.pathPrefix,
    template: opts.template ?? "overlay-story",
    intro: opts.intro,
    storyEyebrow: opts.story.eyebrow,
    storyMotto: opts.story.motto,
    storyRows: mapRows(opts.story.rows),
    galleryTitle: opts.gallery?.title,
    galleryDescription: opts.gallery?.description,
    _status: "published",
  };
}

const pages: OverlaySeed[] = [
  fromTemplate({
    title: "Anaokulu",
    slug: "anaokulu",
    pathPrefix: "egitim",
    intro: anaokuluSayfasi.intro,
    story: anaokuluSayfasi.story,
    gallery: anaokuluSayfasi.gallery,
  }),
  fromTemplate({
    title: "İlkokul",
    slug: "ilkokul",
    pathPrefix: "egitim",
    intro: ilkokulSayfasi.intro,
    story: ilkokulSayfasi.story,
    gallery: ilkokulSayfasi.gallery,
  }),
  fromTemplate({
    title: "Ortaokul",
    slug: "ortaokul",
    pathPrefix: "egitim",
    intro: ortaokulSayfasi.intro,
    story: ortaokulSayfasi.story,
    gallery: ortaokulSayfasi.gallery,
  }),
  fromTemplate({
    title: "Nebevî Eğitim",
    slug: "nebevi-egitim",
    pathPrefix: "egitim",
    intro: nebeviEgitimSayfasi.intro,
    story: nebeviEgitimSayfasi.story,
    gallery: nebeviEgitimSayfasi.gallery,
  }),
  fromTemplate({
    title: "Değerler Eğitimi",
    slug: "degerler-egitimi",
    pathPrefix: "egitim",
    intro: degerlerEgitimiSayfasi.intro,
    story: degerlerEgitimiSayfasi.story,
    gallery: degerlerEgitimiSayfasi.gallery,
  }),
  fromTemplate({
    title: "Sultan Mektebi Modeli",
    slug: "kademeler",
    pathPrefix: "egitim",
    intro: kademeler.intro,
    story: kademeler.story,
    gallery: kademeler.gallery,
  }),
  fromTemplate({
    title: "Hâfızlık Eğitimi",
    slug: "hafizlik",
    pathPrefix: "egitim",
    template: "egitim-segment",
    intro:
      "Mescid-rahle usulüyle Otağ-ı Hümâyun’umuzda Hamele-i Kur’an’lar yetiştiriyoruz; Vahyin gölgesinde hâfız bir nesil.",
    story: {
      eyebrow: "Hâfızlık",
      motto: "Vahyin gölgesinde hâfız bir nesil",
      rows: hafizlik.intro.map((text, i) => ({
        eyebrow: i === 0 ? "Program" : undefined,
        text,
        highlights: [],
      })),
    },
    gallery: {
      title: "Hâfızlık galerisi",
      description: "Hâfızlık programımızdan fotoğraf ve videolar.",
    },
  }),
  fromTemplate({
    title: "Rehberlik ve Eğitim Koçluğu",
    slug: "egitim-koclugu",
    pathPrefix: "rehberlik",
    intro: rehberlikKocluk.intro,
    story: rehberlikKocluk.story,
    gallery: rehberlikKocluk.gallery,
  }),
  fromTemplate({
    title: "Sultanda Veli Olmak & Veli Akademisi",
    slug: "veli",
    pathPrefix: "rehberlik",
    intro: veliSayfasi.intro,
    story: veliSayfasi.story,
    gallery: veliSayfasi.gallery,
  }),
  fromTemplate({
    title: "Akademik Gelişim ve Tâkib",
    slug: "gelisim",
    pathPrefix: "akademik",
    intro: akademikGelisim.intro,
    story: akademikGelisim.story,
    gallery: akademikGelisim.gallery,
  }),
  fromTemplate({
    title: "Yabancı Dil & Atölyeler",
    slug: "yabanci-dil",
    pathPrefix: "akademik",
    intro: yabanciDil.intro,
    story: yabanciDil.story,
    gallery: yabanciDil.gallery,
  }),
  fromTemplate({
    title: "Sultanda Yaşam",
    slug: "sultanda-yasam",
    pathPrefix: "yasam",
    intro: sultandaYasam.intro,
    story: sultandaYasam.story,
    gallery: sultandaYasam.gallery,
  }),
];

async function main() {
  const { getPayloadClient } = await import("@/lib/payload");
  const payload = await getPayloadClient();

  for (const page of pages) {
    const existing = await payload.find({
      collection: "pages",
      where: {
        and: [
          { slug: { equals: page.slug } },
          { pathPrefix: { equals: page.pathPrefix } },
        ],
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "pages",
        id: existing.docs[0].id,
        data: page,
        draft: false,
      });
      console.log(`Overlay sayfa güncellendi: ${page.pathPrefix}/${page.slug}`);
    } else {
      await payload.create({
        collection: "pages",
        data: page,
        draft: false,
      });
      console.log(`Overlay sayfa oluşturuldu: ${page.pathPrefix}/${page.slug}`);
    }
  }

  console.log(`Overlay sayfa seed tamamlandı (${pages.length} sayfa).`);
}

main().catch((err) => {
  console.error("Overlay seed başarısız:", err);
  process.exit(1);
});
