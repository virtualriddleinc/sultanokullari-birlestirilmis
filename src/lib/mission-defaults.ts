import { hexGalleryMedia, type SiteMedia } from "@/content/site-media";
import { anaokulu, ilkokul, ortaokul } from "@/content/egitim";
import { rehberlikGiris } from "@/content/rehberlik";
import { HERO_SLIDES } from "@/features/hero/slides";

export type MissionDecorSlot = "top-left" | "top-right" | "right" | "bottom";

export type MissionDecorCellData = {
  slot: MissionDecorSlot;
  tagline: string;
  titleLines: [string, string, string];
  description: string;
  buttonText: string;
  buttonLink: string;
  media: SiteMedia;
  focalPoint?: { x: number; y: number };
  mediaScale?: number;
};

export type MissionLevelData = {
  label: string;
  description: string;
  href: string;
  ctaLabel: string;
};

export type MissionSectionData = {
  decorCells: MissionDecorCellData[];
  levels: MissionLevelData[];
};

const AKADEMIK = HERO_SLIDES.find((s) => s.id === "akademik-gelisim")!;
const KADEMELER = HERO_SLIDES.find((s) => s.id === "kademeler")!;
const NEBEVI = HERO_SLIDES.find((s) => s.id === "nebevi-egitim")!;

const REHBERLIK_TITLE: [string, string, string] = [
  "Başarıdan ziyade",
  "şahsiyete odaklanan",
  "bir model uyguluyoruz",
];

/** Statik fallback — CMS boşken (henüz kaydedilmemiş) önyüz kırılmaz. */
export const DEFAULT_MISSION: MissionSectionData = {
  decorCells: [
    {
      slot: "top-left",
      tagline: KADEMELER.tagline,
      titleLines: [...KADEMELER.titleLines],
      description: KADEMELER.description,
      buttonText: KADEMELER.buttonText,
      buttonLink: KADEMELER.buttonLink,
      media: hexGalleryMedia[0] as SiteMedia,
    },
    {
      slot: "top-right",
      tagline: NEBEVI.tagline,
      titleLines: [...NEBEVI.titleLines],
      description: NEBEVI.description,
      buttonText: NEBEVI.buttonText,
      buttonLink: NEBEVI.buttonLink,
      media: hexGalleryMedia[2] as SiteMedia,
    },
    {
      slot: "right",
      tagline: AKADEMIK.tagline,
      titleLines: [...AKADEMIK.titleLines],
      description: AKADEMIK.description,
      buttonText: AKADEMIK.buttonText,
      buttonLink: AKADEMIK.buttonLink,
      media: hexGalleryMedia[3] as SiteMedia,
    },
    {
      slot: "bottom",
      tagline: "REHBERLİK VE EĞİTİM KOÇLUĞU",
      titleLines: REHBERLIK_TITLE,
      description: rehberlikGiris.slice(0, rehberlikGiris.indexOf(".") + 1),
      buttonText: "Rehberlik ve Eğitim Koçluğu",
      buttonLink: "/rehberlik/egitim-koclugu",
      media: hexGalleryMedia[5] as SiteMedia,
    },
  ],
  levels: [
    {
      label: "Anaokulu",
      description: anaokulu.intro[2],
      href: "/egitim/anaokulu",
      ctaLabel: "Anaokulu Programını Keşfet",
    },
    {
      label: "İlkokul",
      description: ilkokul.paragraflar[0],
      href: "/egitim/ilkokul",
      ctaLabel: "İlkokul Programını Keşfet",
    },
    {
      label: "Ortaokul",
      description: ortaokul.paragraflar[0],
      href: "/egitim/ortaokul",
      ctaLabel: "Ortaokul Programını Keşfet",
    },
  ],
};

export function findDecorBySlot(
  cells: MissionDecorCellData[],
  slot: MissionDecorSlot,
): MissionDecorCellData | undefined {
  return cells.find((c) => c.slot === slot);
}
