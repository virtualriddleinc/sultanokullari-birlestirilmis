"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpenText,
  Compass,
  HeartHandshake,
  Layers3,
  Puzzle,
  ScrollText,
  Sparkles,
  Sprout,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { PedagojiHoneycomb } from "@/components/egitim/pedagoji-honeycomb";
import { HexBadge } from "@/components/ui/hex-badge";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

const defaultIcons: LucideIcon[] = [
  Sparkles,
  BookOpenText,
  ScrollText,
  HeartHandshake,
  Sprout,
  Sun,
  Layers3,
  Puzzle,
  Compass,
];

export type PedagojiBand = {
  phrases: string[];
  direction: 1 | -1;
  scale: "xl" | "lg" | "md";
};

export type PedagojiTheme =
  | "emerald"
  | "teal"
  | "amber"
  | "rose"
  | "sky"
  | "violet";

const themePresets: Record<
  PedagojiTheme,
  {
    primary: string;
    secondary: string;
    accent: string;
    band1: string;
    band2: string;
    band3: string;
    blob1: string;
    blob2: string;
    stage: string;
  }
> = {
  emerald: {
    primary: "text-[var(--color-primary)]",
    secondary: "text-zinc-900/85",
    accent: "text-[var(--color-primary)]/70",
    band1: "text-[var(--color-primary)]",
    band2: "text-zinc-900/85",
    band3: "text-[var(--color-primary)]/85",
    blob1: "bg-[var(--color-primary)]/15",
    blob2: "bg-[var(--color-secondary-strong)]/30",
    stage:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(232,250,236,0.78))]",
  },
  teal: {
    primary: "text-[#128a36]",
    secondary: "text-zinc-900/85",
    /** Kayar şerit kutusu (#128a36) üzerinde ayraçlar. */
    accent: "text-white/55",
    band1: "text-white",
    band2: "text-white/92",
    band3: "text-white/88",
    blob1: "bg-white/14",
    blob2: "bg-white/22",
    /** Tam blok yeşili — velocity-stage’de ayrıca border/gölge ile birleştirilir. */
    stage: "bg-[#128a36]",
  },
  amber: {
    primary: "text-amber-600",
    secondary: "text-zinc-900/85",
    accent: "text-amber-600/70",
    band1: "text-amber-600",
    band2: "text-zinc-900/85",
    band3: "text-amber-600/85",
    blob1: "bg-amber-400/20",
    blob2: "bg-yellow-400/20",
    stage:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(254,243,199,0.78))]",
  },
  rose: {
    primary: "text-rose-600",
    secondary: "text-zinc-900/85",
    accent: "text-rose-600/70",
    band1: "text-rose-600",
    band2: "text-zinc-900/85",
    band3: "text-rose-600/85",
    blob1: "bg-rose-400/15",
    blob2: "bg-pink-400/20",
    stage:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,228,230,0.78))]",
  },
  sky: {
    primary: "text-sky-700",
    secondary: "text-zinc-900/85",
    accent: "text-sky-700/70",
    band1: "text-sky-700",
    band2: "text-zinc-900/85",
    band3: "text-sky-700/85",
    blob1: "bg-sky-400/15",
    blob2: "bg-indigo-400/20",
    stage:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(224,242,254,0.78))]",
  },
  violet: {
    primary: "text-violet-700",
    secondary: "text-zinc-900/85",
    accent: "text-violet-700/70",
    band1: "text-violet-700",
    band2: "text-zinc-900/85",
    band3: "text-violet-700/85",
    blob1: "bg-violet-400/15",
    blob2: "bg-fuchsia-400/20",
    stage:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(237,233,254,0.78))]",
  },
};

const scaleClass: Record<PedagojiBand["scale"], string> = {
  xl: "text-[clamp(1.6rem,3.8vw_+_0.8rem,4.6rem)]",
  lg: "text-[clamp(1.35rem,3vw_+_0.7rem,3.5rem)]",
  md: "text-[clamp(1.15rem,2.4vw_+_0.55rem,2.8rem)]",
};

export type PedagojiSectionProps = {
  /** Verilmezse üst başlık bloğu gösterilmez. */
  eyebrow?: string;
  /** Verilmezse üst başlık bloğu gösterilmez. */
  title?: string;
  description?: string;
  /** Boş veya verilmezse kelime şeritleri ve GSAP hareketi gösterilmez. */
  bands?: readonly PedagojiBand[];
  items: readonly { title: string; text: string }[];
  icons?: readonly LucideIcon[];
  theme?: PedagojiTheme;
  /** Altı madde için ana sayfadaki Gâyemiz peteğiyle aynı geometri. */
  itemsLayout?: "grid" | "honeycomb";
  /** Şerit kelimelerinde tekerlek/dokunma ile yatay GSAP hareketi (varsayılan: açık). */
  animateBands?: boolean;
};

