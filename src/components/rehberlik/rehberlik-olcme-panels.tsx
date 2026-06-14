"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart2, ClipboardCheck, FolderOpen, Scale } from "lucide-react";
import {
  dereceliPuanlamaAmac,
  dereceliPuanlamaContent,
  hazirbulunuslukContent,
  pisaIntro,
  pisaQA,
  portfolyoContent,
} from "@/content/rehberlik";

gsap.registerPlugin(ScrollTrigger);

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

/* ─── Panel verileri ──────────────────────────────────────────── */
type OlcmePanel =
  | { kind: "pisa" }
  | { kind: "hazirbulunusluk" }
  | { kind: "dereceli" }
  | { kind: "portfolyo" };

const PANELS: Array<{
  num: string;
  label: string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  accent: string;
  itemBg: string;
  itemBorder: string;
  data: OlcmePanel;
}> = [
  {
    num: "01",
    label: "Ölçme ve Değerlendirme",
    title: "PISA",
    Icon: BarChart2,
    bg: "linear-gradient(135deg,#0f1e3d 0%,#1a3060 100%)",
    accent: "#fbbf24",
    itemBg: "rgba(255,255,255,0.07)",
    itemBorder: "rgba(255,255,255,0.10)",
    data: { kind: "pisa" },
  },
  {
    num: "02",
    label: "Ölçme ve Değerlendirme",
    title: "Hazırbulunuşluk Sınavı",
    Icon: ClipboardCheck,
    bg: "linear-gradient(135deg,#0d1f35 0%,#14305e 100%)",
    accent: "#93c5fd",
    itemBg: "rgba(255,255,255,0.07)",
    itemBorder: "rgba(255,255,255,0.10)",
    data: { kind: "hazirbulunusluk" },
  },
  {
    num: "03",
    label: "Ölçme ve Değerlendirme",
    title: "Dereceli Puanlama Anahtarı (RUBİC)",
    Icon: Scale,
    bg: "linear-gradient(135deg,#17243a 0%,#1e3058 100%)",
    accent: "#a5b4fc",
    itemBg: "rgba(255,255,255,0.07)",
    itemBorder: "rgba(255,255,255,0.10)",
    data: { kind: "dereceli" },
  },
  {
    num: "04",
    label: "Ölçme ve Değerlendirme",
    title: "Öğrenci Ürün Dosyası (Portfolyo)",
    Icon: FolderOpen,
    bg: "linear-gradient(135deg,#1a2a4a 0%,#1e3566 100%)",
    accent: "#67e8f9",
    itemBg: "rgba(255,255,255,0.06)",
    itemBorder: "rgba(255,255,255,0.09)",
    data: { kind: "portfolyo" },
  },
] as const;

/* ─── Panel içerik render ─────────────────────────────────────── */
function PanelContent({
  data,
  accent,
  itemBg,
  itemBorder,
}: {
  data: OlcmePanel;
  accent: string;
  itemBg: string;
  itemBorder: string;
}) {
  if (data.kind === "pisa") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-7 text-white/82 sm:text-base">
          {pisaIntro}
        </p>
        <div className="mt-2 space-y-3">
          {pisaQA.map((qa) => (
            <div
              key={qa.q}
              className="rounded-xl border px-4 py-3.5"
              style={{ background: itemBg, borderColor: itemBorder }}
            >
              <p
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: accent }}
              >
                {qa.q}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-white/80">{qa.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.kind === "hazirbulunusluk") {
    return (
      <p className="text-base leading-8 text-white/82 sm:text-lg">
        {hazirbulunuslukContent}
      </p>
    );
  }

  if (data.kind === "dereceli") {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-7 text-white/82 sm:text-base">
          {dereceliPuanlamaContent}
        </p>
        <div>
          <p
            className="mb-3 text-[0.65rem] font-semibold tracking-[0.32em] uppercase"
            style={{ color: accent }}
          >
            Amaçlarına Göre Dereceli Puanlama Anahtarı
          </p>
          <div className="space-y-3">
            {dereceliPuanlamaAmac.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border px-4 py-3.5"
                style={{ background: itemBg, borderColor: itemBorder }}
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-white/78">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.kind === "portfolyo") {
    return (
      <p className="text-base leading-8 text-white/82 sm:text-lg">
        {portfolyoContent}
      </p>
    );
  }

  return null;
}

/* ─── Mobil kart ──────────────────────────────────────────────── */
function MobileOlcmeCard({ p }: { p: (typeof PANELS)[number] }) {
  const Icon = p.Icon;
  return (
    <article
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{ background: p.bg }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.05] mix-blend-screen"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4">
        <p
          className="text-[0.65rem] font-semibold tracking-[0.36em] uppercase"
          style={{ color: p.accent }}
        >
          {p.num} / {p.label.split(" ").pop()}
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
            <Icon className="size-5 text-slate-950" aria-hidden />
          </div>
          <h3 className="text-lg leading-tight font-semibold text-white sm:text-xl">
            {p.title}
          </h3>
        </div>
        <PanelContent
          data={p.data}
          accent={p.accent}
          itemBg={p.itemBg}
          itemBorder={p.itemBorder}
        />
      </div>
    </article>
  );
}

