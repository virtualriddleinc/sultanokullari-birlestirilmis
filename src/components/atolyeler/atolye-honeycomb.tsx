"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Atom,
  FlaskConical,
  FlipHorizontal,
  Heart,
  Palette,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { kesfBilim, sanatVeSpor } from "@/content/kesf-bilim";
import {
  workshopItems,
  type WorkshopCategory,
  type WorkshopItem,
} from "@/content/workshops";
import { springSnappy, t } from "@/lib/animations";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";
const HEX_RATIO = "2 / 1.7320508075688772";

/** İlk yükleme: 500ms sonra 0. kart, sonra her 1000ms bir sonraki kart (en fazla 3) */
const INTRO_FLIP_DELAY_MS = 500;
const INTRO_FLIP_STAGGER_MS = 1000;
const INTRO_FLIP_HOLD_MS = 950;
const INTRO_DEMO_MAX_INDEX = 2;

/* ─── Filtre tanımları ────────────────────────────────────────── */
type FilterId = WorkshopCategory | "tumu";

const filters: Array<{ id: FilterId; label: string; Icon: LucideIcon }> = [
  { id: "tumu", label: "Tümü", Icon: Atom },
  { id: "bilim", label: "Bilim", Icon: FlaskConical },
  { id: "sanat", label: "Sanat", Icon: Palette },
  { id: "sosyal", label: "Sosyal", Icon: Heart },
  { id: "spor", label: "Spor", Icon: Trophy },
];

/* ─── Kategori temaları ───────────────────────────────────────── */
type CategoryTheme = {
  label: string;
  Icon: LucideIcon;
  bg: string;
  text: string;
  /** Arka yüz — koyu degrade + beyaz metin (Neden Sultan flip ile uyumlu) */
  backBg: string;
  dropShadow: string;
  dropShadowHover: string;
};

const CATEGORY_THEME: Record<WorkshopCategory, CategoryTheme> = {
  bilim: {
    label: "Bilim",
    Icon: FlaskConical,
    bg: "bg-gradient-to-br from-sky-400 via-cyan-500 to-teal-600",
    text: "text-white",
    backBg:
      "bg-gradient-to-br from-sky-800 via-cyan-800 to-teal-950 text-white",
    dropShadow: "drop-shadow(0 18px 28px rgba(8, 47, 73, 0.35))",
    dropShadowHover: "drop-shadow(0 26px 42px rgba(8, 47, 73, 0.45))",
  },
  sanat: {
    label: "Sanat",
    Icon: Palette,
    bg: "bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-500",
    text: "text-amber-950",
    backBg:
      "bg-gradient-to-br from-amber-800 via-orange-700 to-amber-950 text-white",
    dropShadow: "drop-shadow(0 18px 28px rgba(120, 53, 15, 0.32))",
    dropShadowHover: "drop-shadow(0 26px 40px rgba(120, 53, 15, 0.42))",
  },
  sosyal: {
    label: "Sosyal",
    Icon: Heart,
    bg: "bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800",
    text: "text-white",
    backBg:
      "bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white",
    dropShadow: "drop-shadow(0 18px 28px rgba(6, 78, 59, 0.35))",
    dropShadowHover: "drop-shadow(0 26px 40px rgba(6, 78, 59, 0.45))",
  },
  spor: {
    label: "Spor",
    Icon: Trophy,
    bg: "bg-gradient-to-br from-rose-400 via-red-500 to-rose-700",
    text: "text-white",
    backBg:
      "bg-gradient-to-br from-rose-800 via-red-800 to-rose-950 text-white",
    dropShadow: "drop-shadow(0 18px 28px rgba(136, 19, 55, 0.35))",
    dropShadowHover: "drop-shadow(0 26px 40px rgba(136, 19, 55, 0.45))",
  },
};

/* ─── Responsive sütun sayısı (flat-top hex grid) ─────────────── */
function colsFromWidth(w: number) {
  if (w < 480) return 2;
  if (w < 720) return 3;
  if (w < 1024) return 4;
  return 5;
}

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function useHexCols(): number {
  return useSyncExternalStore(
    subscribeResize,
    () => colsFromWidth(window.innerWidth),
    () => 3,
  );
}

