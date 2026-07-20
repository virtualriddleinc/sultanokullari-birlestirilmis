"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HexLandingModal } from "@/components/ui/hex-landing-modal";
import { HeroFramedHexMedia } from "@/features/hero/hero-framed-hex-media";
import { HeroFramedHexStack } from "@/features/hero/hero-framed-hex-stack";
import {
  mapJourneyChapterToModal,
  type HexLandingModalContent,
} from "@/lib/hex-landing-modal";
import beyazDesen from "@/images/beyaz-desen.svg";
import levhaDesktop from "@/images/levha.png";
import levhaMobil from "@/images/levha-mobil.png";
import { cn } from "@/lib/cn";
import type { JourneyChapter } from "@/lib/home-shared";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DEFAULT_HEADLINE =
  "Peygamber Efendimiz'in (s.a.s) İzinde Geleceğe Örnek Nesiller...";

const CHAPTER_STYLES = [
  {
    wash: "bg-[radial-gradient(circle_at_18%_24%,rgba(0,0,0,0.04),transparent_34rem)]",
  },
  {
    wash: "bg-[radial-gradient(circle_at_28%_78%,rgba(0,0,0,0.04),transparent_34rem)]",
  },
  {
    wash: "bg-[radial-gradient(circle_at_34%_28%,rgba(0,0,0,0.04),transparent_34rem)]",
  },
  {
    wash: "bg-[radial-gradient(circle_at_74%_74%,rgba(0,0,0,0.04),transparent_34rem)]",
  },
  {
    wash: "bg-[radial-gradient(circle_at_78%_22%,rgba(0,0,0,0.04),transparent_34rem)]",
  },
  {
    wash: "bg-[radial-gradient(circle_at_52%_48%,rgba(0,0,0,0.04),transparent_34rem)]",
  },
] as const;

