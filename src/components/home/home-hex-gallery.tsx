"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import { hexGalleryMedia, type SiteMedia } from "@/content/site-media";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable);

const HEX_CLIP =
  "polygon(25% 0px, 75% 0px, 100% 50%, 75% 100%, 25% 100%, 0px 50%)";
const HEX_ASPECT = "2 / 1.7320508075688772";

type HexCard = {
  label: string;
  background: string;
  accent: string;
  media: SiteMedia;
};

const cards: HexCard[] = [
  {
    label: "Kampüs sahnesi 01",
    background:
      "linear-gradient(135deg,#0d6b2a 0%,#128a36 55%,var(--color-secondary) 100%)",
    accent: "rgba(255,244,214,0.18)",
    media: hexGalleryMedia[0],
  },
  {
    label: "Atölye atmosferi",
    background: "linear-gradient(160deg,#142e1d 0%,#1f6839 65%,#2c8f4f 100%)",
    accent: "rgba(226,162,26,0.18)",
    media: hexGalleryMedia[1],
  },
  {
    label: "Hâfızlık halkası",
    background: "linear-gradient(135deg,#0a3d1a 0%,#0d6b2a 60%,#e2a21a 100%)",
    accent: "rgba(255,255,255,0.18)",
    media: hexGalleryMedia[2],
  },
  {
    label: "Bahçe oyun anı",
    background: "linear-gradient(140deg,#e2a21a 0%,#b9780d 60%,#724508 100%)",
    accent: "rgba(255,244,214,0.22)",
    media: hexGalleryMedia[3],
  },
  {
    label: "Sınıf etkinliği",
    background: "linear-gradient(155deg,#0d6b2a 0%,#1c8745 50%,#f1c878 100%)",
    accent: "rgba(255,255,255,0.16)",
    media: hexGalleryMedia[4],
  },
  {
    label: "Yıllık tören",
    background: "linear-gradient(135deg,#142e1d 0%,#0d6b2a 55%,#128a36 100%)",
    accent: "rgba(226,162,26,0.20)",
    media: hexGalleryMedia[5],
  },
  {
    label: "Spor zamanı",
    background: "linear-gradient(135deg,#13442a 0%,#1f8b4a 50%,#fef0c0 100%)",
    accent: "rgba(36,20,5,0.22)",
    media: hexGalleryMedia[6],
  },
  {
    label: "Kütüphane sessizliği",
    background: "linear-gradient(155deg,#0a3d1a 0%,#15663a 60%,#e2a21a 100%)",
    accent: "rgba(255,255,255,0.18)",
    media: hexGalleryMedia[7],
  },
  {
    label: "Mezuniyet karesi",
    background: "linear-gradient(135deg,#0d6b2a 0%,#0d6b2a 35%,#b9780d 100%)",
    accent: "rgba(255,244,214,0.24)",
    media: hexGalleryMedia[8],
  },
  {
    label: "Doğa gezisi",
    background: "linear-gradient(160deg,#1c8745 0%,#0d6b2a 60%,#142e1d 100%)",
    accent: "rgba(226,162,26,0.18)",
    media: hexGalleryMedia[9],
  },
  {
    label: "Sanat atölyesi",
    background: "linear-gradient(135deg,#e2a21a 0%,#128a36 100%)",
    accent: "rgba(36,20,5,0.20)",
    media: hexGalleryMedia[10],
  },
  {
    label: "Bilim laboratuvarı",
    background: "linear-gradient(135deg,#0d6b2a 0%,#142e1d 60%,#0d6b2a 100%)",
    accent: "rgba(255,255,255,0.18)",
    media: hexGalleryMedia[11],
  },
];

function buildSeamlessLoop(
  items: HTMLElement[],
  spacing: number,
  animateFunc: (el: HTMLElement) => gsap.core.Timeline,
) {
  const overlap = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime = (items.length + overlap) * spacing + 1;
  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      // GSAP 3.6.1 öncesi nadir bir kenar durum için demo'daki düzeltme.
      const self = this as unknown as {
        _time: number;
        _dur: number;
        _tTime: number;
      };
      if (self._time === self._dur) {
        self._tTime += self._dur - 0.01;
      }
    },
  });

  const total = items.length + overlap * 2;

  for (let i = 0; i < total; i++) {
    const index = i % items.length;
    const time = i * spacing;
    rawSequence.add(animateFunc(items[index]), time);
    if (i <= items.length) {
      seamlessLoop.add("label" + i, time);
    }
  }

  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none",
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: "none",
      },
    );
  return seamlessLoop;
}

