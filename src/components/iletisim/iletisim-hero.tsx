"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin, Phone } from "lucide-react";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export function IletisimHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-brand-green/15 bg-gradient-to-br from-brand-green/10 via-white to-amber-50 py-fluid-8 sm:py-fluid-16">
      {/* Renk lekeleri */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-green/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-24 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl"
      />

      {/* Dekoratif altıgenler */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-16 hidden h-56 w-56 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.10] md:block"
        style={{ clipPath: HEX_CLIP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 -right-20 hidden h-48 w-48 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.08] lg:block"
        style={{ clipPath: HEX_CLIP }}
      />

      <div className="section-page-grid relative z-10">
        <div className="section-page-grid__content flex flex-col gap-fluid-6">
          <motion.span
            className="text-brand-green text-[length:var(--text-xs)] font-semibold tracking-[0.32em] uppercase"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            İletişim · Ön kayıt
          </motion.span>
          <motion.h1
            className="text-brand-green max-w-3xl text-[length:var(--text-4xl)] leading-[1.05] font-semibold tracking-tight text-balance"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Bize ulaşın,{" "}
            <span className="text-zinc-900">
              çocuğunuzun yolculuğu burada başlasın.
            </span>
          </motion.h1>
          <motion.p
            className="max-w-2xl text-[length:var(--text-base)] leading-7 text-zinc-600 md:text-[length:var(--text-lg)]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Soru, ön kayıt veya bilgi talebi için aşağıdaki formu doldurabilir,
            dilerseniz size en yakın şubeden doğrudan iletişime geçebilirsiniz.
          </motion.p>

          <motion.div
            className="mt-fluid-2 flex flex-wrap items-center gap-fluid-3"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="#sube-kartlari"
              className="border-brand-green/40 text-brand-green hover:border-brand-green inline-flex min-h-[44px] items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-[length:var(--text-sm)] font-semibold backdrop-blur transition hover:bg-white"
            >
              <MapPin className="size-4" aria-hidden />
              Şubelere bak
            </a>
            <a
              href="#iletisim-formu"
              className="bg-brand-green text-charcoal hover:bg-charcoal hover:text-white inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-sm)] font-semibold transition"
            >
              <ArrowDown className="size-4" aria-hidden />
              Forma git
            </a>
            <a
              href="tel:05060576072"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[length:var(--text-sm)] font-semibold text-amber-800 transition hover:bg-amber-100"
            >
              <Phone className="size-4" aria-hidden />
              Hemen ara
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