function JourneyLevha({ headline }: { headline: string }) {
  return (
    <div className="levha-visual relative flex w-full items-center justify-center">
      <Image
        src={levhaMobil}
        alt={headline}
        className="mx-auto block h-auto w-full md:hidden"
        sizes="100vw"
        loading="lazy"
        unoptimized
      />
      <Image
        src={levhaDesktop}
        alt={headline}
        className="mx-auto hidden h-auto w-full md:block"
        sizes="100vw"
        loading="lazy"
        unoptimized
      />
    </div>
  );
}

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export function HomeJourney({
  headline = DEFAULT_HEADLINE,
  chapters,
}: {
  headline?: string;
  chapters: JourneyChapter[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] =
    useState<HexLandingModalContent | null>(null);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const openChapterModal = useCallback(
    (chapter: JourneyChapter) => {
      setModalContent(mapJourneyChapterToModal(chapter, closeModal));
      setModalOpen(true);
    },
    [closeModal],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (!ctx.conditions?.isDesktop) return undefined;

          const panels = gsap.utils.toArray<HTMLElement>(
            "[data-journey-panel]",
            root,
          );
          const stage = root.querySelector<HTMLElement>("[data-journey-stage]");
          if (!stage || panels.length === 0) return undefined;

          let activeIndex = 0;

          panels.forEach((panel, i) => {
            gsap.set(panel, {
              autoAlpha: i === 0 ? 1 : 0,
              filter: i === 0 ? "blur(0px)" : "blur(8px)",
              y: i === 0 ? 0 : 36,
              zIndex: i === 0 ? 2 : 1,
            });
          });

          const showPanel = (nextIndex: number) => {
            if (nextIndex === activeIndex) return;

            const previousIndex = activeIndex;
            const previous = panels[activeIndex];
            const next = panels[nextIndex];
            activeIndex = nextIndex;

            gsap.killTweensOf([previous, next]);
            gsap
              .timeline()
              .set(next, {
                autoAlpha: 0,
                filter: "blur(7px)",
                y: 28,
                zIndex: 3,
              })
              .to(
                previous,
                {
                  autoAlpha: 0,
                  filter: "blur(7px)",
                  y: nextIndex > previousIndex ? -24 : 24,
                  duration: 0.24,
                  ease: "power2.out",
                },
                0,
              )
              .to(
                next,
                {
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  y: 0,
                  duration: 0.48,
                  ease: "power3.out",
                },
                0.08,
              )
              .set(previous, { zIndex: 1 });
          };

          const trigger = ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: () => `+=${stage.offsetHeight * (panels.length - 1)}`,
            pin: true,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (panels.length - 1),
              directional: true,
              duration: { min: 0.22, max: 0.45 },
              delay: 0.03,
              ease: "power3.out",
            },
            onUpdate: (self) => {
              const nextIndex = Math.round(self.progress * (panels.length - 1));
              showPanel(Math.max(0, Math.min(panels.length - 1, nextIndex)));
            },
          });

          ScrollTrigger.refresh();
          return () => trigger.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="yolculuk"
      data-section="yolculuk"
      className="relative text-black"
    >
      <div
        data-levha-band
        className="relative z-[2] -mt-px w-full bg-[#4cff00]"
      >
        <div className="levha-band-shell relative flex w-full items-center justify-center overflow-hidden py-fluid-8 sm:py-fluid-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beyazDesen.src}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
          />
          <div className="relative z-[1] flex w-full items-center justify-center">
            <JourneyLevha headline={headline} />
          </div>
        </div>
      </div>

      <div
        data-journey-stage
        className="bg-brand-honey relative hidden h-[100svh] w-full overflow-hidden lg:block"
      >
        <div className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply" />
        {chapters.map((chapter, i) => {
          const style = CHAPTER_STYLES[i] ?? CHAPTER_STYLES[0];
          return (
            <article
              key={chapter.title}
              data-journey-panel
              className="absolute inset-0"
              style={{ zIndex: chapters.length - i }}
              aria-hidden={i !== 0 ? "true" : undefined}
            >
              <div className="hero-section-grid journey-stage-grid h-full w-full items-center">
                <div className="col-span-full flex h-full flex-col justify-center gap-fluid-6 md:col-start-2 md:col-end-3 md:row-start-1">
                  <p className="section-eyebrow text-black/70">
                    {chapter.eyebrow}
                  </p>
                  <h3 className="section-title text-[length:var(--text-4xl)] text-black">
                    {chapter.title}
                  </h3>
                  <p className="max-w-md text-[length:var(--text-base)] leading-relaxed text-black/75">
                    {chapter.body}
                  </p>
                  <Link
                    href={chapter.cta.href}
                    className="inline-flex min-h-[44px] w-fit items-center gap-fluid-2 rounded-full border border-black/15 bg-white/45 px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-black backdrop-blur transition hover:bg-white/70"
                  >
                    {chapter.cta.label}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
                <div className="col-span-full relative md:col-start-3 md:col-end-4 md:row-start-1">
                  <HeroFramedHexStack>
                    <HeroFramedHexMedia
                      media={chapter.media}
                      priority={i === 0}
                      sizes="(max-width: 1024px) 60vw, 35vw"
                      focalPoint={chapter.focalPoint}
                      mediaScale={chapter.mediaScale}
                      mediaAspect={chapter.mediaAspect}
                      interactive
                      onActivate={() => openChapterModal(chapter)}
                      activateLabel={`${chapter.eyebrow} — detayları görüntüle`}
                    />
                  </HeroFramedHexStack>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-16 right-2 inline-block w-24 bg-yellow-300/45 xl:w-28"
                    style={{
                      aspectRatio: "2 / 1.7320508075688772",
                      clipPath: HEX_CLIP,
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-20 left-0 inline-block w-32 bg-orange-400/18 xl:w-36"
                    style={{
                      aspectRatio: "2 / 1.7320508075688772",
                      clipPath: HEX_CLIP,
                    }}
                  />
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {chapters.map((c, idx) => (
                  <span
                    key={c.title}
                    aria-hidden
                    className={cn(
                      "h-1 rounded-full transition-all",
                      idx === i ? "w-12 bg-white" : "w-6 bg-white/30",
                    )}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="section-page-grid bg-white pt-fluid-8 pb-fluid-12 lg:hidden">
        <div className="section-page-grid__content grid gap-fluid-4">
          {chapters.map((chapter) => {
            const style =
              CHAPTER_STYLES[
                chapters.indexOf(chapter) % CHAPTER_STYLES.length
              ] ?? CHAPTER_STYLES[0];
            return (
              <article
                key={chapter.title}
                className="relative overflow-hidden rounded-3xl border border-black/10 bg-brand-honey p-fluid-4"
              >
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-70",
                    style.wash,
                  )}
                />
                <div className="relative flex items-center gap-fluid-4">
                  <div className="journey-hex-lead shrink-0">
                    <HeroFramedHexMedia
                      media={chapter.media}
                      sizes="(max-width: 768px) 38vw, 12rem"
                      focalPoint={chapter.focalPoint}
                      mediaScale={chapter.mediaScale}
                      mediaAspect={chapter.mediaAspect}
                      interactive
                      onActivate={() => openChapterModal(chapter)}
                      activateLabel={`${chapter.eyebrow} — detayları görüntüle`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="section-eyebrow text-black/70">
                      {chapter.eyebrow}
                    </p>
                    <h3 className="section-title mt-fluid-2 text-[length:var(--text-xl)] text-black">
                      {chapter.title}
                    </h3>
                    <p className="mt-fluid-2 text-[length:var(--text-base)] leading-relaxed text-black/75">
                      {chapter.body}
                    </p>
                    <Link
                      href={chapter.cta.href}
                      className="mt-fluid-4 inline-flex min-h-[44px] items-center gap-fluid-2 text-[length:var(--text-sm)] font-semibold text-black underline-offset-4 hover:underline"
                    >
                      {chapter.cta.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
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