export function PedagojiSection({
  eyebrow,
  title,
  description,
  bands = [],
  items,
  icons = defaultIcons,
  theme = "emerald",
  itemsLayout = "grid",
  animateBands = true,
}: PedagojiSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const textRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const palette = themePresets[theme];
  const isHoneycombLayout = itemsLayout === "honeycomb" && items.length === 7;
  const hasHeading = Boolean(eyebrow || title || description);
  const sectionLabel = title ?? eyebrow ?? "Pedagojik yaklaşım";

  useGSAP(
    () => {
      if (bands.length === 0 || !animateBands) {
        return () => {};
      }
      const root = rootRef.current;
      if (!root) return undefined;

      const setters = textRefs.current.map<((value: number) => void) | null>(
        (el) => {
          if (!el) return null;
          const setX = gsap.quickSetter(el, "x", "px");
          return (value: number) => setX(value);
        },
      );
      const xTo = bands.map(() => 0);
      const widths = bands.map(() => 0);

      const measure = () => {
        textRefs.current.forEach((el, i) => {
          if (!el) return;
          widths[i] = el.scrollWidth / 2;
        });
      };

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

      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        onChangeY(self) {
          let v = self.velocityY * 0.005;
          v = clamp(v);
          for (let i = 0; i < setters.length; i += 1) {
            const setX = setters[i];
            if (!setX) continue;
            const sign = bands[i]?.direction ?? 1;
            xTo[i] += v * sign;
            const max = widths[i];
            if (max > 0 && Math.abs(xTo[i]) > max) {
              xTo[i] = xTo[i] % max;
            }
            setX(xTo[i]);
          }
        },
      });

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
    { scope: rootRef, dependencies: [bands, animateBands] },
  );

  return (
    <section
      ref={rootRef}
      aria-label={sectionLabel}
      className="relative mt-fluid-12"
    >
      {!isHoneycombLayout && hasHeading ? (
        <div className="mx-auto mb-fluid-8 max-w-3xl text-center">
          {eyebrow ? (
            <p
              className={cn(
                "text-[length:var(--text-xs)] font-semibold tracking-[0.32em] uppercase",
                palette.primary,
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2
              className={cn(
                "text-[length:var(--text-3xl)] font-semibold tracking-tight text-balance text-zinc-950 md:text-[length:var(--text-4xl)]",
                eyebrow ? "mt-fluid-3" : undefined,
              )}
            >
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-600">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      {bands.length > 0 ? (
        <div className="relative w-full">
          <div
            className={cn(
              "velocity-stage relative isolate overflow-hidden rounded-[2.25rem] py-fluid-8 md:py-fluid-12",
              theme === "teal"
                ? "border border-emerald-950/35 bg-[#128a36] shadow-[0_28px_90px_rgba(7,32,17,0.28)]"
                : cn("border border-zinc-200/80", palette.stage),
            )}
            aria-hidden
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat",
                theme === "teal"
                  ? "opacity-[0.11] mix-blend-screen"
                  : "opacity-[0.04] mix-blend-multiply",
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute top-1/2 -left-32 size-72 -translate-y-1/2 rounded-full blur-3xl",
                palette.blob1,
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute top-1/2 -right-32 size-72 -translate-y-1/2 rounded-full blur-3xl",
                palette.blob2,
              )}
            />

            <div className="relative flex flex-col gap-fluid-3 md:gap-fluid-4">
              {bands.map((band, i) => (
                <div
                  key={i}
                  className="velocity-band relative w-full overflow-hidden py-fluid-1"
                  role="presentation"
                >
                  <span
                    ref={(el) => {
                      textRefs.current[i] = el;
                    }}
                    className={cn(
                      "velocity-text inline-flex leading-[1.15] font-semibold tracking-tight whitespace-nowrap",
                      animateBands && "will-change-transform",
                      scaleClass[band.scale],
                      i === 0
                        ? palette.band1
                        : i === 1
                          ? palette.band2
                          : palette.band3,
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
                              className={cn("px-[0.25em]", palette.accent)}
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
      ) : null}

      {isHoneycombLayout ? (
        <PedagojiHoneycomb
          items={items}
          sectionLabel={`${sectionLabel} — program başlıkları`}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      ) : (
        <ul
          className={cn(
            "grid gap-fluid-4 md:grid-cols-2 lg:grid-cols-3",
            (hasHeading || bands.length > 0) && "mt-fluid-12",
          )}
        >
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li
                key={item.title}
                className="group relative overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white/85 p-fluid-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)] md:p-fluid-6"
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full blur-2xl transition group-hover:opacity-80",
                    palette.blob1,
                  )}
                />
                <div className="relative flex items-start gap-fluid-4">
                  <HexBadge size="md" className="bg-white">
                    <Icon className="size-5" aria-hidden />
                  </HexBadge>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-[length:var(--text-xs)] font-semibold tracking-[0.22em] uppercase",
                        palette.primary,
                      )}
                    >
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(items.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-fluid-2 text-[length:var(--text-base)] font-semibold text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-6 text-zinc-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
