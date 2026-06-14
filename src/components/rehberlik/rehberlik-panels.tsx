"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Check, GraduationCap, Users } from "lucide-react";
import {
  ogrenciCalismalari,
  ogretmenCalismalari,
  veliAkademisi,
  veliAkademisiTakvimNotu,
  veliCalismalari,
} from "@/content/rehberlik";

gsap.registerPlugin(ScrollTrigger);

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

/* ─── Panel tanımları ─────────────────────────────────────────── */
const PINNED = [
  {
    num: "01",
    label: "Rehberlik Birimi",
    title: "Öğrenci Çalışmaları",
    Icon: GraduationCap,
    items: ogrenciCalismalari,
    bg: "linear-gradient(135deg,#0b3d1e 0%,#0f5229 100%)",
    accent: "#f6c945",
    itemBg: "rgba(255,255,255,0.07)",
    itemBorder: "rgba(255,255,255,0.11)",
  },
  {
    num: "02",
    label: "Rehberlik Birimi",
    title: "Veli Çalışmaları",
    Icon: Users,
    items: veliCalismalari,
    bg: "linear-gradient(135deg,#071a0c 0%,#0d3318 100%)",
    accent: "#a7f3d0",
    itemBg: "rgba(255,255,255,0.06)",
    itemBorder: "rgba(255,255,255,0.09)",
  },
  {
    num: "03",
    label: "Rehberlik Birimi",
    title: "Öğretmen Çalışmaları",
    Icon: BookOpen,
    items: ogretmenCalismalari,
    bg: "linear-gradient(135deg,#172f1e 0%,#1a3a22 100%)",
    accent: "#fde68a",
    itemBg: "rgba(255,255,255,0.07)",
    itemBorder: "rgba(255,255,255,0.09)",
  },
] as const;

