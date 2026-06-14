"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin, Phone } from "lucide-react";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export function IletisimHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-amber-50 pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      {/* Renk lekeleri */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl"
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

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <motion.span
          className="text-xs font-semibold tracking-[0.32em] text-emerald-700 uppercase"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          İletişim · Ön kayıt
        </motion.span>
        <motion.h1
          className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-emerald-700 sm:text-5xl lg:text-6xl"
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
          className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          Soru, ön kayıt veya bilgi talebi için aşağıdaki formu doldurabilir,
          dilerseniz size en yakın şubeden doğrudan iletişime geçebilirsiniz.
        </motion.p>

        <motion.div
          className="mt-2 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href="#sube-kartlari"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 backdrop-blur transition hover:border-emerald-400 hover:bg-white"
          >
            <MapPin className="size-4" aria-hidden />
            Şubelere bak
          </a>
          <a
            href="#iletisim-formu"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            <ArrowDown className="size-4" aria-hidden />
            Forma git
          </a>
          <a
            href="tel:05060576072"
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            <Phone className="size-4" aria-hidden />
            Hemen ara
          </a>
        </motion.div>
      </div>
    </section>
  );
}
