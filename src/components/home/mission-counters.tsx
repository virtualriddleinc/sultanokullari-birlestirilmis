"use client";

import beyazDesen from "@/images/beyaz-desen.svg";
import {
  MissionHoneycomb,
  type HoneycombCell,
} from "@/components/home/mission-honeycomb";
import { SectionWaveDivider } from "@/components/ui/section-wave-divider";
import { HoneycombCellLabel } from "@/components/home/honeycomb-cell-label";
import {
  HeroInfoCard,
  HeroInfoCardShell,
} from "@/features/hero/hero-info-card";
import { hexGalleryMedia } from "@/content/site-media";
import type { SiteMedia } from "@/content/site-media";
import { missionDecorToneColor } from "@/lib/hex-landing-modal";

const DEFAULT_LEVELS = ["Anaokulu", "İlkokul", "Ortaokul"] as const;
const LEVEL_HREFS = [
  "/egitim/anaokulu",
  "/egitim/ilkokul",
  "/egitim/ortaokul",
] as const;
const DEFAULT_MISSION = {
  tagline: "Gâyemiz · Ufkumuz",
  titleLines: [
    "Değer merkezli eğitim,",
    "güçlü bir gelecek vizyonu ile birleşiyor.",
  ] as [string, string],
  description:
    "Peygamber Efendimizin (s.a.s) izinde, üsve-i hasene olmayı hedefleyen; ilim, hikmet ve ahlâkla bütünleşmiş nesiller yetiştiriyoruz.",
  secondaryDescription:
    "Anaokulu, ilkokul ve ortaokul kademeleriyle bütüncül bir eğitim yolculuğu; okul öncesinden üniversiteye, câmi ve hâfızlık binasıyla bütünleşik Eğitim Külliyesi ufkumuz.",
};

export type MissionCountersProps = {
  tagline?: string;
  titleLines?: [string, string, string];
  description?: string;
  secondaryDescription?: string;
  levels?: string[];
  decorMedia?: SiteMedia[];
};

/** Mobil/tablet (< lg): kart → petek; masaüstü (lg+): petek col-2, kart col-3 */
const MISSION_MEDIA_CELL =
  "hero-slide-media-col col-span-full h-full min-h-0 w-full min-w-0 max-lg:order-2 lg:col-start-2 lg:col-end-3 lg:row-start-1";
const MISSION_CARD_CELL =
  "col-span-full min-h-0 min-w-0 max-lg:order-1 lg:col-start-3 lg:col-end-4 lg:row-start-1";

function LevelContent({ label }: { label: string }) {
  return <HoneycombCellLabel label={label} />;
}

function decorModalFields(
  media: SiteMedia | undefined,
  tone: NonNullable<HoneycombCell["tone"]>,
  tagline: string,
  description: string,
  secondaryDescription: string,
): HoneycombCell["modal"] {
  if (!media) return undefined;
  return {
    eyebrow: tagline,
    title: media.alt || tagline,
    description: `${description} ${secondaryDescription}`.trim(),
    accentColor: missionDecorToneColor(tone),
    media,
    primaryCta: {
      label: "Kademeleri Keşfet",
      href: "/egitim/kademeler",
    },
  };
}

export function MissionCounters({
  tagline = DEFAULT_MISSION.tagline,
  titleLines = [
    DEFAULT_MISSION.titleLines[0],
    DEFAULT_MISSION.titleLines[1],
    "",
  ],
  description = DEFAULT_MISSION.description,
  secondaryDescription = DEFAULT_MISSION.secondaryDescription,
  levels = [...DEFAULT_LEVELS],
  decorMedia = hexGalleryMedia.slice(0, 6) as unknown as SiteMedia[],
}: MissionCountersProps = {}) {
  const missionModalBase = {
    tagline,
    description,
    secondaryDescription,
  };

  const honeycombCells: HoneycombCell[] = [
    {
      id: "decor-top-left",
      kind: "decor",
      position: { col: 0, row: 0.5 },
      tone: "surface",
      media: decorMedia[0],
      modal: decorModalFields(
        decorMedia[0],
        "surface",
        missionModalBase.tagline,
        missionModalBase.description,
        missionModalBase.secondaryDescription,
      ),
    },
    {
      id: "level-anaokulu",
      kind: "stat",
      position: { col: 1, row: 0 },
      href: LEVEL_HREFS[0],
      linkLabel: levels[0] ?? DEFAULT_LEVELS[0],
      children: <LevelContent label={levels[0] ?? DEFAULT_LEVELS[0]} />,
    },
    {
      id: "decor-top-right",
      kind: "decor",
      position: { col: 2, row: 0.5 },
      tone: "primary",
      media: decorMedia[2],
      modal: decorModalFields(
        decorMedia[2],
        "primary",
        missionModalBase.tagline,
        missionModalBase.description,
        missionModalBase.secondaryDescription,
      ),
    },
    {
      id: "level-ortaokul",
      kind: "stat",
      position: { col: 0, row: 1.5 },
      href: LEVEL_HREFS[2],
      linkLabel: levels[2] ?? DEFAULT_LEVELS[2],
      children: <LevelContent label={levels[2] ?? DEFAULT_LEVELS[2]} />,
    },
    {
      id: "level-ilkokul",
      kind: "stat",
      position: { col: 1, row: 1 },
      href: LEVEL_HREFS[1],
      linkLabel: levels[1] ?? DEFAULT_LEVELS[1],
      children: <LevelContent label={levels[1] ?? DEFAULT_LEVELS[1]} />,
    },
    {
      id: "decor-right",
      kind: "decor",
      position: { col: 2, row: 1.5 },
      tone: "emerald",
      media: decorMedia[3],
      modal: decorModalFields(
        decorMedia[3],
        "emerald",
        missionModalBase.tagline,
        missionModalBase.description,
        missionModalBase.secondaryDescription,
      ),
    },
    {
      id: "decor-bottom",
      kind: "decor",
      position: { col: 1, row: 2 },
      tone: "glass",
      media: decorMedia[5],
      modal: decorModalFields(
        decorMedia[5],
        "glass",
        missionModalBase.tagline,
        missionModalBase.description,
        missionModalBase.secondaryDescription,
      ),
    },
  ];

  return (
    <section
      id="gayemiz"
      aria-label="Gâyemiz ve ufkumuz"
      className="mission-section-grid border-charcoal/10 relative z-[1] -mt-px w-full overflow-hidden bg-brand-honey pt-fluid-8 pb-0 sm:pt-fluid-16"
    >
      {/* Beyaz desen — hero yeşil bölümüyle aynı katman; bal köpüğü zemin üzerinde süreklilik */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beyazDesen.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
      />

      {/* ── Sol hücre: petek — hero bilgi kartı band hizası (col-2) ── */}
      <div className={`${MISSION_MEDIA_CELL} relative z-[1]`}>
        <div className="hero-slide-media-band">
          <MissionHoneycomb cells={honeycombCells} />
        </div>
      </div>

      {/* ── Sağ hücre: bilgi kartı — hero altıgen/medya band hizası (col-3) ── */}
      <HeroInfoCardShell className={`${MISSION_CARD_CELL} relative z-[1]`}>
        <HeroInfoCard
          className="mission-info-card bg-brand-green"
          tagline={tagline}
          titleLines={titleLines}
          description={description}
          secondaryDescription={secondaryDescription}
        />
      </HeroInfoCardShell>

      <SectionWaveDivider
        fill="var(--color-brand-green)"
        className="relative z-[2] col-span-full mt-0 max-lg:order-3"
      />
    </section>
  );
}
