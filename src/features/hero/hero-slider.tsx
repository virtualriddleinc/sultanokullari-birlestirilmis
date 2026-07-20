"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "@/components/navigation/site-link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HexLandingModal } from "@/components/ui/hex-landing-modal";
import { useMobileHexInteractive } from "@/hooks/use-mobile-hex-interactive";
import { mapHeroSlideToModal } from "@/lib/hex-landing-modal";
import type { HexLandingModalContent } from "@/lib/hex-landing-modal";
import { HeroFramedHexMediaContent } from "./hero-framed-hex-media";
import {
  HERO_SLIDE_DESCRIPTION_CLASS,
  HERO_SLIDE_TAGLINE_CLASS,
  HeroInfoCard,
  HeroInfoCardShell,
  HeroSlideTitle,
} from "./hero-info-card";
import { cn } from "@/lib/cn";
import type { HeroSlide } from "./slides";

type HeroSliderFooterProps = {
  currentIndex: number;
  count: number;
  progress: number;
  slides: HeroSlide[];
  goTo: (idx: number, dir: 1 | -1) => void;
  prevSlide: () => void;
  nextSlide: () => void;
  className?: string;
};

const FOOTER_BTN_CLASS =
  "hero-slide-footer-btn flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] xl:h-10 xl:w-10";

function HeroSlideHexNavButton({
  onClick,
  ariaLabel,
  direction,
}: {
  onClick: () => void;
  ariaLabel: string;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hero-slide-hex-nav shrink-0"
      aria-label={ariaLabel}
    >
      {direction === "prev" ? (
        <ArrowLeft size={16} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
      )}
    </button>
  );
}

function HeroSliderProgress({
  currentIndex,
  progress,
  slides,
  goTo,
  className,
}: Pick<
  HeroSliderFooterProps,
  "currentIndex" | "progress" | "slides" | "goTo"
> & { className?: string }) {
  return (
    <div
      className={cn(
        "hero-slide-footer-progress flex min-w-0 flex-1 items-center gap-1.5 xl:gap-2",
        className,
      )}
      role="tablist"
      aria-label="Slayt seçimi"
    >
      {slides.map((s, idx) => (
        <button
          key={s.id}
          type="button"
          onClick={() => goTo(idx, idx > currentIndex ? 1 : -1)}
          role="tab"
          aria-selected={idx === currentIndex}
          aria-label={`${idx + 1}. slayta git`}
          className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-black/10 transition-all hover:bg-black/20"
        >
          {idx === currentIndex && (
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          )}
          {idx < currentIndex && (
            <span className="absolute inset-y-0 left-0 w-full rounded-full bg-black opacity-40" />
          )}
        </button>
      ))}
    </div>
  );
}