/** Ön / arka köşede flip ikonu (salınan ipucu) */
function FlipHintCorner({
  item,
  index,
  reduce,
  face,
  pauseIconMotion,
}: {
  item: WorkshopItem;
  index: number;
  reduce: boolean | null;
  face: "front" | "back";
  pauseIconMotion: boolean;
}) {
  const isSanat = item.category === "sanat";
  const isBack = face === "back";

  return (
    <span
      aria-hidden
      className={cn(
        "atolye-flip-hint-badge pointer-events-none absolute top-[6%] right-[5%] z-20",
        "group-hover/hex:[&_.atolye-flip-hint-icon]:[animation-play-state:paused]",
        "group-focus-within/hex:[&_.atolye-flip-hint-icon]:[animation-play-state:paused]",
        pauseIconMotion &&
          "[&_.atolye-flip-hint-icon]:[animation-play-state:paused]",
      )}
    >
      <span
        className={cn(
          "relative flex size-7 items-center justify-center rounded-full border shadow-md backdrop-blur-md sm:size-8",
          isBack
            ? "border-white/35 bg-white/18 ring-1 ring-white/30"
            : isSanat
              ? "border-amber-900/25 bg-amber-950/15 ring-1 ring-amber-950/10"
              : "border-white/40 bg-black/20 ring-1 ring-white/15",
        )}
      >
        <span
          className={cn(
            "atolye-flip-hint-icon",
            !reduce && "motion-safe:will-change-transform",
          )}
          style={
            reduce ? undefined : { animationDelay: `${(index % 9) * 0.14}s` }
          }
        >
          <FlipHorizontal
            className={cn(
              "size-3.5 sm:size-4",
              isBack || !isSanat
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                : "text-amber-950/90",
            )}
            strokeWidth={2.25}
          />
        </span>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full opacity-70",
            isBack
              ? "shadow-[0_0_12px_rgba(255,255,255,0.28)]"
              : isSanat
                ? "shadow-[0_0_14px_rgba(120,53,15,0.35)]"
                : "shadow-[0_0_14px_rgba(255,255,255,0.35)]",
            !reduce && "motion-safe:animate-pulse",
          )}
        />
      </span>
    </span>
  );
}

