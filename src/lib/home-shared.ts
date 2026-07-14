import type { SiteMedia } from "@/content/site-media";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BookOpenText,
  Compass,
  FlaskConical,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Palette,
  Phone,
  Radio,
  Sparkles,
  Sprout,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  palette: Palette,
  "hand-heart": HandHeart,
  "heart-handshake": HeartHandshake,
  sprout: Sprout,
  radio: Radio,
  phone: Phone,
  "book-open-text": BookOpenText,
  compass: Compass,
  "flask-conical": FlaskConical,
  sparkles: Sparkles,
};

export type JourneyChapter = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { href: string; label: string };
  iconKey: string;
  media: SiteMedia;
  focalPoint?: { x: number; y: number };
  mediaScale?: number;
  mediaAspect?: number;
};

export type QuickLinkItem = {
  href: string;
  label: string;
  description: string;
  iconKey: string;
};

export function resolveQuickLinkIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? BookOpen;
}
