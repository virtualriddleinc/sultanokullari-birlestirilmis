"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HeroFramedHexMediaContent } from "./hero-framed-hex-media";
import { HeroInfoCard, HeroInfoCardShell } from "./hero-info-card";
import type { HeroSlide } from "./slides";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

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

      if (!isHoveredRef.current && !document.hidden) {
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
  const onTouchEnd = () => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
  };

  const interactionProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };

  const slide = slides[currentIndex];
  if (!slide) return null;

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
    <>
      {/* ── Sol hücre: bilgi kartı — col-2, sütun yüksekliğini tam doldurur ── */}
      <HeroInfoCardShell
        className="col-span-full md:col-start-2 md:col-end-3 md:row-start-2"
        style={{ order: 2 }}
        {...interactionProps}
      >
        <HeroInfoCard
          titleAs="h1"
          footer={
            <div className="flex items-center gap-2 border-t border-black/10 pt-3 xl:gap-4 xl:pt-4">
              <div className="flex shrink-0 gap-1 xl:gap-2">
                <button
                  onClick={prevSlide}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] xl:h-10 xl:w-10"
                  aria-label="Önceki slayt"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button
                  onClick={nextSlide}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] xl:h-10 xl:w-10"
                  aria-label="Sonraki slayt"
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>

              <span className="ml-1 shrink-0 text-xs font-bold text-black/60 tabular-nums xl:ml-2 xl:text-sm">
                {String(currentIndex + 1).padStart(2, "0")}
                <span className="mx-0.5 opacity-50">/</span>
                {String(count).padStart(2, "0")}
              </span>

              <div
                className="ml-1 flex flex-1 items-center gap-1.5 xl:ml-2 xl:gap-2"
                role="tablist"
                aria-label="Slayt seçimi"
              >
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
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
            </div>
          }
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                ease: "easeOut",
              }}
              className="flex min-h-0 w-full max-w-full min-w-0 flex-col items-stretch"
            >
              <span className="hero-slide-tagline mb-3 shrink-0 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.62rem] font-bold tracking-widest text-[#1a1c18] uppercase shadow-sm xl:mb-4 xl:px-4 xl:py-2 xl:text-xs">
                {slide.tagline}
              </span>

              <div className="hero-slide-copy">
                <h1 className="font-cinzel mb-3 w-full min-w-0 shrink-0 text-[clamp(1.3rem,2.2vw,2.5rem)] leading-[1.15] font-bold tracking-tight text-balance text-[#1a1c18]">
                  {slide.titleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                <p className="mb-4 w-full min-w-0 shrink-0 text-[length:var(--text-sm)] leading-relaxed font-medium text-pretty text-[#1a1c18]/80 xl:mb-6">
                  {slide.description}
                </p>
              </div>

              <Link
                href={slide.buttonLink}
                className="hero-slide-cta group flex shrink-0 items-center justify-between gap-4 rounded-full bg-[#1a1c18] py-1.5 pr-1.5 pl-4 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] xl:py-2 xl:pr-2 xl:pl-6"
              >
                <span className="hero-slide-cta-label text-[length:var(--text-sm)] font-bold tracking-wide text-white">
                  {slide.buttonText}
                </span>
                <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5 backdrop-blur-md transition-transform group-hover:translate-x-1 xl:p-2">
                  <ArrowRight
                    size={18}
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

      {/* ── Sağ hücre: altıgen medya — satır yüksekliği doldurur, 43:24 ── */}
      <div
        className="hero-slide-media-col relative z-[1] col-span-full h-full min-h-0 w-full min-w-0 overflow-visible md:col-start-3 md:col-end-4 md:row-start-2"
        style={{ order: 1 }}
        {...interactionProps}
      >
        <div className="hero-slide-media-band">
          <div className="hero-slide-media relative">
            <AnimatePresence
              mode="popLayout"
              custom={direction}
              initial={false}
            >
              <motion.div
                key={slide.id}
                custom={direction}
                variants={mediaVariants}
                initial="initial"
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
                  priority={slide.id === slides[0].id}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
