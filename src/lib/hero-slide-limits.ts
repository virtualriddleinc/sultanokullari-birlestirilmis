import type { HeroSlide } from "@/features/hero/slides";

/** Rehberlik slaytı referans alınarak belirlenen hero bilgi kartı metin limitleri */
export const HERO_SLIDE_LIMITS = {
  /** En uzun mevcut etiket: AKADEMİK GELİŞİM VE BİREYSEL TÂKİB (34) */
  tagline: 34,
  titleLine: 26,
  description: 100,
  buttonText: 36,
} as const;

export type HeroSlideTextFields = {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  buttonText: string;
};

export function truncateHeroText(text: string, max: number): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 3).trimEnd()}...`;
}

export function normalizeHeroSlideFields(
  fields: HeroSlideTextFields,
): HeroSlideTextFields {
  return {
    tagline: truncateHeroText(fields.tagline, HERO_SLIDE_LIMITS.tagline),
    titleLine1: truncateHeroText(fields.titleLine1, HERO_SLIDE_LIMITS.titleLine),
    titleLine2: truncateHeroText(fields.titleLine2, HERO_SLIDE_LIMITS.titleLine),
    titleLine3: truncateHeroText(fields.titleLine3, HERO_SLIDE_LIMITS.titleLine),
    description: truncateHeroText(
      fields.description,
      HERO_SLIDE_LIMITS.description,
    ),
    buttonText: truncateHeroText(fields.buttonText, HERO_SLIDE_LIMITS.buttonText),
  };
}

export function normalizeHeroSlide(slide: HeroSlide): HeroSlide {
  const normalized = normalizeHeroSlideFields({
    tagline: slide.tagline,
    titleLine1: slide.titleLines[0],
    titleLine2: slide.titleLines[1],
    titleLine3: slide.titleLines[2],
    description: slide.description,
    buttonText: slide.buttonText,
  });

  return {
    ...slide,
    tagline: normalized.tagline,
    titleLines: [
      normalized.titleLine1,
      normalized.titleLine2,
      normalized.titleLine3,
    ],
    description: normalized.description,
    buttonText: normalized.buttonText,
  };
}
