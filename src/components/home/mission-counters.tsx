"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SitePatternOverlay } from "@/components/layout/site-pattern-overlay";
import {
  MissionHoneycomb,
  type HoneycombCell,
} from "@/components/home/mission-honeycomb";
import { SectionWaveDivider } from "@/components/ui/section-wave-divider";
import { HoneycombCellLabel } from "@/components/home/honeycomb-cell-label";
import {
  HeroInfoCard,
  HeroInfoCardShell,
  type HeroInfoCardCta,
} from "@/features/hero/hero-info-card";
import {
  HERO_SLIDE_LIMITS,
  truncateHeroText,
} from "@/lib/hero-slide-limits";
import { HEX_ACCENT, missionDecorToneColor } from "@/lib/hex-landing-modal";
import {
  DEFAULT_MISSION,
  findDecorBySlot,
  type MissionDecorCellData,
  type MissionSectionData,
} from "@/lib/mission-defaults";

type MissionCardPreview = {
  id: string;
  tagline: string;
  titleLines: [string, string, string];
  description: string;
  cta: HeroInfoCardCta;
};

/** Bilgi kartı otomatik geçiş süresi */
const CARD_ROTATE_MS = 10_000;

/** Mobil/tablet (< lg): kart → petek; masaüstü (lg+): petek col-2, kart col-3 */
const MISSION_MEDIA_CELL =
  "hero-slide-media-col col-span-full h-full min-h-0 w-full min-w-0 max-lg:order-2 lg:col-start-2 lg:col-end-3 lg:row-start-1";
const MISSION_CARD_CELL =
  "col-span-full min-h-0 min-w-0 max-lg:order-1 lg:col-start-3 lg:col-end-4 lg:row-start-1";

const SLOT_LAYOUT: Record<
  MissionDecorCellData["slot"],
  {
    id: string;
    position: HoneycombCell["position"];
    tone: NonNullable<HoneycombCell["tone"]>;
  }
> = {
  "top-left": {
    id: "decor-top-left",
    position: { col: 0, row: 0.5 },
    tone: "surface",
  },
  "top-right": {
    id: "decor-top-right",
    position: { col: 2, row: 0.5 },
    tone: "primary",
  },
  right: {
    id: "decor-right",
    position: { col: 2, row: 1.5 },
    tone: "emerald",
  },
  bottom: {
    id: "decor-bottom",
    position: { col: 1, row: 2 },
    tone: "glass",
  },
};

function LevelContent({ label }: { label: string }) {
  return <HoneycombCellLabel label={label} />;
}

function withinHeroLimits(fields: {
  tagline: string;
  titleLines: string[];
  description: string;
  ctaLabel: string;
}): Pick<MissionCardPreview, "tagline" | "titleLines" | "description"> & {
  ctaLabel: string;
} {
  const lines = [...fields.titleLines.filter(Boolean)];
  while (lines.length < 3) lines.push("");
  return {
    tagline: truncateHeroText(fields.tagline, HERO_SLIDE_LIMITS.tagline),
    titleLines: [
      truncateHeroText(lines[0] ?? "", HERO_SLIDE_LIMITS.titleLine),
      truncateHeroText(lines[1] ?? "", HERO_SLIDE_LIMITS.titleLine),
      truncateHeroText(lines[2] ?? "", HERO_SLIDE_LIMITS.titleLine),
    ],
    description: truncateHeroText(
      fields.description,
      HERO_SLIDE_LIMITS.description,
    ),
    ctaLabel: truncateHeroText(fields.ctaLabel, HERO_SLIDE_LIMITS.buttonText),
  };
}

function decorCellFromData(data: MissionDecorCellData): HoneycombCell {
  const layout = SLOT_LAYOUT[data.slot];
  return {
    id: layout.id,
    kind: "decor",
    position: layout.position,
    tone: layout.tone,
    media: data.media,
    focalPoint: data.focalPoint,
    cardTitleLines: [...data.titleLines],
    modal: {
      eyebrow: data.tagline,
      title: data.titleLines.join(" "),
      description: data.description,
      accentColor: missionDecorToneColor(layout.tone),
      media: data.media,
      primaryCta: {
        label: data.buttonText,
        href: data.buttonLink,
      },
    },
  };
}

function previewFromCell(cell: HoneycombCell): MissionCardPreview | null {
  if (!cell.modal?.primaryCta?.href) return null;
  const limited = withinHeroLimits({
    tagline: cell.modal.eyebrow,
    titleLines: cell.cardTitleLines?.length
      ? cell.cardTitleLines
      : [cell.modal.title],
    description: cell.modal.description,
    ctaLabel: cell.modal.primaryCta.label,
  });
  return {
    id: cell.id,
    tagline: limited.tagline,
    titleLines: limited.titleLines,
    description: limited.description,
    cta: {
      href: cell.modal.primaryCta.href,
      label: limited.ctaLabel,
    },
  };
}

