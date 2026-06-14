"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useState, type CSSProperties } from "react";
import { nedenSultanItems } from "@/content/neden-sultan";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { springSnappy } from "@/lib/animations";
import { cn } from "@/lib/cn";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";
const HEX_RATIO = "2 / 1.7320508075688772";

const honeycombStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02,
    },
  },
};

const honeycombCellVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnappy,
  },
};

type CellPosition = { left: number; top: number; width: number };

type HoneycombShape = {
  cols: number;
  rows: number;
  positions: CellPosition[];
  aspectRatio: string;
};

function buildShape(cols: number, total: number): HoneycombShape {
  const rows = Math.ceil(total / cols);
  const hexW = 100 / (1 + (cols - 1) * 0.75);
  const hexHpctW = hexW * (Math.sqrt(3) / 2);
  const containerHpctW = rows * hexHpctW + 0.5 * hexHpctW;
  const positions: CellPosition[] = [];

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const left = col * 0.75 * hexW;
    const topInW = (row + (col % 2 === 1 ? 0.5 : 0)) * hexHpctW;
    const top = (topInW / containerHpctW) * 100;
    positions.push({ left, top, width: hexW });
  }

  return {
    cols,
    rows,
    positions,
    aspectRatio: `${100} / ${containerHpctW.toFixed(4)}`,
  };
}

const SHAPES = {
  xs: buildShape(2, 11),
  sm: buildShape(3, 11),
  md: buildShape(4, 11),
  lg: buildShape(4, 11),
  xl: buildShape(5, 11),
} as const;

const values = [
  "İlim",
  "Hikmet",
  "Edeb",
  "Ahlâk",
  "Üsve-i hasene",
  "İrfan",
  "Muhabbet",
  "Müteyakkız",
  "Hafızlık",
  "Köklere bağlı",
];

