"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { branches, type Branch } from "@/content/branches";
import {
  staggerContainerVariants,
  staggerItemVariants,
  viewportInView,
} from "@/lib/animations";
import { cn } from "@/lib/cn";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

const accents = [
  "from-emerald-100 via-white to-emerald-50 text-emerald-700",
  "from-amber-100 via-white to-amber-50 text-amber-700",
  "from-sky-100 via-white to-sky-50 text-sky-700",
  "from-rose-100 via-white to-rose-50 text-rose-700",
];

export function IletisimBranchCards() {
  const reduce = useReducedMotion();

  return (
    <section
      id="sube-kartlari"
      aria-label="Şubelerimiz"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.32em] text-[var(--color-primary)] uppercase">
          Şubelerimiz
        </p>
        <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl">
          Size en yakın okul.
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Dört lokasyon — telefon, adres ve detaylar tek bakışta. İhtiyacınıza
          en uygun kampüsten ilerleyin.
        </p>
      </div>

      <motion.div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={viewportInView}
        variants={staggerContainerVariants}
      >
        {branches.map((b, i) => (
          <motion.div key={b.slug} variants={staggerItemVariants}>
            <BranchCard branch={b} accent={accents[i % accents.length]} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function BranchCard({ branch, accent }: { branch: Branch; accent: string }) {
  const tel = `tel:${branch.phone.replace(/\s/g, "")}`;
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(branch.address)}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-gradient-to-br p-5 shadow-[0_20px_60px_rgba(13,107,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(13,107,42,0.16)] sm:p-6",
        accent,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 size-24 bg-white/40"
        style={{ aspectRatio: "2 / 1.7320508075688772", clipPath: HEX_CLIP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.04] mix-blend-multiply"
      />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.22em] text-current uppercase backdrop-blur">
          <MapPin className="size-3" aria-hidden />
          {branch.city}
        </span>
        <h3 className="mt-4 text-lg leading-tight font-semibold tracking-tight text-balance text-zinc-950">
          {branch.name}
        </h3>
        <p className="mt-1 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
          {branch.district}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
          {branch.address}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {branch.levels.map((lv) => (
            <span
              key={lv}
              className="rounded-full border border-current/30 bg-white/60 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.18em] text-current uppercase"
            >
              {lv}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <a
          href={tel}
          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          <Phone className="size-3.5" aria-hidden />
          {branch.phone}
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400"
        >
          Yol tarifi
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <Link
        href={`/subeler/${branch.slug}`}
        aria-label={`${branch.district} şube sayfası`}
        className="relative mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-current underline-offset-4 hover:underline"
      >
        Şube sayfasına git
        <ArrowUpRight className="size-3.5" aria-hidden />
      </Link>
    </article>
  );
}