export function HomeHexGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const gallery = galleryRef.current;
      const cardsEl = cardsRef.current;
      const prevBtn = prevRef.current;
      const nextBtn = nextRef.current;
      const proxy = proxyRef.current;

      if (!root || !gallery || !cardsEl || !prevBtn || !nextBtn || !proxy) {
        return undefined;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cardsEl.children, {
          clearProps: "all",
          opacity: 1,
          scale: 1,
          xPercent: 0,
        });
        return undefined;
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cardEls = gsap.utils.toArray<HTMLElement>(cardsEl.children);
        if (cardEls.length === 0) return undefined;

        let iteration = 0;
        const spacing = 0.1;
        const snapTime = gsap.utils.snap(spacing);

        gsap.set(cardEls, { xPercent: 400, opacity: 0, scale: 0 });

        const animateFunc = (element: HTMLElement) => {
          const tl = gsap.timeline();
          tl.fromTo(
            element,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              zIndex: 100,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: "power1.in",
              immediateRender: false,
            },
          ).fromTo(
            element,
            { xPercent: 400 },
            {
              xPercent: -400,
              duration: 1,
              ease: "none",
              immediateRender: false,
            },
            0,
          );
          return tl;
        };

        const seamlessLoop = buildSeamlessLoop(cardEls, spacing, animateFunc);

        const playhead = { offset: 0 };
        const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

        const scrub = gsap.to(playhead, {
          offset: 0,
          onUpdate() {
            seamlessLoop.time(wrapTime(playhead.offset));
          },
          duration: 0.5,
          ease: "power3",
          paused: true,
        });

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "+=3000",
          pin: gallery,
          onUpdate(self) {
            const scroll = self.scroll();
            if (scroll > self.end - 1) {
              wrap(1, self.start + 2);
            } else if (scroll < self.start + 1 && self.direction < 0) {
              wrap(-1, self.end - 2);
            } else {
              scrub.vars.offset =
                (iteration + self.progress) * seamlessLoop.duration();
              scrub.invalidate().restart();
            }
          },
        });

        const progressToScroll = (progress: number) => {
          const scrollLength = trigger.end - trigger.start;
          return (
            trigger.start +
            gsap.utils.clamp(
              1,
              scrollLength - 1,
              gsap.utils.wrap(0, 1, progress) * scrollLength,
            )
          );
        };

        function wrap(iterationDelta: number, scrollTo: number) {
          iteration += iterationDelta;
          trigger.scroll(scrollTo);
          trigger.update();
        }

        function scrollToOffset(offset: number) {
          const snappedTime = snapTime(offset);
          const progress =
            (snappedTime - seamlessLoop.duration() * iteration) /
            seamlessLoop.duration();
          const scroll = progressToScroll(progress);
          if (progress >= 1 || progress < 0) {
            wrap(Math.floor(progress), scroll);
            return;
          }
          trigger.scroll(scroll);
        }

        const onScrollEnd = () => {
          if (!trigger.isActive) return;
          scrollToOffset(scrub.vars.offset as number);
        };
        ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

        const onNext = () =>
          scrollToOffset((scrub.vars.offset as number) + spacing);
        const onPrev = () =>
          scrollToOffset((scrub.vars.offset as number) - spacing);
        nextBtn.addEventListener("click", onNext);
        prevBtn.addEventListener("click", onPrev);

        const draggables = Draggable.create(proxy, {
          type: "x",
          trigger: cardsEl,
          onPress(this: Draggable) {
            (this as unknown as { startOffset: number }).startOffset = scrub
              .vars.offset as number;
          },
          onDrag(this: Draggable) {
            const start = (this as unknown as { startOffset: number })
              .startOffset;
            scrub.vars.offset = start + (this.startX - this.x) * 0.001;
            scrub.invalidate().restart();
          },
          onDragEnd() {
            scrollToOffset(scrub.vars.offset as number);
          },
        });

        return () => {
          ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
          nextBtn.removeEventListener("click", onNext);
          prevBtn.removeEventListener("click", onPrev);
          draggables.forEach((d) => d.kill());
          trigger.kill();
          scrub.kill();
          seamlessLoop.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="hex-galeri"
      data-section="hex-galeri"
      className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,#0d2516_0%,#050b07_55%,#000_100%)] text-white"
    >
      <div
        ref={galleryRef}
        className="relative h-[100svh] w-full overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.06] mix-blend-screen" />

        <div className="section-page-grid pointer-events-none absolute inset-x-0 top-0 z-10 pt-fluid-8 text-center sm:pt-fluid-12">
          <div className="section-page-grid__content">
            <p className="section-eyebrow text-emerald-300/80">
              Sultan vitrini
            </p>
            <h2 className="section-title mt-fluid-3 text-white">
              Hayatından kareler — kaydır, sürükle, bırak.
            </h2>
            <p className="section-body mx-auto mt-fluid-4 max-w-xl text-white/75">
              Sınıf, atölye ve bahçe anlarımız altıgen sahneler arasında akıyor;
              istediğin yöne sürükle ya da ok tuşlarıyla gez.
            </p>
          </div>
        </div>

        <ul
          ref={cardsRef}
          className="absolute top-1/2 left-1/2 m-0 list-none p-0"
          style={{
            width: "16rem",
            aspectRatio: HEX_ASPECT,
            transform: "translate(-50%, -50%)",
          }}
          aria-label="Sultan Okulları altıgen galerisi"
        >
          {cards.map((card, i) => (
            <li
              key={`${card.label}-${i}`}
              className="absolute top-0 left-0 m-0 list-none p-0 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
              style={{
                width: "16rem",
                aspectRatio: HEX_ASPECT,
                clipPath: HEX_CLIP,
                background: card.background,
              }}
              aria-label={card.label}
              role="img"
            >
              {card.media.kind === "video" ? (
                <AmbientSiteVideo
                  className="absolute inset-0 h-full w-full object-cover"
                  src={card.media.src}
                  poster={card.media.poster}
                  title={card.media.alt}
                />
              ) : (
                <Image
                  src={card.media.src}
                  alt={card.media.alt}
                  fill
                  sizes="16rem"
                  className="absolute inset-0 object-cover"
                />
              )}
              <span
                aria-hidden
                className="absolute inset-0 bg-emerald-950/22"
              />
              <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: card.accent, mixBlendMode: "overlay" }}
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%)]"
              />
            </li>
          ))}
        </ul>

        <div className="absolute inset-x-0 bottom-10 z-10 flex items-center justify-center gap-fluid-3 sm:bottom-14">
          <button
            ref={prevRef}
            type="button"
            aria-label="Önceki"
            className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <span className="text-[length:var(--text-xs)] font-semibold tracking-[0.32em] text-white/55 uppercase">
            Sürükle · kaydır · snap
          </span>
          <button
            ref={nextRef}
            type="button"
            aria-label="Sonraki"
            className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div ref={proxyRef} className="invisible absolute" aria-hidden />
    </section>
  );
}
