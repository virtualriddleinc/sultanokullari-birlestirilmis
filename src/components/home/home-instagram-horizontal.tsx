"use client";

import Link from "@/components/navigation/site-link";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { InstagramEmbed } from "@/components/instagram/instagram-embed";
import { InstagramGlyph } from "@/components/icons/instagram-glyph";
import { InteractiveSiteVideo } from "@/components/media/interactive-site-video";
import {
  instagramHandle,
  instagramPosts,
  instagramProfileUrl,
} from "@/content/instagram";
import type { InstagramPost } from "@/content/instagram";
import { modalPanelVariants, t } from "@/lib/animations";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** px/s — masaüstü otomatik yatay kaydırma hızı */
const DESKTOP_AUTO_SCROLL_SPEED = 48;

export type HomeInstagramHorizontalProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  handle?: string;
  profileUrl?: string;
  posts?: InstagramPost[];
};

export function HomeInstagramHorizontal({
  eyebrow = "Sosyal medya vitrini",
  title = "Sosyal Medyada Biz",
  description,
  handle = instagramHandle,
  profileUrl = instagramProfileUrl,
  posts = instagramPosts,
}: HomeInstagramHorizontalProps = {}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const autoScrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollPausedRef = useRef(false);
  const hoveredIndexRef = useRef<number | null>(null);
  const modalPostIndexRef = useRef<number | null>(null);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalPostIndex, setModalPostIndex] = useState<number | null>(null);

  const pauseAutoScroll = useCallback(() => {
    scrollPausedRef.current = true;
    autoScrollTweenRef.current?.pause();
  }, []);

  const resumeAutoScroll = useCallback(() => {
    scrollPausedRef.current = false;
    if (
      hoveredIndexRef.current !== null ||
      modalPostIndexRef.current !== null
    ) {
      return;
    }
    autoScrollTweenRef.current?.play();
  }, []);

  const handleReelHoverStart = useCallback(
    (index: number) => {
      hoveredIndexRef.current = index;
      setHoveredIndex(index);
      pauseAutoScroll();
    },
    [pauseAutoScroll],
  );

  const handleReelHoverEnd = useCallback(() => {
    hoveredIndexRef.current = null;
    setHoveredIndex(null);
    resumeAutoScroll();
  }, [resumeAutoScroll]);

  const handleReelOpen = useCallback(
    (index: number) => {
      modalPostIndexRef.current = index;
      setModalPostIndex(index);
      pauseAutoScroll();
    },
    [pauseAutoScroll],
  );

  const handleReelModalClose = useCallback(() => {
    modalPostIndexRef.current = null;
    setModalPostIndex(null);
    resumeAutoScroll();
  }, [resumeAutoScroll]);

  const handleReelClick = useCallback(
    (index: number, event: MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest(".site-vidstack-controls")) return;
      handleReelOpen(index);
    },
    [handleReelOpen],
  );

  const shouldPlayReel = useCallback(
    (index: number) => {
      if (!isSectionInView || modalPostIndex !== null) return false;
      if (hoveredIndex === index) return true;
      if (hoveredIndex !== null) return false;
      return activeVideoIndex === index;
    },
    [activeVideoIndex, hoveredIndex, isSectionInView, modalPostIndex],
  );

  const modalPost =
    modalPostIndex !== null ? posts[modalPostIndex] ?? null : null;

  useEffect(() => {
    const section = rootRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsInView = entry.isIntersecting;
        setIsSectionInView(nextIsInView);

        if (nextIsInView) {
          setActiveVideoIndex(0);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = rootRef.current;
      const strip = stripRef.current;
      if (!section || !strip) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          let scrollLength = 0;
          let tween: gsap.core.Tween | null = null;
          let visibilityTrigger: ScrollTrigger | null = null;

          const rebuildAutoScroll = () => {
            scrollLength = Math.max(strip.scrollWidth - window.innerWidth, 0);

            tween?.kill();
            visibilityTrigger?.kill();
            gsap.set(strip, { x: 0 });

            if (scrollLength <= 0) return;

            tween = gsap.to(strip, {
              x: -scrollLength,
              duration: scrollLength / DESKTOP_AUTO_SCROLL_SPEED,
              ease: "none",
              repeat: -1,
            });
            autoScrollTweenRef.current = tween;

            visibilityTrigger = ScrollTrigger.create({
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              onEnter: () => {
                if (!scrollPausedRef.current) tween?.play();
              },
              onEnterBack: () => {
                if (!scrollPausedRef.current) tween?.play();
              },
              onLeave: () => tween?.pause(),
              onLeaveBack: () => tween?.pause(),
            });

            tween.pause();
            if (visibilityTrigger.isActive && !scrollPausedRef.current) {
              tween.play();
            }
          };

          rebuildAutoScroll();

          const resizeObserver = new ResizeObserver(() => {
            rebuildAutoScroll();
          });
          resizeObserver.observe(strip);

          // Instagram embed'leri asenkron büyüdüğü için layout settle olduktan
          // sonra kaydırma mesafesini yeniden hesapla.
          const settleTimer = window.setTimeout(rebuildAutoScroll, 600);
          const onLoad = () => rebuildAutoScroll();
          window.addEventListener("load", onLoad);

          return () => {
            resizeObserver.disconnect();
            window.removeEventListener("load", onLoad);
            window.clearTimeout(settleTimer);
            visibilityTrigger?.kill();
            tween?.kill();
            autoScrollTweenRef.current = null;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="instagram"
      data-section="instagram"
      aria-label="Sultan Okulları Instagram galerisi"
      className="border-charcoal/10 relative z-[1] overflow-hidden border-y bg-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.045] mix-blend-multiply" />
      <div className="bg-brand-green/10 pointer-events-none absolute top-12 -left-24 size-72 rounded-full blur-3xl" />
      <div className="bg-brand-honey/35 pointer-events-none absolute -right-24 bottom-12 size-72 rounded-full blur-3xl" />

      <div className="section-page-grid pt-fluid-8 pb-0 sm:pt-fluid-16">
        <div className="section-page-grid__content">
          <div className="flex flex-wrap items-end justify-between gap-fluid-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">{eyebrow}</p>
              <h2 className="section-title mt-fluid-3">{title}</h2>
              {description ? (
                <p className="section-body mt-fluid-3 max-w-xl">{description}</p>
              ) : null}
            </div>
            <Link
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram'da ${handle}`}
              className="group border-charcoal/10 text-charcoal hover:border-brand-green/30 inline-flex min-h-[44px] items-center gap-fluid-2 rounded-full border bg-white px-4 py-2 text-[length:var(--text-sm)] font-semibold shadow-sm transition hover:shadow-md"
            >
              <InstagramGlyph className="size-5 transition-transform group-hover:scale-110" />
              <span>{handle}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="horiz-gallery-wrapper relative mt-fluid-4 w-full overflow-x-clip overflow-y-hidden">
        <div
          ref={stripRef}
          className={cn(
            "horiz-gallery-strip flex flex-nowrap will-change-transform",
            // Mobile / reduced-motion fallback: native horizontal scroll-snap.
            "snap-x snap-mandatory overflow-x-auto scroll-smooth pb-fluid-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "px-[var(--mobile-chrome-gutter)] md:px-[calc(var(--layout-margin)+clamp(1rem,2.5vw,2.5rem))]",
            // Desktop with motion: GSAP auto-scroll; disable native overflow.
            "lg:motion-safe:overflow-visible",
          )}
        >
          {posts.map((post, index) => (
            <article
              key={post.id}
              tabIndex={0}
              role="button"
              aria-label={`${post.title} — büyüt`}
              onMouseEnter={() => handleReelHoverStart(index)}
              onMouseLeave={handleReelHoverEnd}
              onFocus={() => handleReelHoverStart(index)}
              onBlur={handleReelHoverEnd}
              onClick={(event) => handleReelClick(index, event)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleReelOpen(index);
                }
              }}
              className="project-wrap relative box-border flex w-[min(82vw,18rem)] shrink-0 cursor-pointer snap-start px-fluid-2 transition-transform duration-300 hover:z-10 hover:scale-[1.02] md:w-[22rem] lg:w-[23rem] lg:px-fluid-3"
            >
              <InstagramEmbed
                post={post}
                shouldPlay={shouldPlayReel(index)}
                onEnded={() =>
                  setActiveVideoIndex((current) => (current + 1) % posts.length)
                }
              />
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalPost?.videoSrc ? (
          <motion.div
            key="instagram-reel-lightbox"
            className="fixed inset-0 z-[100] flex items-center justify-center p-fluid-2 md:p-fluid-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t(0.35)}
          >
            <motion.button
              type="button"
              aria-label="Kapat"
              className="absolute inset-0 bg-emerald-950/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: reduce ? 0.7 : 0.7 }}
              exit={{ opacity: 0 }}
              transition={t(0.4)}
              onClick={handleReelModalClose}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label={modalPost.title}
              className="relative z-[101] w-[min(96vw,calc(94vh*9/16))] overflow-hidden rounded-[1.35rem] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalPanelVariants}
              transition={reduce ? { duration: 0 } : undefined}
            >
              <button
                type="button"
                aria-label="Kapat"
                onClick={handleReelModalClose}
                className="absolute top-3 right-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
              >
                <X className="size-4" aria-hidden />
              </button>
              <div className="relative aspect-[9/16] w-full bg-black">
                <InteractiveSiteVideo
                  className="block h-full w-full"
                  src={modalPost.videoSrc}
                  title={modalPost.title}
                  shouldPlay={modalPostIndex !== null}
                  muted={false}
                  loop
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
