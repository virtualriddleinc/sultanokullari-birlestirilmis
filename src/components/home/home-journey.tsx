"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpenText,
  Compass,
  FlaskConical,
  Palette,
  Sparkles,
} from "lucide-react";
import { HexBadge } from "@/components/ui/hex-badge";
import { heroMedia } from "@/content/site-media";
import { HeroFramedHexMedia } from "@/features/hero/hero-framed-hex-media";
import { HeroFramedHexStack } from "@/features/hero/hero-framed-hex-stack";
import levhaDesktop from "@/images/levha.png";
import levhaMobil from "@/images/levha-mobil.png";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const JOURNEY_HEADLINE =
  "Peygamber Efendimiz (sas)'in İzinde Geleceğe Örnek Nesiller...";

function JourneyLevha({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <Image
        src={levhaMobil}
        alt={JOURNEY_HEADLINE}
        className="h-auto w-full lg:hidden"
        priority
        sizes="100vw"
      />
      <Image
        src={levhaDesktop}
        alt={JOURNEY_HEADLINE}
        className="hidden h-auto w-full lg:block"
        priority
        sizes="100vw"
      />
    </div>
  );
}

const chapters = [
  {
    eyebrow: "01 / Köken",
    title: "Nebevî eğitim",
    body: "Peygamberimizi tanıyan, seven ve hayatına rehber edinen; üsve-i hasene ile İslam ahlakı ile ahlaklanmış nesiller yetiştiriyoruz.",
    cta: { href: "/egitim/nebevi-egitim", label: "Nebevî eğitim" },
    icon: BookOpenText,
    media: heroMedia[0],
    accent: "from-amber-300/30 via-yellow-500/25 to-[var(--color-secondary)]",
    wash: "bg-[radial-gradient(circle_at_18%_24%,rgba(251,191,36,0.34),transparent_34rem)]",
  },
  {
    eyebrow: "02 / Kalp",
    title: "Hafızlık ve Otağ-ı Hümâyun",
    body: "Mescid-rahle usulüyle Kur’an ile bütünleşen; kalbe erişen ilmi irfana çeviren bir hafızlık programı.",
    cta: { href: "/egitim/hafizlik", label: "Hafızlık programı" },
    icon: Compass,
    media: heroMedia[2],
    accent: "from-amber-300/30 via-yellow-500/25 to-[var(--color-secondary)]",
    wash: "bg-[radial-gradient(circle_at_28%_78%,rgba(253,224,71,0.28),transparent_34rem)]",
  },
  {
    eyebrow: "03 / Bilim",
    title: "Keşf-i Bilim",
    body: "Okul öncesinden başlayan bilim eğitimini yaparak ve yaşayarak destekliyoruz; Cezeri, İbni Sina ve Ali Kuşçuyla geçmişe, bilimsel projelerle geleceğe yolculuk.",
    cta: { href: "/atolyeler-ve-kulupler", label: "Atölye ve kulüpler" },
    icon: FlaskConical,
    media: heroMedia[4],
    accent: "from-amber-300/30 via-yellow-500/25 to-[var(--color-secondary)]",
    wash: "bg-[radial-gradient(circle_at_34%_28%,rgba(251,191,36,0.30),transparent_34rem)]",
  },
  {
    eyebrow: "04 / Keşif",
    title: "Sanat ve Spor",
    body: "Her öğrencimizin ilgi ve yeteneklerini keşfetmesine zemin hazırlıyoruz: Hüsn-ü Hat, Ebru, okçuluk, binicilik ve yüzme ile köklü bir yetişme.",
    cta: { href: "/atolyeler-ve-kulupler", label: "Atölye ve kulüpler" },
    icon: Palette,
    media: heroMedia[3],
    accent: "from-amber-300/30 via-yellow-500/25 to-[var(--color-secondary)]",
    wash: "bg-[radial-gradient(circle_at_74%_74%,rgba(251,191,36,0.28),transparent_34rem)]",
  },
  {
    eyebrow: "05 / İklim",
    title: "Ayakkabısız okul",
    body: "Temiz, huzurlu ve ailesinde gibi hisseden öğrenciler için tasarlanmış sıcak ve güvenli butik okul iklimi.",
    cta: { href: "/kurumsal/neden-sultan", label: "Neden Sultan?" },
    icon: Sparkles,
    media: heroMedia[1],
    accent: "from-amber-300/30 via-yellow-500/25 to-[var(--color-secondary)]",
    wash: "bg-[radial-gradient(circle_at_78%_22%,rgba(253,224,71,0.30),transparent_34rem)]",
  },
] as const;

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export function HomeJourney() {
  const rootRef = useRef<HTMLDivElement>(null);

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
      className="relative bg-white text-amber-950"
    >
      <div className="section-page-grid pt-fluid-8 sm:pt-fluid-16">
        <div className="section-page-grid__full">
          <JourneyLevha className="mt-3" />
        </div>
      </div>

      <div
        data-journey-stage
        className="relative mt-12 hidden h-[100svh] w-full overflow-hidden bg-[linear-gradient(135deg,rgba(252,211,77,0.30),rgba(234,179,8,0.25),var(--color-secondary))] lg:block"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_74%,rgba(251,191,36,0.28),transparent_34rem)]" />
        <div className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply" />
        {chapters.map((chapter, i) => {
          return (
            <article
              key={chapter.title}
              data-journey-panel
              className="absolute inset-0"
              style={{ zIndex: chapters.length - i }}
              aria-hidden={i !== 0 ? "true" : undefined}
            >
              <div className="hero-section-grid journey-stage-grid h-full w-full items-center">
                <div className="col-span-full flex h-full flex-col justify-center gap-6 md:col-start-2 md:col-end-3 md:row-start-1">
                  <p className="text-xs font-semibold tracking-[0.32em] text-amber-700 uppercase">
                    {chapter.eyebrow}
                  </p>
                  <h3 className="text-5xl leading-[1.05] font-semibold tracking-tight">
                    {chapter.title}
                  </h3>
                  <p className="max-w-md text-base leading-7 text-amber-950/78">
                    {chapter.body}
                  </p>
                  <Link
                    href={chapter.cta.href}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-900/20 bg-white/45 px-5 py-2.5 text-sm font-semibold text-amber-800 backdrop-blur transition hover:bg-white/70"
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

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-12 pb-16 sm:px-6 lg:hidden lg:pb-24">
        {chapters.map((chapter) => {
          const Icon = chapter.icon;
          return (
            <article
              key={chapter.title}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-6",
                chapter.accent,
              )}
            >
              <div className="journey-hex-compact absolute top-4 right-4 w-20 sm:w-28">
                <HeroFramedHexMedia
                  media={chapter.media}
                  sizes="(max-width: 640px) 5rem, 7rem"
                />
              </div>
              <span
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-70",
                  chapter.wash,
                )}
              />
              <div className="relative flex items-start gap-5 pr-16 sm:gap-6 sm:pr-24">
                <HexBadge
                  size="lg"
                  className="w-28 shrink-0 bg-white/15 text-white sm:w-32"
                >
                  <Icon className="size-10 sm:size-12" aria-hidden />
                </HexBadge>
                <div>
                  <p className="text-xs font-semibold tracking-[0.28em] text-amber-100 uppercase">
                    {chapter.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                    {chapter.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {chapter.body}
                  </p>
                  <Link
                    href={chapter.cta.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
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
    </section>
  );
}
