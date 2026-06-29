"use client";

import beyazDesen from "@/images/beyaz-desen.svg";
import { SectionWaveDivider } from "@/components/ui/section-wave-divider";
import { HeroSlider } from "./hero-slider";
import { HERO_SLIDES, type HeroSlide } from "./slides";

/* -------------------------------------------------------------------------
   HeroSection — 4 kolon × 2 satır CSS Grid layout
   ─────────────────────────────────────────────────────────────────────────
   Sütunlar: [sol-boşluk] [sol-içerik] [sağ-içerik] [sağ-boşluk]
   Satırlar:
     1 → Logo sarkma boşluğu  (header logosu bu alana biner)
     2 → Slider alanı          (viewport sonuna kadar uzanır)
   ------------------------------------------------------------------------- */
export function HeroSection({ slides = HERO_SLIDES }: { slides?: HeroSlide[] }) {
  return (
    <section
      aria-label="Ana sayfa hero bölümü"
      className="hero-section-grid relative z-[1] bg-[#4cff00]"
    >
      {/* ── Beyaz desen — hero yeşil zemini üzerinde görünür ───────────── */}
      {/*
        Layout wrapper'daki instance solid bg-[#4cff00] tarafından örtülür.
        Bu iç instance beyaz deseni doğrudan section arka planı üzerine koyar.
        Gerçek slider içeriği eklendiğinde ilgili grid hücrelerine z-[1] ekle.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beyazDesen.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
      />

      {/* ── Satır 1: Logo sarkma boşluğu ──────────────────────────────── */}
      {/*
        Header logosu (sarı halka) header altına --hero-top-spacer kadar sarkar.
        Slider satır 2 bu hizadan başlar; logo bu alanın üzerinde görünür kalır.
      */}
      <div
        className="hero-logo-spacer order-0 col-span-full lg:order-none lg:row-start-1"
        aria-hidden="true"
      />

      {/* ── Satır 2: Slider — sol bilgi kartı (col 2) + sağ altıgen medya (col 3) ── */}
      <HeroSlider slides={slides} />

      {/* ── Dalgalı geçiş — petek (bal köpüğü) bölümüne; tam viewport genişliği ── */}
      <SectionWaveDivider className="relative z-[2] col-span-full max-lg:order-4 lg:row-start-3" />
    </section>
  );
}
