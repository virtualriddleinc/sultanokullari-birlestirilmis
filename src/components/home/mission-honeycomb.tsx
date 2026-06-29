"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { useCallback, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HexLandingModal } from "@/components/ui/hex-landing-modal";
import type { SiteMedia } from "@/content/site-media";
import type { HexLandingModalContent } from "@/lib/hex-landing-modal";
import { HEX_LANDING_TRUST_NOTE } from "@/lib/hex-landing-modal";
import { cn } from "@/lib/cn";
import {
  FLAT_TOP_HEX_CLIP,
  FLAT_TOP_HEX_RATIO,
  MISSION_HONEYCOMB_LAYOUT,
} from "@/lib/flat-top-honeycomb";
import { springSnappy, t, viewportInView } from "@/lib/animations";

const MotionLink = motion.create(Link);

export type HoneycombCell = {
  id: string;
  kind: "decor" | "stat";
  position: {
    /** Flat-top petek sütunu. Her sütun yatayda 0.75 hücre genişliği ilerler. */
    col: 0 | 1 | 2;
    /** Hücre yüksekliği bazlı satır konumu. Yarım değerler bitişik petek ofsetini verir. */
    row: 0 | 0.5 | 1 | 1.5 | 2;
  };
  tone?: "surface" | "primary" | "emerald" | "glass";
  media?: SiteMedia;
  children?: ReactNode;
  /** Stat hücreleri — ilgili kademe sayfası */
  href?: string;
  /** Stat hücreleri — erişilebilir link etiketi */
  linkLabel?: string;
  modal?: Omit<HexLandingModalContent, "trustNote" | "secondaryCta">;
};

export const MISSION_HONEYCOMB_ASPECT =
  MISSION_HONEYCOMB_LAYOUT.aspectRatioNumber;
const cellLift = {
  scale: 1.045,
  zIndex: 20,
  filter: "drop-shadow(0 28px 44px rgba(180, 83, 9, 0.28))",
  transition: springSnappy,
};

const toneClassName = {
  surface:
    "bg-amber-50/70 shadow-[0_24px_70px_rgba(180,83,9,0.10)] backdrop-blur-sm",
  primary: "bg-amber-400/22 backdrop-blur-sm",
  emerald: "bg-orange-300/22 backdrop-blur-sm",
  glass: "bg-yellow-100/40 backdrop-blur-sm",
} satisfies Record<NonNullable<HoneycombCell["tone"]>, string>;

export function MissionHoneycomb({ cells }: { cells: HoneycombCell[] }) {
  const reduce = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] =
    useState<HexLandingModalContent | null>(null);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const openCellModal = useCallback(
    (cell: HoneycombCell) => {
      if (!cell.modal) return;
      setModalContent({
        ...cell.modal,
        trustNote: HEX_LANDING_TRUST_NOTE,
        secondaryCta: { label: "Kapat", onClick: closeModal },
      });
      setModalOpen(true);
    },
    [closeModal],
  );

  return (
    <>
    <motion.div
      className="mission-honeycomb relative isolate mx-auto h-auto w-full max-lg:max-w-full lg:h-full lg:w-auto lg:max-h-full lg:self-stretch"
      style={{ aspectRatio: MISSION_HONEYCOMB_LAYOUT.aspectRatio }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportInView}
      aria-label="Gâyemiz ve ufkumuz petek göstergeleri"
    >
      {cells.map((cell, index) => {
        const isStat = cell.kind === "stat";
        const isDecorInteractive = !isStat && Boolean(cell.modal);
        const isStatLink = isStat && Boolean(cell.href);
        const { left, top, width } = MISSION_HONEYCOMB_LAYOUT.cellPosition(
          cell.position.col,
          cell.position.row,
        );

        const cellShell = (
          <div
            className={cn(
              "relative size-full overflow-hidden",
              isStat
                ? "bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-500 text-amber-950 shadow-[0_30px_80px_rgba(180,83,9,0.30)]"
                : toneClassName[cell.tone ?? "surface"],
            )}
            style={{ clipPath: FLAT_TOP_HEX_CLIP }}
          >
            {!isStat ? (
              cell.media?.kind === "image" ? (
                <Image
                  src={cell.media.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 12vw, 85vw"
                  className="absolute inset-0 object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.10] mix-blend-multiply"
                />
              )
            ) : null}
            <div className="relative z-10 size-full min-h-0 overflow-hidden">
              {cell.children}
            </div>
          </div>
        );

        const motionProps = {
          className: cn(
            "group absolute block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]",
            (isDecorInteractive || isStatLink) && "cursor-pointer",
          ),
          style: {
            left: `${left}%`,
            top: `${top}%`,
            width: `${width}%`,
            aspectRatio: FLAT_TOP_HEX_RATIO,
            zIndex: isStat ? 2 : 1,
          },
          initial: reduce ? false : { opacity: 0, scale: 0.9, y: 18 },
          whileInView: reduce
            ? undefined
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { ...t(0.6), delay: index * 0.07 },
              },
          whileHover: reduce ? undefined : cellLift,
          whileFocus: reduce ? undefined : cellLift,
          viewport: viewportInView,
        } as const;

        if (isStatLink && cell.href) {
          return (
            <MotionLink
              key={cell.id}
              {...motionProps}
              href={cell.href}
              aria-label={`${cell.linkLabel ?? cell.href} — kademe sayfasına git`}
            >
              {cellShell}
            </MotionLink>
          );
        }

        return (
          <motion.div
            key={cell.id}
            {...motionProps}
            aria-hidden={!isStat && !isDecorInteractive}
            role={isDecorInteractive ? "button" : undefined}
            tabIndex={isDecorInteractive ? 0 : undefined}
            aria-label={
              isDecorInteractive
                ? `${cell.modal?.title ?? "Görsel"} — detayları görüntüle`
                : undefined
            }
            onClick={
              isDecorInteractive ? () => openCellModal(cell) : undefined
            }
            onKeyDown={
              isDecorInteractive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openCellModal(cell);
                    }
                  }
                : undefined
            }
          >
            {cellShell}
          </motion.div>
        );
      })}
    </motion.div>
    <HexLandingModal
      open={modalOpen}
      onClose={closeModal}
      content={modalContent}
    />
    </>
  );
}
