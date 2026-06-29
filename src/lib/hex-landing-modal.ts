import type { SiteMedia } from "@/content/site-media";
import type { HeroSlide } from "@/features/hero/slides";
import type { JourneyChapter } from "@/lib/home-shared";
import type { NedenItem } from "@/content/neden-sultan";

export type HexLandingModalCta = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type HexLandingModalContent = {
  eyebrow: string;
  title: string;
  description: string;
  trustNote?: string;
  accentColor: string;
  media?: SiteMedia;
  primaryCta?: HexLandingModalCta;
  secondaryCta?: HexLandingModalCta;
};

export const HEX_LANDING_TRUST_NOTE =
  "Sultan Okulları'nda her adım, değer odaklı eğitim vizyonumuzla şekillenir.";

export const HEX_ACCENT = {
  hero: "#4cff00",
  journey: "#fbbf24",
  nedenPrimary: "#4cff00",
  nedenSecondary: "#0d6b2a",
  mission: {
    surface: "#fff085",
    primary: "#fbbf24",
    emerald: "#fb923c",
    glass: "#fde047",
  },
} as const;

export function mapHeroSlideToModal(
  slide: HeroSlide,
  onClose: () => void,
): HexLandingModalContent {
  return {
    eyebrow: slide.tagline,
    title: slide.titleLines.join(" "),
    description: slide.description,
    trustNote: HEX_LANDING_TRUST_NOTE,
    accentColor: HEX_ACCENT.hero,
    media: {
      kind: slide.mediaType === "video" ? "video" : "image",
      src: slide.mediaUrl,
      alt: slide.titleLines.join(" "),
      poster: slide.posterUrl,
    },
    primaryCta: {
      label: slide.buttonText,
      href: slide.buttonLink,
    },
    secondaryCta: {
      label: "Kapat",
      onClick: onClose,
    },
  };
}

export function mapJourneyChapterToModal(
  chapter: JourneyChapter,
  onClose: () => void,
): HexLandingModalContent {
  return {
    eyebrow: chapter.eyebrow,
    title: chapter.title,
    description: chapter.body,
    trustNote: HEX_LANDING_TRUST_NOTE,
    accentColor: HEX_ACCENT.journey,
    media: chapter.media,
    primaryCta: {
      label: chapter.cta.label,
      href: chapter.cta.href,
    },
    secondaryCta: {
      label: "Kapat",
      onClick: onClose,
    },
  };
}

export function mapNedenItemToModal(
  item: NedenItem,
  index: number,
  ctaHref: string,
  ctaLabel: string,
  onClose: () => void,
): HexLandingModalContent {
  const isPrimary = index % 4 === 0 || index === 10;
  return {
    eyebrow: "Neden Sultan Okulları?",
    title: item.headline,
    description: item.body,
    trustNote: HEX_LANDING_TRUST_NOTE,
    accentColor: isPrimary ? HEX_ACCENT.nedenPrimary : HEX_ACCENT.nedenSecondary,
    primaryCta: {
      label: ctaLabel,
      href: ctaHref,
    },
    secondaryCta: {
      label: "Kapat",
      onClick: onClose,
    },
  };
}

export function missionDecorToneColor(
  tone: "surface" | "primary" | "emerald" | "glass" | undefined,
): string {
  return HEX_ACCENT.mission[tone ?? "surface"];
}
