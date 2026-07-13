"use client";

import Link from "@/components/navigation/site-link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import type { Branch } from "@/content/branches";
import { branches as staticBranches } from "@/content/branches";
import { SectionGrid } from "@/components/layout/section-grid";
import {
  staggerContainerVariants,
  staggerItemVariants,
  viewportInView,
} from "@/lib/animations";
import { cn } from "@/lib/cn";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

type CardVariant = "green" | "honey";

const cardVariants: Record<
  CardVariant,
  { shell: string; badge: string; title: string; tag: string; link: string }
> = {
  green: {
    shell:
      "border-charcoal/10 bg-brand-green text-charcoal shadow-[0_20px_60px_rgba(26,28,24,0.12)] hover:shadow-[0_30px_90px_rgba(26,28,24,0.18)]",
    badge: "bg-white/75 text-charcoal",
    title: "text-white",
    tag: "border-charcoal/25 bg-white/55 text-charcoal",
    link: "text-charcoal",
  },
  honey: {
    shell:
      "border-charcoal/10 bg-brand-honey text-charcoal shadow-[0_20px_60px_rgba(26,28,24,0.08)] hover:shadow-[0_30px_90px_rgba(26,28,24,0.14)]",
    badge: "bg-white/80 text-charcoal",
    title: "text-charcoal",
    tag: "border-charcoal/20 bg-white/65 text-charcoal",
    link: "text-charcoal",
  },
};

export function IletisimBranchCards({
  branches = staticBranches,
}: {
  branches?: Branch[];
}) {
  const reduce = useReducedMotion();

  return (
    <SectionGrid id="sube-kartlari" aria-label="Şubelerimiz" variant="white">
      <div className="mb-fluid-8 max-w-2xl">
        <p className="text-brand-green text-[length:var(--text-xs)] font-semibold tracking-[0.32em] uppercase">
          Şubelerimiz
        </p>
        <h2 className="mt-fluid-3 text-[length:var(--text-3xl)] leading-tight font-semibold tracking-tight text-balance text-zinc-950">
          Size en yakın okul.
        </h2>
        <p className="mt-fluid-3 text-[length:var(--text-base)] leading-7 text-zinc-600">
          Dört lokasyon — telefon, adres ve detaylar tek bakışta. İhtiyacınıza
          en uygun kampüsten ilerleyin.
        </p>
      </div>

      <motion.div
        className="grid gap-fluid-4 md:grid-cols-2 lg:grid-cols-3"
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={viewportInView}
        variants={staggerContainerVariants}
      >
        {branches.map((b, i) => (
          <motion.div key={b.slug} variants={staggerItemVariants}>
            <BranchCard
              branch={b}
              variant={i % 2 === 0 ? "green" : "honey"}
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionGrid>
  );
}

function BranchCard({
  branch,
  variant,
}: {
  branch: Branch;
  variant: CardVariant;
}) {
  const tel = `tel:${branch.phone.replace(/\s/g, "")}`;
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(branch.address)}`;
  const styles = cardVariants[variant];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-5 transition hover:-translate-y-1 md:p-6",
        styles.shell,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-6 -right-6 size-24",
          variant === "green" ? "bg-white" : "bg-brand-green/35",
        )}
        style={{ aspectRatio: "2 / 1.7320508075688772", clipPath: HEX_CLIP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center opacity-[0.05] mix-blend-multiply"
      />

      <div className="relative">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[length:var(--text-xs)] font-semibold tracking-[0.22em] uppercase backdrop-blur",
            styles.badge,
          )}
        >
          <MapPin className="size-3" aria-hidden />
          {branch.city}
        </span>
        <h3
          className={cn(
            "mt-fluid-4 text-[length:var(--text-lg)] leading-tight font-semibold tracking-tight text-balance",
            styles.title,
          )}
        >
          {branch.name}
        </h3>
        <p className="text-charcoal/60 mt-1 text-[length:var(--text-xs)] font-medium tracking-[0.18em] uppercase">
          {branch.district}
        </p>
        <p className="text-charcoal/80 mt-fluid-3 line-clamp-3 text-[length:var(--text-sm)] leading-6">
          {branch.address}
        </p>
        <div className="mt-fluid-3 flex flex-wrap items-center gap-1.5">
          {branch.levels.map((lv) => (
            <span
              key={lv}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[length:var(--text-xs)] font-semibold tracking-[0.18em] uppercase",
                styles.tag,
              )}
            >
              {lv}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-fluid-4 flex flex-wrap items-center gap-2">
        <a
          href={tel}
          className="bg-charcoal inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-white shadow-sm transition hover:bg-charcoal/90"
        >
          <Phone className="size-3.5" aria-hidden />
          {branch.phone}
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="border-charcoal/20 text-charcoal hover:border-charcoal/35 inline-flex min-h-[44px] items-center gap-1 rounded-full border bg-white/80 px-3 py-1.5 text-[length:var(--text-xs)] font-semibold transition"
        >
          Yol tarifi
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <Link
        href={`/subeler/${branch.slug}`}
        aria-label={`${branch.district} şube sayfası`}
        className={cn(
          "relative mt-fluid-3 inline-flex min-h-[44px] w-fit items-center gap-1 text-[length:var(--text-xs)] font-semibold underline-offset-4 hover:underline",
          styles.link,
        )}
      >
        Şube sayfasına git
        <ArrowUpRight className="size-3.5" aria-hidden />
      </Link>
    </article>
  );
}