/* ─── Petek hücresi (Neden Sultan — home-neden-preview flip ile aynı desen) ─ */
function HexCell({
  item,
  index,
  reduce,
  playIntroDemo,
}: {
  item: WorkshopItem;
  index: number;
  reduce: boolean | null;
  playIntroDemo: boolean;
}) {
  const theme = CATEGORY_THEME[item.category];
  const Icon = theme.Icon;
  const [tapped, setTapped] = useState(false);
  const [introFlip, setIntroFlip] = useState(false);

  useEffect(() => {
    if (!playIntroDemo || reduce || index > INTRO_DEMO_MAX_INDEX) return;
    const showAt = INTRO_FLIP_DELAY_MS + index * INTRO_FLIP_STAGGER_MS;
    const hideAt = showAt + INTRO_FLIP_HOLD_MS;
    const tShow = window.setTimeout(() => setIntroFlip(true), showAt);
    const tHide = window.setTimeout(() => setIntroFlip(false), hideAt);
    return () => {
      window.clearTimeout(tShow);
      window.clearTimeout(tHide);
    };
  }, [playIntroDemo, reduce, index]);

  const flipped = tapped || introFlip;

  const containerStyle: CSSProperties = {
    filter: theme.dropShadow,
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
    transform: flipped ? "rotateY(180deg)" : undefined,
  };

  const faceStyle: CSSProperties = {
    clipPath: HEX_CLIP,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, scale: 0.92, y: 12 }}
      animate={
        reduce
          ? undefined
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { ...t(0.55), delay: index * 0.035 },
            }
      }
      whileHover={
        reduce
          ? undefined
          : { y: -4, filter: theme.dropShadowHover, transition: springSnappy }
      }
      transition={springSnappy}
      className="group/hex absolute inset-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      style={containerStyle}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${theme.label}. Çift taraflı kart; etkileşimle arka yüzüne geçilebilir.`}
      onClick={() => setTapped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setTapped((v) => !v);
        }
      }}
      onMouseLeave={() => setTapped(false)}
    >
      <div className="relative size-full" style={perspectiveStyle}>
        <div
          className={cn(
            "relative size-full",
            !reduce &&
              "group-focus-within/hex:[transform:rotateY(180deg)] group-hover/hex:[transform:rotateY(180deg)]",
          )}
          style={innerStyle}
        >
          {/* Ön yüz — başlık + ikon */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden shadow-[0_22px_56px_rgba(15,23,42,0.18)] backdrop-blur-sm",
              theme.bg,
              theme.text,
            )}
            style={faceStyle}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.10] mix-blend-overlay"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 border-[3px] border-white/25 transition-colors duration-300 group-hover/hex:border-white/45"
              style={{ clipPath: HEX_CLIP }}
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.38),transparent_55%)]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.18)_100%)]"
            />
            <FlipHintCorner
              face="front"
              item={item}
              index={index}
              reduce={reduce}
              pauseIconMotion={flipped}
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1.5 px-[12%] text-center">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[0.55rem] font-semibold tracking-[0.22em] uppercase opacity-90 sm:text-[0.58rem]",
                  item.category === "sanat"
                    ? "text-amber-900/90"
                    : "text-white/90",
                )}
              >
                {theme.label}
              </span>
              <Icon
                className="size-5 opacity-90 sm:size-6 lg:size-6"
                aria-hidden
                strokeWidth={2.2}
              />
              <p className="text-[0.70rem] leading-[1.15] font-semibold tracking-tight text-balance sm:text-xs lg:text-[0.78rem]">
                {item.title}
              </p>
            </div>
          </div>

          {/* Arka yüz — açıklama */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden shadow-[0_22px_56px_rgba(15,23,42,0.22)] backdrop-blur-sm",
              theme.backBg,
            )}
            style={{ ...faceStyle, transform: "rotateY(180deg)" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.08] mix-blend-screen"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 border-[3px] border-white/35"
              style={{ clipPath: HEX_CLIP }}
            />
            <FlipHintCorner
              face="back"
              item={item}
              index={index}
              reduce={reduce}
              pauseIconMotion={flipped}
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-[11%] text-center">
              <Icon
                className="size-4 text-white/80 sm:size-5"
                aria-hidden
                strokeWidth={2}
              />
              <p className="mt-1.5 line-clamp-6 text-[0.62rem] leading-snug font-medium text-balance text-white/95 sm:text-[0.68rem] lg:text-[0.72rem] lg:leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Honeycomb yerleşim ──────────────────────────────────────── */
function Honeycomb({
  items,
  reduce,
  playIntroDemo,
}: {
  items: WorkshopItem[];
  reduce: boolean | null;
  playIntroDemo: boolean;
}) {
  const cols = useHexCols();

  /* Flat-top petek geometrisi:
     - Genişlik W, Yükseklik H = W * √3/2
     - Sütunlar yatayda 0.75W ileri (25% örtüşme)
     - Tek sütunlar 0.5H aşağı kayar
     Container genişliği = 100% → cellW % = 100 / (0.75*cols + 0.25)
  */
  const cellWPct = 100 / (0.75 * cols + 0.25);
  const rows = Math.ceil(items.length / cols);

  // Container yüksekliği oranı (height / width):
  // toplam yatay genişlik = 100% → 1 birim
  // her hücre yüksekliği H = cellW * √3/2
  // toplam dikey alan = (rows + 0.5) * H  (tek sütun ofseti dahil)
  const cellHPctOfWidth = cellWPct * (Math.sqrt(3) / 2); // % cinsinden, container width’e göre
  const containerAspectH = ((rows + 0.5) * cellHPctOfWidth) / 100; // height / width

  return (
    <div
      className="relative w-full"
      style={{ paddingTop: `${containerAspectH * 100}%` }}
      role="list"
      aria-label="Atölye ve kulüp peteği"
    >
      <div className="absolute inset-0">
        {items.map((item, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          // Tek sütunlar yarım hücre aşağı
          const yOffset = col % 2 === 1 ? 0.5 : 0;
          const leftPct = col * 0.75 * cellWPct;
          // Dikey: 100% container yüksekliğinin oranını hesapla
          const topPctOfContainerHeight =
            (((row + yOffset) * cellHPctOfWidth) / (containerAspectH * 100)) *
            100;

          return (
            <div
              key={item.id}
              role="listitem"
              className="absolute"
              style={{
                left: `${leftPct}%`,
                top: `${topPctOfContainerHeight}%`,
                width: `${cellWPct}%`,
                aspectRatio: HEX_RATIO,
              }}
            >
              <HexCell
                item={item}
                index={i}
                reduce={reduce}
                playIntroDemo={playIntroDemo}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────── */
export function AtolyeHoneycomb() {
  const reduce = useReducedMotion();
  const [cat, setCat] = useState<FilterId>("tumu");
  const [introDemoDone, setIntroDemoDone] = useState(false);

  const list = useMemo(
    () =>
      cat === "tumu"
        ? workshopItems
        : workshopItems.filter((w) => w.category === cat),
    [cat],
  );

  const playIntroDemo = !introDemoDone && !reduce && list.length > 0;

  useEffect(() => {
    if (introDemoDone || reduce) return;
    if (list.length === 0) {
      const t0 = window.setTimeout(() => setIntroDemoDone(true), 0);
      return () => window.clearTimeout(t0);
    }
    const lastIdx = Math.min(INTRO_DEMO_MAX_INDEX, list.length - 1);
    const lastStart = INTRO_FLIP_DELAY_MS + lastIdx * INTRO_FLIP_STAGGER_MS;
    const doneAt = lastStart + INTRO_FLIP_HOLD_MS + 280;
    const t = window.setTimeout(() => setIntroDemoDone(true), doneAt);
    return () => window.clearTimeout(t);
  }, [introDemoDone, reduce, list.length]);

  return (
    <div className="space-y-fluid-8">
      {/* ── Filtre çubuğu ── */}
      <div className="flex flex-wrap gap-fluid-2">
        {filters.map((f) => {
          const Icon = f.Icon;
          const isActive = cat === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setCat(f.id)}
              className={cn(
                "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-[length:var(--text-sm)] font-medium transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_8px_24px_rgba(18,138,54,0.25)]"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── Petek alan ── */}
      <AnimatePresence mode="wait">
        {list.length > 0 ? (
          <motion.div
            key={cat}
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Honeycomb
              items={list}
              reduce={reduce}
              playIntroDemo={playIntroDemo}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-6 text-sm leading-6 text-zinc-600"
          >
            Bu kategoride ayrı listelenen atölye bulunmuyor. Sanat–spor metni
            aşağıda; okçuluk, binicilik ve yüzme gibi içerikleri orada
            bulabilirsiniz.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Keşf-i bilim & Sanat-spor metinleri ── */}
      <div className="grid gap-fluid-4 md:grid-cols-2">
        <section className="rounded-2xl border border-cyan-200/60 bg-cyan-50/60 p-5 md:p-6">
          <div className="flex items-center gap-2 text-cyan-800">
            <FlaskConical className="size-4" aria-hidden />
            <h2 className="text-[length:var(--text-base)] font-semibold">
              Keşf-i bilim
            </h2>
          </div>
          <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
            {kesfBilim}
          </p>
        </section>

        <section className="rounded-2xl border border-amber-200/60 bg-amber-50/70 p-5 md:p-6">
          <div className="flex items-center gap-2 text-amber-800">
            <Palette className="size-4" aria-hidden />
            <h2 className="text-[length:var(--text-base)] font-semibold">
              Sanat ve spor
            </h2>
          </div>
          <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700">
            {sanatVeSpor}
          </p>
        </section>
      </div>
    </div>
  );
}
