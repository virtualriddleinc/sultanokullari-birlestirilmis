"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SiteMedia } from "@/content/site-media";
import { cn } from "@/lib/cn";
import { springSnappy, t, viewportInView } from "@/lib/animations";

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
};

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";
const CONTAINER_ASPECT = `${2.5} / ${3.5 * 0.8660254037844386}`;
const ROW_STEP = 100 / 3.5;
const cellLift = {
  scale: 1.045,
  zIndex: 20,
  filter: "drop-shadow(0 28px 44px rgba(180, 83, 9, 0.28))",
  transition: springSnappy,
};

const toneClassName = {
  surface:
    "border border-amber-700/15 bg-amber-50/70 shadow-[0_24px_70px_rgba(180,83,9,0.10)] backdrop-blur-sm",
  primary: "border border-amber-700/15 bg-amber-400/22 backdrop-blur-sm",
  emerald: "border border-orange-700/15 bg-orange-300/22 backdrop-blur-sm",
  glass: "border border-yellow-700/15 bg-yellow-100/40 backdrop-blur-sm",
} satisfies Record<NonNullable<HoneycombCell["tone"]>, string>;

export function MissionHoneycomb({ cells }: { cells: HoneycombCell[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto hidden w-[27.5rem] max-w-full sm:block sm:w-[32.5rem] lg:w-[36rem]"
      style={{ aspectRatio: CONTAINER_ASPECT }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportInView}
      aria-label="Gâyemiz ve ufkumuz petek göstergeleri"
    >
      {cells.map((cell, index) => {
        const isStat = cell.kind === "stat";

        return (
          <motion.div
            key={cell.id}
            className="group absolute w-[40%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
            style={{
              left: `${cell.position.col * 30}%`,
              top: `${cell.position.row * ROW_STEP}%`,
              aspectRatio: "2 / 1.7320508075688772",
              zIndex: isStat ? 2 : 1,
            }}
            initial={reduce ? false : { opacity: 0, scale: 0.9, y: 18 }}
            whileInView={
              reduce
                ? undefined
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { ...t(0.6), delay: index * 0.07 },
                  }
            }
            whileHover={reduce ? undefined : cellLift}
            whileFocus={reduce ? undefined : cellLift}
            viewport={viewportInView}
            aria-hidden={!isStat}
          >
            <div
              className={cn(
                "relative grid size-full place-items-center overflow-hidden",
                isStat
                  ? "bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-500 text-amber-950 shadow-[0_30px_80px_rgba(180,83,9,0.30)]"
                  : toneClassName[cell.tone ?? "surface"],
              )}
              style={{ clipPath: HEX_CLIP }}
            >
              {!isStat ? (
                cell.media?.kind === "image" ? (
                  <Image
                    src={cell.media.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 14rem, (min-width: 640px) 13rem, 0px"
                    className="absolute inset-0 object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.10] mix-blend-multiply"
                  />
                )
              ) : null}
              <div className="relative z-10 grid size-full place-items-center">
                {cell.children}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