/* ─── Mobil kart bileşeni ─────────────────────────────────────── */
function MobileCard({ p }: { p: (typeof PINNED)[number] }) {
  const Icon = p.Icon;
  return (
    <article
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{ background: p.bg }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.06] mix-blend-screen"
        aria-hidden
      />
      <div className="relative flex flex-col gap-5">
        <p
          className="text-[0.65rem] font-semibold tracking-[0.36em] uppercase"
          style={{ color: p.accent }}
        >
          {p.num} / {p.label}
        </p>
        <div className="flex items-center gap-4">
          <div
            className="grid h-12 shrink-0 place-items-center"
            style={{
              clipPath: HEX_CLIP,
              aspectRatio: "2 / 1.7320508075688772",
              background: p.accent,
            }}
          >
            <Icon className="size-5 text-emerald-950" aria-hidden />
          </div>
          <h2 className="text-xl leading-tight font-semibold text-white sm:text-2xl">
            {p.title}
          </h2>
        </div>
        <ul className="space-y-2">
          {p.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5"
              style={{ background: p.itemBg, borderColor: p.itemBorder }}
            >
              <Check
                className="mt-0.5 size-3.5 shrink-0"
                style={{ color: p.accent }}
                aria-hidden
              />
              <span className="text-sm leading-5 text-white/85">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ─── Desktop tam ekran panel ─────────────────────────────────── */
function DesktopPanel({
  p,
  isLast,
}: {
  p: (typeof PINNED)[number];
  isLast: boolean;
}) {
  const Icon = p.Icon;
  return (
    <section
      data-rh-desktop-panel
      aria-label={p.title}
      className="relative hidden w-full overflow-hidden rounded-2xl lg:block"
      style={{ height: "100svh", background: p.bg }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.06] mix-blend-screen"
        aria-hidden
      />

      <div data-rh-inner className="flex h-full flex-col">
        {/* İçerik alanı */}
        <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-[1fr_1.1fr] items-center gap-16 px-8 py-20">
          {/* Sol: numara + başlık + ikon */}
          <div className="flex flex-col gap-7">
            <p
              className="text-[0.65rem] font-semibold tracking-[0.40em] uppercase"
              style={{ color: p.accent }}
            >
              {p.num} / {p.label}
            </p>

            {/* Dekoratif numara + başlık */}
            <div className="relative">
              <span
                className="pointer-events-none absolute -top-10 -left-6 leading-none font-black select-none"
                style={{
                  fontSize: "clamp(5rem,12vw,10rem)",
                  color: "rgba(255,255,255,0.04)",
                }}
                aria-hidden
              >
                {p.num}
              </span>
              <h2 className="relative text-5xl leading-[1.05] font-semibold tracking-tight text-white xl:text-6xl">
                {p.title}
              </h2>
            </div>

            {/* Altıgen ikon */}
            <div
              className="grid h-16 shrink-0 place-items-center"
              style={{
                clipPath: HEX_CLIP,
                aspectRatio: "2 / 1.7320508075688772",
                background: p.accent,
              }}
            >
              <Icon className="size-8 text-emerald-950" aria-hidden />
            </div>
          </div>

          {/* Sağ: maddeler */}
          <ul className="grid grid-cols-2 gap-3">
            {p.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
                style={{ background: p.itemBg, borderColor: p.itemBorder }}
              >
                <Check
                  className="mt-0.5 size-4 shrink-0"
                  style={{ color: p.accent }}
                  aria-hidden
                />
                <span className="text-sm leading-5 text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* İlerleme noktaları */}
        {!isLast && (
          <div className="flex justify-center gap-2 pb-8" aria-hidden>
            {PINNED.map((q) => (
              <span
                key={q.num}
                className="h-1 rounded-full"
                style={{
                  width: q.num === p.num ? "3rem" : "1.5rem",
                  background:
                    q.num === p.num ? p.accent : "rgba(255,255,255,0.20)",
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Son panel: Veli Akademisi (pinlenmez) ───────────────────── */
function VeliAkademisiDesktop() {
  return (
    <section
      data-rh-desktop-panel
      aria-label="Veli Akademisi"
      className="relative hidden w-full overflow-hidden rounded-2xl lg:block"
      style={{
        minHeight: "100svh",
        background:
          "linear-gradient(135deg,#78350f 0%,#92400e 50%,#b45309 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.07] mix-blend-screen"
        aria-hidden
      />
      <div data-rh-inner className="mx-auto max-w-5xl px-8 py-24">
        <p className="text-[0.65rem] font-semibold tracking-[0.40em] text-amber-200/90 uppercase">
          04 / Veli Akademisi
        </p>
        <h2 className="mt-5 max-w-lg text-5xl leading-[1.05] font-semibold tracking-tight text-white xl:text-6xl">
          Veli Akademisi
        </h2>
        <p className="mt-7 max-w-xl text-base leading-7 text-amber-100/82">
          {veliAkademisi}
        </p>
        <p className="mt-3 text-sm text-amber-300/55">
          {veliAkademisiTakvimNotu}
        </p>
      </div>
    </section>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────── */
export function RehberlikPanels() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const allPanels = gsap.utils.toArray<HTMLElement>(
            "[data-rh-desktop-panel]",
            wrapperRef.current,
          );
          // Son panel pinlenmez — öncekiler kapanırken alttan kayar
          const toPin = allPanels.slice(0, -1);
          const triggers: ScrollTrigger[] = [];

          toPin.forEach((panel) => {
            const inner = panel.querySelector<HTMLElement>("[data-rh-inner]");
            if (!inner) return;

            const panelH = inner.scrollHeight;
            const winH = window.innerHeight;
            const diff = panelH - winH;
            // İçerik ekrandan uzunsa sahte kaydırma oranı hesapla
            const fakeRatio = diff > 0 ? diff / (diff + winH) : 0;

            if (fakeRatio) {
              panel.style.marginBottom = `${panelH * fakeRatio}px`;
            }

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                start: "bottom bottom",
                end: () =>
                  fakeRatio ? `+=${inner.scrollHeight}` : "bottom top",
                pinSpacing: false,
                pin: true,
                scrub: true,
              },
            });

            // İçerik ekrandan uzunsa önce içeriği yukarı kaydır
            if (fakeRatio) {
              tl.to(inner, {
                yPercent: -100,
                y: winH,
                duration: 1 / (1 - fakeRatio) - 1,
                ease: "none",
              });
            }

            // Sonraki panel gelirken mevcut panel küçül ve sönükleş
            tl.fromTo(
              panel,
              { scale: 1, opacity: 1 },
              { scale: 0.78, opacity: 0.45, duration: 0.9 },
            ).to(panel, { opacity: 0, duration: 0.1 });

            if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
          });

          return () => triggers.forEach((t) => t.kill());
        },
      );

      return () => mm.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef}>
      {/* ── MOBİL görünüm (< lg) ── */}
      <div className="flex flex-col gap-4 px-4 pt-4 pb-8 sm:px-6 lg:hidden">
        {PINNED.map((p) => (
          <MobileCard key={p.num} p={p} />
        ))}

        {/* Mobil: Veli Akademisi */}
        <article
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{
            background:
              "linear-gradient(135deg,#78350f 0%,#92400e 50%,#b45309 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.07] mix-blend-screen"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4">
            <p className="text-[0.65rem] font-semibold tracking-[0.36em] text-amber-200/90 uppercase">
              04 / Veli Akademisi
            </p>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Veli Akademisi
            </h2>
            <p className="text-sm leading-6 text-amber-100/80">
              {veliAkademisi}
            </p>
            <p className="text-xs text-amber-300/55">
              {veliAkademisiTakvimNotu}
            </p>
          </div>
        </article>
      </div>

      {/* ── DESKTOP görünüm (≥ lg) ── */}
      <div className="hidden lg:block">
        {PINNED.map((p, i) => (
          <DesktopPanel key={p.num} p={p} isLast={i === PINNED.length - 1} />
        ))}
        <VeliAkademisiDesktop />
      </div>
    </div>
  );
}
