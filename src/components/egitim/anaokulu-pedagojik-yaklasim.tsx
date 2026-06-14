"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  HeartHandshake,
  Layers3,
  Puzzle,
  Sprout,
} from "lucide-react";
import { HexBadge } from "@/components/ui/hex-badge";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

const icons = [BookOpen, Puzzle, Sprout, HeartHandshake, Layers3] as const;

type BandStyle = {
  /** Sürüklenme yönü; 1 = sağa, -1 = sola */
  direction: 1 | -1;
  /** Tipografi ölçeği */
  scale: "xl" | "lg" | "md";
  className: string;
};

const bands: { phrases: string[]; style: BandStyle }[] = [
  {
    phrases: [
      "Fıtrat üzere başlangıç",
      "Kur’an muhabbeti",
      "Peygamber ahlakı",
      "Sevgi dolu sınıflar",
      "Oyun tabanlı öğrenme",
    ],
    style: {
      direction: 1,
      scale: "xl",
      className: "text-[var(--color-primary)] [text-wrap:balance]",
    },
  },
  {
    phrases: [
      "Bireysel farklılıklara saygı",
      "Bütüncül gelişim",
      "Beden · Zihin · Ahlâk",
      "Elif ile başlayan yolculuk",
    ],
    style: {
      direction: -1,
      scale: "lg",
      className: "text-zinc-900/85 [text-stroke:1px_currentColor]",
    },
  },
  {
    phrases: [
      "Emanet bilinci",
      "Gönüllere muhabbet",
      "Safî fıtratın muhafazası",
      "Atiye yürüyen nesil",
    ],
    style: {
      direction: 1,
      scale: "md",
      className: "text-[var(--color-primary)]/85",
    },
  },
];

const scaleClass: Record<BandStyle["scale"], string> = {
  xl: "text-[clamp(1.6rem,3.8vw_+_0.8rem,4.6rem)]",
  lg: "text-[clamp(1.35rem,3vw_+_0.7rem,3.5rem)]",
  md: "text-[clamp(1.15rem,2.4vw_+_0.55rem,2.8rem)]",
};

export function AnaokuluPedagojikYaklasim({
  items,
}: {
  items: readonly { title: string; text: string }[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const textRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;

      const setters = textRefs.current.map<((value: number) => void) | null>(
        (el) => {
          if (!el) return null;
          const setX = gsap.quickSetter(el, "x", "px");
          return (value: number) => setX(value);
        },
      );
      const xTo = [0, 0, 0];
      const widths = [0, 0, 0];

      const measure = () => {
        textRefs.current.forEach((el, i) => {
          if (!el) return;
          // İçerik iki kez yazıldığı için scrollWidth/2 = tek tekrar genişliği.
          widths[i] = el.scrollWidth / 2;
        });
      };

      // İlk ölçüm + font yüklenme sonrası tekrar ölç.
      measure();
      const fontReady = (
        document as Document & { fonts?: { ready?: Promise<unknown> } }
      ).fonts?.ready;
      if (fontReady && typeof fontReady.then === "function") {
        fontReady.then(measure).catch(() => {});
      }

      const onResize = () => measure();
      window.addEventListener("resize", onResize);

      const clamp = gsap.utils.clamp(-280, 280);

      // Observer wheel/touch hızı 0'a yaklaşırsa rAF her tick’te xTo'yu hafifçe yumuşatıyor.
      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        onChangeY(self) {
          let v = self.velocityY * 0.005;
          v = clamp(v);
          for (let i = 0; i < setters.length; i += 1) {
            const setX = setters[i];
            if (!setX) continue;
            const sign = bands[i].style.direction;
            xTo[i] += v * sign;
            const max = widths[i];
            if (max > 0 && Math.abs(xTo[i]) > max) {
              xTo[i] = xTo[i] % max;
            }
            setX(xTo[i]);
          }
        },
      });

      // Reduced motion: hareketi tamamen kapat — Observer'ı durdur, sıfırla.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        observer.disable();
        textRefs.current.forEach((el, i) => {
          xTo[i] = 0;
          setters[i]?.(0);
          if (el) el.style.transform = "translate3d(0,0,0)";
        });
        return () => observer.enable();
      });

      return () => {
        window.removeEventListener("resize", onResize);
        observer.kill();
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Anaokulunda pedagojik yaklaşımımız"
      className="relative mt-14"
    >
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-[0.32em] text-[var(--color-primary)] uppercase">
          Pedagojik yaklaşımımız
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl">
          Anaokulunda pedagojik yaklaşımımız
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          Sayfayı kaydırdıkça hızla bizimle akan değerler — Sultan’ın anaokulu
          felsefesini sürükleyici bir tipografi şeridiyle hissettiriyoruz.
        </p>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6">
        <div
          className="velocity-stage relative isolate overflow-hidden rounded-[2.25rem] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,244,214,0.78))] py-10 sm:py-12"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.04] mix-blend-multiply" />
          <div className="pointer-events-none absolute top-1/2 -left-32 size-72 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/15 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 -right-32 size-72 -translate-y-1/2 rounded-full bg-[var(--color-secondary-strong)]/30 blur-3xl" />

          <div className="relative flex flex-col gap-3 sm:gap-4">
            {bands.map((band, i) => (
              <div
                key={i}
                className="velocity-band relative w-full overflow-hidden py-1"
                role="presentation"
              >
                <span
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  className={cn(
                    "velocity-text inline-flex leading-[1.15] font-semibold tracking-tight whitespace-nowrap will-change-transform",
                    scaleClass[band.style.scale],
                    band.style.className,
                  )}
                  style={{ fontFamily: "var(--font-manrope, inherit)" }}
                >
                  {[0, 1].map((rep) => (
                    <Fragment key={rep}>
                      {band.phrases.map((phrase, idx) => (
                        <Fragment key={`${rep}-${idx}`}>
                          <span className="px-[0.35em]">{phrase}</span>
                          <span
                            aria-hidden
                            className="px-[0.25em] text-[var(--color-primary)]/55"
                          >
                            ·
                          </span>
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li
              key={item.title}
              className="group relative overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)]"
            >
              <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-[var(--color-primary)]/8 blur-2xl transition group-hover:bg-[var(--color-primary)]/14" />
              <div className="relative flex items-start gap-4">
                <HexBadge size="md" className="bg-white">
                  <Icon className="size-5" aria-hidden />
                </HexBadge>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-[var(--color-primary)]/85 uppercase">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold text-zinc-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {item.text}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