function HeroSliderFooter({
  currentIndex,
  count,
  progress,
  slides,
  goTo,
  prevSlide,
  nextSlide,
  className,
}: HeroSliderFooterProps) {
  return (
    <div
      className={cn(
        "hero-slide-footer flex items-center gap-2 xl:gap-4",
        className,
      )}
    >
      <div className="hero-slide-footer-controls flex shrink-0 gap-1 xl:gap-2">
        <button
          type="button"
          onClick={prevSlide}
          className={FOOTER_BTN_CLASS}
          aria-label="Önceki slayt"
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className={FOOTER_BTN_CLASS}
          aria-label="Sonraki slayt"
        >
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <span className="hero-slide-footer-counter ml-1 shrink-0 text-xs font-bold text-black/60 tabular-nums xl:ml-2 xl:text-sm">
        {String(currentIndex + 1).padStart(2, "0")}
        <span className="mx-0.5 opacity-50">/</span>
        {String(count).padStart(2, "0")}
      </span>

      <HeroSliderProgress
        className="ml-1 xl:ml-2"
        currentIndex={currentIndex}
        progress={progress}
        slides={slides}
        goTo={goTo}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
   HeroSlider — hero-section-grid'in 2. satırına oturan iki grid hücresi
   ─────────────────────────────────────────────────────────────────────────
   Fragment döndürür; hücreler doğrudan grid'in çocuğu olur:
     • Sol hücre  (col 2): bal köpüğü bilgi kartı — sola yaslı (KURUMSAL hizası)
     • Sağ hücre  (col 3): altıgen çerçeveli medya — sağa yaslı (OKULLARIMIZ hizası)
   Sol hücre .hero-slide-fill ile satır yüksekliğini doldurur.
   Sağ hücre .hero-slide-media-col: çerçeve dış sınırı hücre yüksekliğine
   oturacak şekilde boyutlanır (frame-height-ratio telafisi); scale yok.
   ------------------------------------------------------------------------- */

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const shouldReduceMotion = useReducedMotion();
  const isMobileHexInteractive = useMobileHexInteractive();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] =
    useState<HexLandingModalContent | null>(null);

  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const isFirstSlideRender = useRef(true);
  const isPausedRef = useRef(false);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    isPausedRef.current = false;
  }, []);

  const openSlideModal = useCallback(
    (targetSlide: HeroSlide) => {
      setModalContent(mapHeroSlideToModal(targetSlide, closeModal));
      setModalOpen(true);
      isPausedRef.current = true;
    },
    [closeModal],
  );

  useEffect(() => {
    isFirstSlideRender.current = false;
  }, []);

  /* rAF döngüsünde güncel değerlere erişim (stale closure önleme) */
  const isHoveredRef = useRef(isHovered);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const count = slides.length;

  const goTo = useCallback(
    (idx: number, dir: 1 | -1) => {
      setDirection(dir);
      setCurrentIndex(((idx % count) + count) % count);
      setProgress(0);
    },
    [count],
  );

  const nextSlide = useCallback(
    () => goTo(currentIndexRef.current + 1, 1),
    [goTo],
  );
  const prevSlide = useCallback(
    () => goTo(currentIndexRef.current - 1, -1),
    [goTo],
  );

  /* Otomatik geçiş — hover'da duraklayan rAF döngüsü */
  useEffect(() => {
    if (count <= 1) return;

    let startTime = Date.now();
    let rafId: number;
    let localProgress = 0;

    const tick = () => {
      const slideDur =
        (slides[currentIndexRef.current]?.displayDuration ?? 6) * 1000;

      if (
        !isHoveredRef.current &&
        !isPausedRef.current &&
        !document.hidden
      ) {
        const elapsed = Date.now() - startTime;
        if (elapsed >= slideDur) {
          setDirection(1);
          setCurrentIndex((prev) => (prev + 1) % count);
          setProgress(0);
          localProgress = 0;
          startTime = Date.now();
        } else {
          localProgress = (elapsed / slideDur) * 100;
          setProgress(localProgress);
        }
      } else {
        /* Hover/arka plan bitince kaldığı yerden devam etsin
           (sekme gizliyken sayaç ilerlemez → geri dönüşte ani atlama olmaz) */
        startTime = Date.now() - (localProgress / 100) * slideDur;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [count, slides]);

  /* Klavye ok tuşları */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (Math.abs(distance) < 50) return;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    e.stopPropagation();
  };

  const stopSwipePropagation = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const hexInteractionProps = isMobileHexInteractive
    ? {
        onTouchStart: stopSwipePropagation,
        onTouchMove: stopSwipePropagation,
        onTouchEnd: stopSwipePropagation,
      }
    : {};

  const interactionProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };

  const slide = slides[currentIndex];
  if (!slide) return null;

  const skipEnterAnimation = isFirstSlideRender.current;

  const textVariants = {
    initial: (d: number) => ({
      opacity: 0,
      y: d > 0 ? 40 : -40,
      filter: "blur(4px)",
    }),
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (d: number) => ({
      opacity: 0,
      y: d > 0 ? -40 : 40,
      filter: "blur(4px)",
    }),
  };

  const mediaVariants = {
    initial: (d: number) => ({
      opacity: 0,
      y: d > 0 ? 60 : -60,
      filter: "blur(8px)",
    }),
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (d: number) => ({
      opacity: 0,
      y: d > 0 ? -60 : 60,
      filter: "blur(8px)",
    }),
  };

  return (
    <div className="hero-mobile-slider-stack col-span-full w-full min-w-0 lg:contents">
      {/* ── Mobil/tablet: etiket başlığı — altıgenin üstünde, hex ile aynı genişlik ── */}
      <div
        className="hero-slide-tagline-slot lg:hidden"
        {...interactionProps}
      >
        <div className="hero-slide-tagline-band">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={slide.id}
              custom={direction}
              variants={textVariants}
              initial={skipEnterAnimation ? false : "initial"}
              animate="animate"
              exit="exit"
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                ease: "easeOut",
              }}
              className="hero-slide-tagline hero-slide-tagline--in-band"
            >
              {slide.tagline}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Altıgen medya — mobilde nav + hex; masaüstünde col-3 ── */}
      <div
        className="hero-slide-media-col relative z-[1] col-span-full h-full min-h-0 w-full min-w-0 overflow-visible lg:col-start-3 lg:col-end-4 lg:row-start-2"
        {...interactionProps}
      >
        <div className="hero-slide-media-band">
          <div className="hero-slide-media-stage">
            {count > 1 ? (
              <HeroSlideHexNavButton
                direction="prev"
                onClick={prevSlide}
                ariaLabel="Önceki slayt"
              />
            ) : null}

            <div
              className="hero-slide-media relative"
              {...hexInteractionProps}
            >
              <AnimatePresence
                mode="popLayout"
                custom={direction}
                initial={false}
              >
                <motion.div
                  key={slide.id}
                  custom={direction}
                  variants={mediaVariants}
                  initial={skipEnterAnimation ? false : "initial"}
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-0"
                >
                  <HeroFramedHexMediaContent
                    media={{
                      kind: slide.mediaType === "video" ? "video" : "image",
                      src: slide.mediaUrl,
                      alt: slide.titleLines.join(" "),
                      poster: slide.posterUrl,
                    }}
                    focalPoint={slide.focalPoint}
                    mediaScale={slide.mediaScale}
                    mediaAspect={slide.mediaAspect}
                    priority={slide.id === slides[0].id}
                    interactive
                    onActivate={() => openSlideModal(slide)}
                    activateLabel={`${slide.tagline} — detayları görüntüle`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {count > 1 ? (
              <HeroSlideHexNavButton
                direction="next"
                onClick={nextSlide}
                ariaLabel="Sonraki slayt"
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Bilgi kartı — col-2 masaüstü; mobilde hex ile aynı genişlik ── */}
      <HeroInfoCardShell
        className="col-span-full lg:col-start-2 lg:col-end-3 lg:row-start-2"
        {...interactionProps}
      >
        <HeroInfoCard
          titleAs="h1"
          footerVisibility="desktop-only"
          footer={
            <HeroSliderFooter
              className="border-t border-black/10 pt-3 xl:pt-4"
              currentIndex={currentIndex}
              count={count}
              progress={progress}
              slides={slides}
              goTo={goTo}
              prevSlide={prevSlide}
              nextSlide={nextSlide}
            />
          }
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={textVariants}
              initial={skipEnterAnimation ? false : "initial"}
              animate="animate"
              exit="exit"
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                ease: "easeOut",
              }}
              className="hero-slide-body min-h-0 w-full max-w-full min-w-0 flex-1"
            >
              {/* Üst zone: etiket + başlık + açıklama — taşarsa burası kırpılır, CTA değil */}
              <div className="hero-slide-head min-h-0 overflow-hidden">
                <span
                  className={`${HERO_SLIDE_TAGLINE_CLASS} hero-slide-tagline--hero mb-2 hidden lg:inline-flex xl:mb-2.5`}
                >
                  {slide.tagline}
                </span>

                <div className="hero-slide-copy">
                  <HeroSlideTitle
                    as="h1"
                    lines={slide.titleLines}
                    className="mb-1.5 lg:mb-2"
                    flow
                  />

                  <p
                    className={cn(
                      HERO_SLIDE_DESCRIPTION_CLASS,
                      "hero-slide-description--hero mb-0",
                    )}
                  >
                    {slide.description}
                  </p>
                </div>
              </div>

              {/* CTA her breakpoint’te görünür; grid auto satırı ile kırpılmaz */}
              <Link
                href={slide.buttonLink}
                className="hero-slide-cta group flex shrink-0 items-center justify-between gap-3 rounded-full bg-[#1a1c18] py-2 pr-1.5 pl-4 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] lg:gap-4 lg:py-2 lg:pl-5 xl:py-2.5 xl:pr-2 xl:pl-6"
              >
                <span className="hero-slide-cta-label text-[length:var(--text-sm)] font-bold tracking-wide text-white lg:text-[length:var(--text-base)]">
                  {slide.buttonText}
                </span>
                <span className="hero-slide-cta-icon flex shrink-0 items-center justify-center rounded-full bg-white/20 p-1.5 backdrop-blur-md transition-transform group-hover:translate-x-1 lg:p-2 xl:p-2">
                  <ArrowRight
                    size={20}
                    strokeWidth={2.5}
                    className="text-[#4cff00]"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </HeroInfoCard>
      </HeroInfoCardShell>

      <HexLandingModal
        open={modalOpen}
        onClose={closeModal}
        content={modalContent}
      />
    </div>
  );
}
