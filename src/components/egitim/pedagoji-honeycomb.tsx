"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  FLAT_TOP_HEX_CLIP,
  FLAT_TOP_HEX_RATIO,
  MISSION_HONEYCOMB_LAYOUT,
} from "@/lib/flat-top-honeycomb";
import { springSnappy, t, viewportInView } from "@/lib/animations";

/** `MissionHoneycomb` ile aynı düz üst petek geometrisi. */
const CONTAINER_ASPECT = MISSION_HONEYCOMB_LAYOUT.aspectRatio;

/** Kurumsal birincil yeşil — Nebevî petek hücreleri. */
const HONEYCOMB_CELL_SHELL =
  "border border-emerald-950/25 bg-[#128a36] text-white shadow-[0_22px_56px_rgba(7,32,17,0.28)]";

const cellLift = {
  scale: 1.045,
  zIndex: 20,
  filter: "drop-shadow(0 28px 44px rgba(18, 138, 54, 0.35))",
  transition: springSnappy,
};

/**
 * Yedi kartlı petek — merkez (col 1, row 1) 7. madde ile doldurulur.
 * 4. madde merkezin sağındaki hücreye (2, 1.5); diğerleri kalan yerlere.
 */
const ITEM_HEX_POSITIONS: readonly {
  col: 0 | 1 | 2;
  row: 0 | 0.5 | 1 | 1.5 | 2;
}[] = [
  { col: 0, row: 1.5 },
  { col: 1, row: 0 },
  { col: 0, row: 0.5 },
  { col: 2, row: 1.5 },
  { col: 2, row: 0.5 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
];

/** Merkez hücre — petek örüntüsünün kalbi; hafif altın vurgusuyla öne çıkar. */
const HONEYCOMB_CENTER_CELL_SHELL =
  "border border-[#fff085]/70 bg-gradient-to-br from-[#17a542] via-[#128a36] to-[#0b6e29] text-white shadow-[0_26px_64px_rgba(7,32,17,0.34)]";

export type PedagojiHoneycombInfoCardProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

/** Ana sayfadaki Gâyemiz peteği yanındaki bilgi kartıyla aynı dil — petek yanına yerleşir. */
export function PedagojiHoneycombInfoCard({
  eyebrow,
  title,
  description,
}: PedagojiHoneycombInfoCardProps) {
  if (!eyebrow && !title && !description) return null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-emerald-950/25 bg-[#128a36] p-fluid-6 shadow-[0_28px_80px_rgba(7,32,17,0.30)] md:p-fluid-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.10] mix-blend-screen"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.16),transparent_55%)]"
      />
      <div className="relative z-10">
        {eyebrow ? (
          <p className="inline-flex min-h-[44px] items-center rounded-full border border-black/5 bg-white px-3 py-1.5 text-[length:var(--text-xs)] font-bold tracking-widest text-[#1a1c18] uppercase shadow-sm">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="font-cinzel mt-fluid-4 text-[length:var(--text-2xl)] leading-tight font-bold tracking-tight text-balance text-white md:text-[length:var(--text-3xl)]">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-relaxed text-pretty text-white/85 md:text-[length:var(--text-base)]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export type PedagojiHoneycombProps = {
  items: readonly { title: string; text: string }[];
  /** PedagojiSection başlığı — erişilebilir liste etiketi. */
  sectionLabel: string;
  /** Petek yanına yerleşen bilgi kartı — ana sayfa Gâyemiz peteğiyle aynı düzen. */
  eyebrow?: string;
  title?: string;
  description?: string;
};

function HoneyCellContent({ item }: { item: { title: string; text: string } }) {
  return (
    <div className="flex h-full max-h-full min-h-0 flex-col items-center justify-center gap-1 px-[10%] py-2 text-center sm:gap-1.5 sm:px-[11%] sm:py-2.5 md:px-[12%]">
      <h3 className="line-clamp-2 text-[0.68rem] leading-tight font-bold tracking-tight text-balance text-white sm:text-[0.72rem] md:text-[0.78rem] lg:text-[0.82rem]">
        {item.title}
      </h3>
      <p className="line-clamp-5 text-[0.58rem] leading-snug font-medium text-pretty text-white/90 sm:text-[0.62rem] md:text-[0.66rem] lg:text-[0.7rem]">
        {item.text}
      </p>
    </div>
  );
}

export function PedagojiHoneycomb({
  items,
  sectionLabel,
  eyebrow,
  title,
  description,
}: PedagojiHoneycombProps) {
  const reduce = useReducedMotion();
  const centerIndex = ITEM_HEX_POSITIONS.length - 1;

  if (items.length !== ITEM_HEX_POSITIONS.length) {
    return null;
  }

  return (
    <div className="mt-fluid-12 grid w-full grid-cols-1 items-center gap-fluid-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-fluid-12">
      {/* ── Bilgi kartı — ana sayfa Gâyemiz peteğiyle aynı düzen; mobil/tablette petek üstünde ── */}
      <div className="order-1 lg:order-2">
        <PedagojiHoneycombInfoCard
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>

      {/* ── Petek — mobil/tablette bilgi kartı altında ── */}
      <div className="order-2 lg:order-1">
        <ul
          className="relative mx-auto hidden w-full max-w-md list-none md:block lg:mx-0 lg:max-w-none"
          style={{ aspectRatio: CONTAINER_ASPECT }}
          aria-label={sectionLabel}
        >
          {items.map((item, index) => {
            const pos = ITEM_HEX_POSITIONS[index];
            const isCenter = index === centerIndex;
            const { left, top, width } = MISSION_HONEYCOMB_LAYOUT.cellPosition(
              pos.col,
              pos.row,
            );
            return (
              <motion.li
                key={item.title}
                className="group absolute focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  aspectRatio: FLAT_TOP_HEX_RATIO,
                  zIndex: isCenter ? 3 : 2,
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
              >
                <div
                  className={cn(
                    "relative grid size-full place-items-center overflow-hidden",
                    isCenter ? HONEYCOMB_CENTER_CELL_SHELL : HONEYCOMB_CELL_SHELL,
                  )}
                  style={{ clipPath: FLAT_TOP_HEX_CLIP }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.14] mix-blend-screen"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.2),transparent_55%)]"
                  />
                  <div className="relative z-10 grid size-full min-h-0 place-items-center">
                    <HoneyCellContent item={item} />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <ul
          className="relative mx-auto flex max-w-md flex-col items-center gap-fluid-4 md:hidden"
          aria-label={sectionLabel}
        >
          {items.map((item, index) => {
            const isCenter = index === centerIndex;
            return (
              <motion.li
                key={item.title}
                className="flex w-full justify-center"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={viewportInView}
                transition={{ ...t(0.55), delay: index * 0.06 }}
              >
                <div
                  className={cn(
                    "relative grid w-[min(17.5rem,88vw)] place-items-center",
                    isCenter ? HONEYCOMB_CENTER_CELL_SHELL : HONEYCOMB_CELL_SHELL,
                  )}
                  style={{
                    aspectRatio: FLAT_TOP_HEX_RATIO,
                    clipPath: FLAT_TOP_HEX_CLIP,
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.14] mix-blend-screen"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.2),transparent_55%)]"
                  />
                  <div className="relative z-10 grid size-full min-h-0 place-items-center">
                    <HoneyCellContent item={item} />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