function buildHoneycombCells(
  decorCells: MissionDecorCellData[],
  levels: MissionSectionData["levels"],
): HoneycombCell[] {
  const levelAnaokulu = levels[0] ?? DEFAULT_MISSION.levels[0];
  const levelIlkokul = levels[1] ?? DEFAULT_MISSION.levels[1];
  const levelOrtaokul = levels[2] ?? DEFAULT_MISSION.levels[2];

  const honeycombCells: HoneycombCell[] = [];

  const topLeft = findDecorBySlot(decorCells, "top-left");
  if (topLeft) honeycombCells.push(decorCellFromData(topLeft));

  honeycombCells.push({
    id: "level-anaokulu",
    kind: "stat",
    position: { col: 1, row: 0 },
    href: levelAnaokulu.href,
    linkLabel: levelAnaokulu.label,
    children: <LevelContent label={levelAnaokulu.label} />,
    modal: {
      eyebrow: "Kademelerimiz",
      title: levelAnaokulu.label,
      description: levelAnaokulu.description,
      accentColor: HEX_ACCENT.mission.primary,
      primaryCta: {
        label: levelAnaokulu.ctaLabel,
        href: levelAnaokulu.href,
      },
    },
  });

  const topRight = findDecorBySlot(decorCells, "top-right");
  if (topRight) honeycombCells.push(decorCellFromData(topRight));

  honeycombCells.push(
    {
      id: "level-ortaokul",
      kind: "stat",
      position: { col: 0, row: 1.5 },
      href: levelOrtaokul.href,
      linkLabel: levelOrtaokul.label,
      children: <LevelContent label={levelOrtaokul.label} />,
      modal: {
        eyebrow: "Kademelerimiz",
        title: levelOrtaokul.label,
        description: levelOrtaokul.description,
        accentColor: HEX_ACCENT.mission.primary,
        primaryCta: {
          label: levelOrtaokul.ctaLabel,
          href: levelOrtaokul.href,
        },
      },
    },
    {
      id: "level-ilkokul",
      kind: "stat",
      position: { col: 1, row: 1 },
      href: levelIlkokul.href,
      linkLabel: levelIlkokul.label,
      children: <LevelContent label={levelIlkokul.label} />,
      modal: {
        eyebrow: "Kademelerimiz",
        title: levelIlkokul.label,
        description: levelIlkokul.description,
        accentColor: HEX_ACCENT.mission.primary,
        primaryCta: {
          label: levelIlkokul.ctaLabel,
          href: levelIlkokul.href,
        },
      },
    },
  );

  for (const slot of ["right", "bottom"] as const) {
    const cell = findDecorBySlot(decorCells, slot);
    if (cell) honeycombCells.push(decorCellFromData(cell));
  }

  return honeycombCells;
}

export type MissionCountersProps = Partial<MissionSectionData>;

export function MissionCounters({
  decorCells = DEFAULT_MISSION.decorCells,
  levels = DEFAULT_MISSION.levels,
}: MissionCountersProps = {}) {
  const reduce = useReducedMotion();
  const [rotateIndex, setRotateIndex] = useState(0);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  const honeycombCells = useMemo(
    () => buildHoneycombCells(decorCells, levels),
    [decorCells, levels],
  );

  const rotatable = useMemo(() => {
    const items: { cellId: string; preview: MissionCardPreview }[] = [];
    for (const cell of honeycombCells) {
      const preview = previewFromCell(cell);
      if (preview) items.push({ cellId: cell.id, preview });
    }
    return items;
  }, [honeycombCells]);

  const count = rotatable.length;
  const safeIndex = count > 0 ? ((rotateIndex % count) + count) % count : 0;
  const activePreview = count > 0 ? rotatable[safeIndex]!.preview : null;
  const featuredCellId = count > 0 ? rotatable[safeIndex]!.cellId : null;

  useEffect(() => {
    if (reduce || count <= 1 || isSectionHovered) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setRotateIndex((prev) => (prev + 1) % count);
    }, CARD_ROTATE_MS);

    return () => window.clearInterval(id);
  }, [reduce, count, isSectionHovered]);

  const handleActiveCellChange = useCallback(
    (cell: HoneycombCell | null) => {
      if (!cell) return;
      const idx = rotatable.findIndex((item) => item.cellId === cell.id);
      if (idx >= 0) setRotateIndex(idx);
    },
    [rotatable],
  );

  return (
    <section
      id="gayemiz"
      aria-label="Gâyemiz ve ufkumuz"
      className="mission-section-grid border-charcoal/10 relative z-[1] -mt-px w-full overflow-hidden bg-brand-honey pt-fluid-8 pb-0 sm:pt-fluid-16"
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
    >
      <SitePatternOverlay className="z-0" opacity={0.1} />

      <div className={`${MISSION_MEDIA_CELL} relative z-[1]`}>
        <div className="hero-slide-media-band">
          <MissionHoneycomb
            cells={honeycombCells}
            featuredCellId={featuredCellId}
            onActiveCellChange={handleActiveCellChange}
          />
        </div>
      </div>

      <HeroInfoCardShell className={`${MISSION_CARD_CELL} relative z-[1]`}>
        <AnimatePresence mode="wait" initial={false}>
          {activePreview ? (
            <motion.div
              key={activePreview.id}
              className="h-full min-h-0"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroInfoCard
                className="mission-info-card h-full bg-brand-green"
                tagline={activePreview.tagline}
                titleLines={activePreview.titleLines}
                description={activePreview.description}
                cta={activePreview.cta}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </HeroInfoCardShell>

      <SectionWaveDivider
        fill="var(--color-brand-green)"
        className="relative z-[2] col-span-full mt-0 max-lg:order-3"
      />
    </section>
  );
}
