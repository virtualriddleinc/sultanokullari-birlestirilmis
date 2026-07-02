"use client";

import Link from "@/components/navigation/site-link";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { NedenItem } from "@/content/neden-sultan";
import { nedenSultanItems } from "@/content/neden-sultan";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { HexLandingModal } from "@/components/ui/hex-landing-modal";
import {
  mapNedenItemToModal,
  type HexLandingModalContent,
} from "@/lib/hex-landing-modal";
import { springSnappy } from "@/lib/animations";
import { cn } from "@/lib/cn";
import beyazDesen from "@/images/beyaz-desen.svg";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";
const HEX_RATIO = "2 / 1.7320508075688772";
/** Bal köpüğü (#fff085) koyu tonu — petek hücre çerçeveleri */
const HONEY_FRAME = "#d9cc5c";

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

type ShapeKey = keyof typeof SHAPES;

function pickShape(width: number): ShapeKey {
  if (width < 640) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1280) return "lg";
  return "xl";
}

function useHoneycombShape(): ShapeKey {
  const [shape, setShape] = useState<ShapeKey>("md");

  useEffect(() => {
    const update = () => setShape(pickShape(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return shape;
}

const DEFAULT_VALUES = [
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

export type HomeNedenPreviewProps = {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  marqueeValues?: string[];
  items?: NedenItem[];
};

export function HomeNedenPreview({
  eyebrow = "Ayırt edici yaklaşım",
  title = "Neden",
  titleHighlight = "Sultan Okulları?",
  description = "Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hafızlık ufkuna uzanan güçlü bir kurum dili.",
  ctaLabel = `${nedenSultanItems.length} maddenin tamamı`,
  ctaHref = "/kurumsal/neden-sultan",
  marqueeValues = DEFAULT_VALUES,
  items: allItems = nedenSultanItems,
}: HomeNedenPreviewProps = {}) {
  const reduce = useReducedMotion();
  const items = allItems.slice(0, 11);
  const shapeKey = useHoneycombShape();
  const shape = SHAPES[shapeKey];
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] =
    useState<HexLandingModalContent | null>(null);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const openNedenModal = useCallback(
    (item: NedenItem, index: number) => {
      setModalContent(
        mapNedenItemToModal(item, index, ctaHref, ctaLabel, closeModal),
      );
      setModalOpen(true);
    },
    [ctaHref, ctaLabel, closeModal],
  );

  return (
    <section
      id="neden"
      data-section="neden"
      className="border-charcoal/10 bg-brand-green relative overflow-hidden border-y"
    >
      {/* Beyaz desen — hero yeşil zeminiyle aynı katman */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beyazDesen.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
      />

      <div className="border-charcoal/10 relative z-[1] border-y bg-white">
        <Marquee speed={48} className="py-4">
          {marqueeValues.map((v) => (
            <span
              key={v}
              className="text-charcoal/70 flex items-center gap-3 text-xs font-semibold tracking-[0.32em] uppercase"
            >
              {v}
              <span
                aria-hidden
                className="bg-brand-honey/80 inline-block w-2"
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

      <div className="section-page-grid relative z-[1] py-fluid-8 sm:py-fluid-16">
        <div className="section-page-grid__content">
          <div className="bg-brand-honey rounded-3xl px-6 py-8 sm:px-8 sm:py-10">
            <SectionHeading
              eyebrow={eyebrow}
              className="[&_.section-title]:text-black"
              title={`${title} ${titleHighlight}`}
              description={description}
              action={
                <Link href={ctaHref} className="cta-pill">
                  {ctaLabel} <span aria-hidden>→</span>
                </Link>
              }
            />
          </div>

          <div className="relative mt-10 sm:mt-12 lg:mt-16">
            <motion.div initial={false} animate="visible" variants={honeycombStaggerVariants}>
              <Honeycomb
                shape={shape}
                items={items}
                reduce={reduce}
                onOpenModal={openNedenModal}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <HexLandingModal
        open={modalOpen}
        onClose={closeModal}
        content={modalContent}
      />
    </section>
  );
}

type HoneycombItem = (typeof nedenSultanItems)[number];

type HoneycombProps = {
  shape: HoneycombShape;
  items: HoneycombItem[];
  reduce: boolean | null;
  onOpenModal: (item: HoneycombItem, index: number) => void;
};

function Honeycomb({ shape, items, reduce, onOpenModal }: HoneycombProps) {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: shape.aspectRatio }}
    >
      {/* Petek etrafı — yeşil glow halka */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[6%] -z-10 rounded-[42%] bg-[radial-gradient(ellipse_at_center,rgba(255,240,133,0.42),rgba(217,204,92,0.28)_45%,transparent_72%)] blur-3xl"
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
            onOpenModal={onOpenModal}
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
  onOpenModal: (item: HoneycombItem, index: number) => void;
};

function HexCell({ item, index, position, reduce, onOpenModal }: HexCellProps) {
  const [tapped, setTapped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isFlipped = tapped;
  const isPrimary = index % 4 === 0 || index === 10;
  const baseShadow = isPrimary
    ? "drop-shadow(0 0 18px rgba(217, 204, 92, 0.38))"
    : "drop-shadow(0 0 14px rgba(217, 204, 92, 0.28))";
  const hoverShadow = isPrimary
    ? "drop-shadow(0 0 26px rgba(217, 204, 92, 0.48))"
    : "drop-shadow(0 0 22px rgba(217, 204, 92, 0.36))";
  const containerStyle: CSSProperties = {
    left: `${position.left}%`,
    top: `${position.top}%`,
    width: `${position.width}%`,
    aspectRatio: HEX_RATIO,
    clipPath: HEX_CLIP,
    filter: baseShadow,
    transition: reduce ? undefined : "filter 0.4s ease",
  };

  // İç içe hexagon çerçevesi: dış konteynerin arka planı (bal köpüğü koyu tonu),
  // iç yüzler `inset-[3px]` ile geri çekilince ince bir hexagon halkası olarak görünür.
  const frameStyle: CSSProperties = { backgroundColor: HONEY_FRAME };

  const perspectiveStyle: CSSProperties = {
    perspective: "1100px",
  };

  const innerStyle: CSSProperties = {
    transformStyle: "preserve-3d",
    transition: reduce
      ? undefined
      : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isFlipped ? "rotateY(180deg)" : undefined,
  };

  const openModalFromCell = () => {
    onOpenModal(item, index);
    setTapped(false);
  };

  const handleCellClick = () => {
    if (isFlipped) {
      openModalFromCell();
      return;
    }
    // Masaüstü hover önizlemesinde arka yüz görünürken tek tıkla aç
    if (hovered && !reduce) {
      openModalFromCell();
      return;
    }
    setTapped(true);
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
      className="group/hex absolute cursor-pointer touch-manipulation"
      style={{ ...containerStyle, ...frameStyle }}
      onClick={handleCellClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative size-full" style={perspectiveStyle}>
        <div
          className={cn(
            "neden-flip relative size-full",
            !reduce &&
              !isFlipped &&
              "group-hover/hex:[transform:rotateY(180deg)]",
          )}
          style={innerStyle}
        >
          {/* FRONT */}
          <div
            className={cn(
              "absolute inset-[3px] overflow-hidden backdrop-blur-sm",
              isFlipped && "pointer-events-none",
              isPrimary
                ? "bg-brand-honey text-charcoal"
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

          {/* BACK — flip sonrası tıklama article handler ile modal açar */}
          <div
            className={cn(
              "absolute inset-[3px] overflow-hidden backdrop-blur-sm",
              !isFlipped && "pointer-events-none",
              isPrimary
                ? "bg-white/90 text-charcoal"
                : "bg-brand-honey text-charcoal",
            )}
            style={{ ...faceStyle, transform: "rotateY(180deg)" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.06] mix-blend-screen" />
            <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-2 px-[12%] text-center">
              <p className="line-clamp-5 text-[0.78rem] leading-snug font-medium text-balance text-charcoal sm:text-[0.7rem] md:text-[0.78rem] lg:text-[0.85rem] xl:text-[0.92rem]">
                {item.body}
              </p>
              <span
                className={cn(
                  "mt-1 shrink-0 rounded-full border px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase sm:text-[0.6rem] md:px-3.5 md:py-1.5 md:text-[0.65rem]",
                  isPrimary
                    ? "border-charcoal/20 bg-white/40 text-charcoal"
                    : "border-charcoal/20 bg-white/20 text-charcoal",
                )}
                aria-hidden
              >
                İncele
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
