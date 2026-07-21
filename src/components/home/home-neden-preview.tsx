"use client";

import Link from "@/components/navigation/site-link";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  "İrfân",
  "Muhabbet",
  "Müteyakkız",
  "Hâfızlık",
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
  description = "Temiz ve huzurlu ortamdan nebevî eğitime, doğa ile iç içe yaşamdan hâfızlık ufkuna uzanan güçlü bir kurum dili.",
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
        <Marquee speed={48} className="py-fluid-2">
          {marqueeValues.map((v) => (
            <span
              key={v}
              className="text-charcoal/70 flex items-center gap-fluid-3 text-[length:var(--text-xs)] font-semibold tracking-[0.32em] uppercase"
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
          <div className="bg-brand-honey rounded-3xl px-fluid-6 py-fluid-6 md:px-fluid-8 md:py-fluid-8">
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

          <div className="relative mt-fluid-8 lg:mt-fluid-12">
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

/** iOS/touch: hover:none → iki dokunuş; mouse’lu masaüstü: hover:hover → hover flip */
const FINE_HOVER_MQ = "(hover: hover)";

function useFinePointerHover(): boolean {
  const [canHoverFlip, setCanHoverFlip] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(FINE_HOVER_MQ);
    const update = () => setCanHoverFlip(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHoverFlip;
}

function Honeycomb({ shape, items, reduce, onOpenModal }: HoneycombProps) {
  const canHoverFlip = useFinePointerHover();

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
            canHoverFlip={canHoverFlip}
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
  canHoverFlip: boolean;
  onOpenModal: (item: HoneycombItem, index: number) => void;
};

const HEX_BACK_MIN_FONT_PX = 6.5;

function fitHexBackBodyText(
  container: HTMLElement,
  text: HTMLElement,
  body: string,
): void {
  const { width: cw, height: ch } = container.getBoundingClientRect();
  if (cw <= 0 || ch <= 0) return;

  text.textContent = body;
  container.style.overflowY = "hidden";

  let lo = HEX_BACK_MIN_FONT_PX;
  let hi = Math.min(cw * 0.22, ch * 0.36, 18);
  let best = lo;

  while (hi - lo > 0.2) {
    const mid = (lo + hi) / 2;
    text.style.fontSize = `${mid}px`;
    const { width, height } = text.getBoundingClientRect();
    if (width <= cw && height <= ch) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  text.style.fontSize = `${best}px`;
  if (text.getBoundingClientRect().height > ch) {
    container.style.overflowY = "auto";
  }
}

type HexCellBackFaceProps = {
  body: string;
  isPrimary: boolean;
};

function HexCellBackFace({ body, isPrimary }: HexCellBackFaceProps) {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const container = textAreaRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let cancelled = false;

    const runFit = () => {
      if (cancelled) return;
      fitHexBackBodyText(container, text, body);
    };

    runFit();
    void document.fonts?.ready?.then(runFit);

    const observer = new ResizeObserver(runFit);
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [body]);

  return (
    <div className="pointer-events-none relative flex h-full flex-col items-center justify-center px-[10%] text-center">
      <div
        ref={textAreaRef}
        className="flex max-h-[75%] w-full min-h-0 items-center justify-center overflow-hidden overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        <p
          ref={textRef}
          className="m-0 font-medium leading-[1.25] text-balance text-charcoal"
        >
          {body}
        </p>
      </div>
      <span
        className={cn(
          "mt-1 shrink-0 self-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wide uppercase sm:px-3 sm:py-1 sm:text-[0.68rem]",
          isPrimary
            ? "border-charcoal/20 bg-white/40 text-charcoal"
            : "border-charcoal/20 bg-white/20 text-charcoal",
        )}
        aria-hidden
      >
        İncele
      </span>
    </div>
  );
}

function HexCell({
  item,
  index,
  position,
  reduce,
  canHoverFlip,
  onOpenModal,
}: HexCellProps) {
  const [tapped, setTapped] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Masaüstü: hover veya tap flip; dokunmatik: yalnızca tap state
  const isFlipped = tapped || (canHoverFlip && hovered && !reduce);
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
    setHovered(false);
  };

  const handleCellClick = () => {
    if (isFlipped) {
      openModalFromCell();
      return;
    }
    // Dokunmatik / coarse: önce flip; masaüstü hover zaten isFlipped yapar.
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
      className="neden-hex-cell group/hex absolute cursor-pointer touch-manipulation"
      style={{ ...containerStyle, ...frameStyle }}
      onClick={handleCellClick}
      onMouseEnter={() => {
        if (canHoverFlip) setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (canHoverFlip) setTapped(false);
      }}
    >
      <div className="relative size-full" style={perspectiveStyle}>
        <div
          className={cn(
            "neden-flip relative size-full",
            isFlipped && "is-flipped",
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
                  /* Hücre geometrisine özel rem skalası — fluid token petekte bozar */
                  "line-clamp-3 text-[1.4rem] leading-snug font-semibold tracking-tight text-balance sm:text-[1.22rem] md:text-[1.12rem] lg:text-[1.28rem] xl:text-[1.42rem]",
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
            <HexCellBackFace body={item.body} isPrimary={isPrimary} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