/* ─── Desktop tam ekran panel ─────────────────────────────────── */
function DesktopOlcmePanel({ p }: { p: (typeof PANELS)[number] }) {
  const Icon = p.Icon;
  const isLast = p.num === "04";

  return (
    <section
      data-olcme-panel
      aria-label={p.title}
      className="relative hidden w-full overflow-hidden rounded-2xl lg:block"
      style={{
        height: isLast ? "auto" : "100svh",
        minHeight: isLast ? "100svh" : undefined,
        background: p.bg,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.05] mix-blend-screen"
        aria-hidden
      />

      <div data-olcme-inner className="flex h-full flex-col">
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-[0.9fr_1.1fr] items-start gap-14 px-8 py-20">
          {/* Sol: numara + başlık + ikon */}
          <div className="sticky top-24 flex flex-col gap-7">
            <p
              className="text-[0.65rem] font-semibold tracking-[0.40em] uppercase"
              style={{ color: p.accent }}
            >
              {p.num} / Ölçme
            </p>

            <div className="relative">
              <span
                className="pointer-events-none absolute -top-10 -left-6 leading-none font-black select-none"
                style={{
                  fontSize: "clamp(5rem,10vw,9rem)",
                  color: "rgba(255,255,255,0.04)",
                }}
                aria-hidden
              >
                {p.num}
              </span>
              <h3 className="relative text-4xl leading-[1.05] font-semibold tracking-tight text-white xl:text-5xl">
                {p.title}
              </h3>
            </div>

            <div
              className="grid h-16 shrink-0 place-items-center"
              style={{
                clipPath: HEX_CLIP,
                aspectRatio: "2 / 1.7320508075688772",
                background: p.accent,
              }}
            >
              <Icon className="size-8 text-slate-950" aria-hidden />
            </div>
          </div>

          {/* Sağ: içerik */}
          <div className="pt-1">
            <PanelContent
              data={p.data}
              accent={p.accent}
              itemBg={p.itemBg}
              itemBorder={p.itemBorder}
            />
          </div>
        </div>

        {/* İlerleme noktaları (son panel hariç) */}
        {!isLast && (
          <div className="flex justify-center gap-2 pb-8" aria-hidden>
            {PANELS.map((q) => (
              <span
                key={q.num}
                className="h-1 rounded-full"
                style={{
                  width: q.num === p.num ? "3rem" : "1.5rem",
                  background:
                    q.num === p.num ? p.accent : "rgba(255,255,255,0.20)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────── */
export function RehberlikOlcmePanels() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const allPanels = gsap.utils.toArray<HTMLElement>(
            "[data-olcme-panel]",
            wrapperRef.current,
          );
          const toPin = allPanels.slice(0, -1);
          const triggers: ScrollTrigger[] = [];

          toPin.forEach((panel) => {
            const inner =
              panel.querySelector<HTMLElement>("[data-olcme-inner]");
            if (!inner) return;

            const panelH = inner.scrollHeight;
            const winH = window.innerHeight;
            const diff = panelH - winH;
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

            if (fakeRatio) {
              tl.to(inner, {
                yPercent: -100,
                y: winH,
                duration: 1 / (1 - fakeRatio) - 1,
                ease: "none",
              });
            }

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
      {/* ── MOBİL (< lg) ── */}
      <div className="flex flex-col gap-4 px-4 pt-4 pb-4 sm:px-6 lg:hidden">
        {PANELS.map((p) => (
          <MobileOlcmeCard key={p.num} p={p} />
        ))}
      </div>

      {/* ── DESKTOP (≥ lg) ── */}
      <div className="hidden lg:block">
        {PANELS.map((p) => (
          <DesktopOlcmePanel key={p.num} p={p} />
        ))}
      </div>
    </div>
  );
}
