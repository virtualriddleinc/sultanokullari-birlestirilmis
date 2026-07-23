"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

function LazyHoneyVideo({
  src,
  poster,
  objectPosition,
}: {
  src: string;
  poster?: string;
  objectPosition: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      playsInline
      autoPlay={shouldLoad}
      loop
      preload="none"
      className="absolute inset-0 size-full object-cover"
      style={{ objectPosition }}
    />
  );
}

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
  /** CMS odak noktası (yüzde) — dekor görseller; en-boy oranı korunur (object-cover) */
  focalPoint?: { x: number; y: number };
  children?: ReactNode;
  /** Stat hücreleri — ilgili kademe sayfası */
  href?: string;
  /** Stat hücreleri — erişilebilir link etiketi */
  linkLabel?: string;
  /** Yeşil bilgi kartında gösterilecek başlık satırları (hover; yoksa modal.title) */
  cardTitleLines?: string[];
  /** Yeşil bilgi kartında gösterilecek ikinci paragraf (hover) */
  cardSecondaryDescription?: string;
  modal?: Omit<HexLandingModalContent, "trustNote" | "secondaryCta">;
};

export type MissionHoneycombProps = {
  cells: HoneycombCell[];
  /** Otomatik döngüde (veya dışarıdan) vurgulanacak hücre — hover aktif hücrenin üstüne biner */
  featuredCellId?: string | null;
  /** Hover/odak ile aktif hücre değişince yeşil bilgi kartını güncellemek için */
  onActiveCellChange?: (cell: HoneycombCell | null) => void;
};

export const MISSION_HONEYCOMB_ASPECT =
  MISSION_HONEYCOMB_LAYOUT.aspectRatioNumber;
const cellLift = {
  scale: 1.03,
  zIndex: 20,
  filter: "drop-shadow(0 20px 32px rgba(180, 83, 9, 0.22))",
  transition: springSnappy,
};
const toneClassName = {
  surface:
    "bg-amber-50/70 shadow-[0_24px_70px_rgba(180,83,9,0.10)] backdrop-blur-sm",
  primary: "bg-amber-400/22 backdrop-blur-sm",
  emerald: "bg-orange-300/22 backdrop-blur-sm",
  glass: "bg-yellow-100/40 backdrop-blur-sm",
} satisfies Record<NonNullable<HoneycombCell["tone"]>, string>;

const ACTIVE_CLEAR_MS = 40;

export function MissionHoneycomb({
  cells,
  featuredCellId = null,
  onActiveCellChange,
}: MissionHoneycombProps) {
  const reduce = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] =
    useState<HexLandingModalContent | null>(null);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const activeCellIdRef = useRef<string | null>(null);
  const clearActiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  const activateCell = useCallback(
    (cell: HoneycombCell) => {
      if (!cell.modal) return;
      if (clearActiveTimerRef.current) {
        clearTimeout(clearActiveTimerRef.current);
        clearActiveTimerRef.current = null;
      }
      activeCellIdRef.current = cell.id;
      setActiveCellId(cell.id);
      onActiveCellChange?.(cell);
    },
    [onActiveCellChange],
  );

  const scheduleDeactivate = useCallback((cellId: string) => {
    if (clearActiveTimerRef.current) {
      clearTimeout(clearActiveTimerRef.current);
    }
    clearActiveTimerRef.current = setTimeout(() => {
      clearActiveTimerRef.current = null;
      // Yalnızca hücre hover efektini kaldır — yeşil kart CTA için içerik
      // bölüm (section) mouse leave ile sıfırlanır.
      if (activeCellIdRef.current !== cellId) return;
      activeCellIdRef.current = null;
      setActiveCellId(null);
    }, ACTIVE_CLEAR_MS);
  }, []);

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
          const isPreviewable = Boolean(cell.modal);
          const isActive =
            activeCellId === cell.id || featuredCellId === cell.id;
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
                isActive && "brightness-[1.08]",
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
                    style={{
                      objectPosition: cell.focalPoint
                        ? `${cell.focalPoint.x}% ${cell.focalPoint.y}%`
                        : "50% 50%",
                    }}
                  />
                ) : cell.media?.kind === "video" ? (
                  <LazyHoneyVideo
                    src={cell.media.src}
                    poster={cell.media.poster}
                    objectPosition={
                      cell.focalPoint
                        ? `${cell.focalPoint.x}% ${cell.focalPoint.y}%`
                        : "50% 50%"
                    }
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

          const activeHandlers = isPreviewable
            ? {
                onHoverStart: () => activateCell(cell),
                onHoverEnd: () => scheduleDeactivate(cell.id),
                onFocus: () => activateCell(cell),
                onBlur: () => scheduleDeactivate(cell.id),
              }
            : {};

          const motionProps = {
            className: cn(
              "group absolute block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]",
              (isDecorInteractive || isStatLink || isPreviewable) &&
                "cursor-pointer",
            ),
            style: {
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              aspectRatio: FLAT_TOP_HEX_RATIO,
              zIndex: isActive ? 20 : isStat ? 2 : 1,
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
            whileHover: reduce || !isPreviewable ? undefined : cellLift,
            whileFocus: reduce || !isPreviewable ? undefined : cellLift,
            viewport: viewportInView,
            ...activeHandlers,
          } as const;

          if (isStatLink && cell.href) {
            return (
              <MotionLink
                key={cell.id}
                {...motionProps}
                href={cell.href}
                aria-label={`${cell.linkLabel ?? cell.href} — kademe sayfasına git`}
                aria-current={isActive ? "true" : undefined}
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
              aria-current={isActive ? "true" : undefined}
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