export function HomeNedenPreview() {
  const reduce = useReducedMotion();
  const items = nedenSultanItems.slice(0, 11);
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldRenderHoneycomb = useInView(sectionRef, {
    once: true,
    margin: "160px 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="neden"
      data-section="neden"
      className="border-charcoal/10 bg-brand-honey/35 relative overflow-hidden border-y"
    >
      <div className="border-charcoal/10 border-y bg-white/40">
        <Marquee speed={48} className="py-4">
          {values.map((v) => (
            <span
              key={v}
              className="text-charcoal/70 flex items-center gap-3 text-xs font-semibold tracking-[0.32em] uppercase"
            >
              {v}
              <span
                aria-hidden
                className="bg-brand-green/60 inline-block w-2"
                style={{
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath:
                    "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
                }}
              />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="section-page-grid py-fluid-8 sm:py-fluid-16">
        <div className="section-page-grid__content">
          <SectionHeading
            eyebrow="Ayırt edici yaklaşım"
            title={
              <>
                Neden <span className="text-brand-green">Sultan Okulları?</span>
              </>
            }
            description="Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hafızlık ufkuna uzanan güçlü bir kurum dili."
            action={
              <Link href="/kurumsal/neden-sultan" className="cta-pill">
                {nedenSultanItems.length} maddenin tamamı{" "}
                <span aria-hidden>→</span>
              </Link>
            }
          />

          <div className="relative mt-10 sm:mt-12 lg:mt-16">
            {shouldRenderHoneycomb ? (
              <motion.div
                initial={reduce ? false : "hidden"}
                animate="visible"
                variants={honeycombStaggerVariants}
              >
                <Honeycomb
                  shape={SHAPES.xs}
                  items={items}
                  className="block sm:hidden"
                  reduce={reduce}
                />
                <Honeycomb
                  shape={SHAPES.sm}
                  items={items}
                  className="hidden sm:block md:hidden"
                  reduce={reduce}
                />
                <Honeycomb
                  shape={SHAPES.md}
                  items={items}
                  className="hidden md:block lg:hidden"
                  reduce={reduce}
                />
                <Honeycomb
                  shape={SHAPES.lg}
                  items={items}
                  className="hidden lg:block xl:hidden"
                  reduce={reduce}
                />
                <Honeycomb
                  shape={SHAPES.xl}
                  items={items}
                  className="hidden xl:block"
                  reduce={reduce}
                />
              </motion.div>
            ) : (
              <div
                aria-hidden
                className="border-charcoal/10 h-[26rem] rounded-[2rem] border bg-white/35 sm:h-[30rem] lg:h-[34rem]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type HoneycombItem = (typeof nedenSultanItems)[number];

type HoneycombProps = {
  shape: HoneycombShape;
  items: HoneycombItem[];
  className?: string;
  reduce: boolean | null;
};

function Honeycomb({ shape, items, className, reduce }: HoneycombProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: shape.aspectRatio }}
    >
      {/* Petek etrafı — yeşil glow halka */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[6%] -z-10 rounded-[42%] bg-[radial-gradient(ellipse_at_center,rgba(13,107,42,0.28),rgba(16,185,129,0.18)_45%,transparent_72%)] blur-3xl"
      />
      {items.map((item, i) => {
        const pos = shape.positions[i];
        if (!pos) return null;
        return (
          <HexCell
            key={item.headline}
            item={item}
            index={i}
            position={pos}
            reduce={reduce}
          />
        );
      })}
    </div>
  );
}

type HexCellProps = {
  item: HoneycombItem;
  index: number;
  position: CellPosition;
  reduce: boolean | null;
};

function HexCell({ item, index, position, reduce }: HexCellProps) {
  const [tapped, setTapped] = useState(false);
  const isPrimary = index % 4 === 0 || index === 10;
  const baseShadow = isPrimary
    ? "drop-shadow(0 0 18px rgba(13, 107, 42, 0.26))"
    : "drop-shadow(0 0 14px rgba(13, 107, 42, 0.18))";
  const hoverShadow = isPrimary
    ? "drop-shadow(0 0 26px rgba(13, 107, 42, 0.34))"
    : "drop-shadow(0 0 22px rgba(13, 107, 42, 0.26))";
  const containerStyle: CSSProperties = {
    left: `${position.left}%`,
    top: `${position.top}%`,
    width: `${position.width}%`,
    aspectRatio: HEX_RATIO,
    filter: baseShadow,
    transition: reduce ? undefined : "filter 0.4s ease",
  };

  const perspectiveStyle: CSSProperties = {
    perspective: "1100px",
  };

  const innerStyle: CSSProperties = {
    transformStyle: "preserve-3d",
    transition: reduce
      ? undefined
      : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: tapped ? "rotateY(180deg)" : undefined,
  };

  const faceStyle: CSSProperties = {
    clipPath: HEX_CLIP,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <motion.article
      variants={honeycombCellVariants}
      whileHover={reduce ? undefined : { y: -4, filter: hoverShadow }}
      transition={springSnappy}
      className="group/hex absolute"
      style={containerStyle}
      onClick={() => setTapped((v) => !v)}
      onMouseLeave={() => setTapped(false)}
    >
      <div className="relative size-full" style={perspectiveStyle}>
        <div
          className={cn(
            "neden-flip relative size-full",
            !reduce &&
              "group-focus-within/hex:[transform:rotateY(180deg)] group-hover/hex:[transform:rotateY(180deg)]",
          )}
          style={innerStyle}
        >
          {/* FRONT */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden backdrop-blur-sm",
              isPrimary
                ? "bg-brand-green text-charcoal"
                : "text-charcoal bg-white/65",
            )}
            style={faceStyle}
          >
            <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.10] mix-blend-multiply" />
            <div className="relative flex h-full flex-col items-center justify-center px-[10%] text-center">
              <h3
                className={cn(
                  "line-clamp-3 text-[0.95rem] leading-snug font-semibold tracking-tight text-balance sm:text-[0.78rem] md:text-sm lg:text-base xl:text-lg",
                  isPrimary ? "text-charcoal" : "text-charcoal",
                )}
              >
                {item.headline}
              </h3>
            </div>
          </div>

          {/* BACK */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden backdrop-blur-sm",
              isPrimary
                ? "bg-charcoal text-brand-honey"
                : "bg-brand-green text-charcoal",
            )}
            style={{ ...faceStyle, transform: "rotateY(180deg)" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.06] mix-blend-screen" />
            <div className="relative flex h-full flex-col items-center justify-center px-[12%] text-center">
              <p className="line-clamp-6 text-[0.78rem] leading-snug font-medium text-balance text-white/95 sm:text-[0.7rem] md:text-[0.78rem] lg:text-[0.85rem] xl:text-[0.92rem]">
                {item.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
