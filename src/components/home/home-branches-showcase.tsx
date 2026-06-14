"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { branches } from "@/content/branches";
import { branchPreviewMedia } from "@/content/site-media";
import { ContentCard } from "@/components/layout/content-card";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { HexBadge } from "@/components/ui/hex-badge";
import { getCampusRouteFromBranch } from "@/lib/campus-routes";
import { t } from "@/lib/animations";
import { cn } from "@/lib/cn";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export function HomeBranchesShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const branch = branches[active];
  const media = branchPreviewMedia[branch.slug];

  return (
    <SectionGrid
      id="okullarimiz"
      variant="white"
      className="border-charcoal/10 border-y"
    >
      <SectionHeading
        eyebrow="Okullarımız"
        title="Size en yakın Sultan okulunu keşfedin"
        description="Size en yakın Sultan okulunu seçerek yol tarifi alabilir, okulumuza güvenli ve pratik bir şekilde ulaşabilirsiniz."
        action={
          <Link href="/iletisim" className="cta-pill">
            Sizi Arayalım
          </Link>
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        <ol className="divide-charcoal/15 border-charcoal/15 divide-y border-y">
          {branches.map((b, i) => {
            const isActive = i === active;
            return (
              <li
                key={b.slug}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <Link
                  href={getCampusRouteFromBranch(b)}
                  className="group flex flex-wrap items-center justify-between gap-4 py-5"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "text-sm font-semibold tracking-wide tabular-nums",
                        isActive ? "text-brand-green" : "text-charcoal/40",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p
                        className={cn(
                          "font-cinzel text-2xl font-bold tracking-tight transition-colors sm:text-3xl",
                          isActive ? "text-charcoal" : "text-charcoal/70",
                        )}
                      >
                        {b.district}
                        <span className="text-charcoal/45"> · {b.city}</span>
                      </p>
                      <p className="text-charcoal/55 mt-1 text-xs font-medium tracking-[0.22em] uppercase">
                        {b.upcoming
                          ? "Yakında açılacak"
                          : b.levels.join(" · ")}
                      </p>
                    </div>
                  </div>
                    <span
                      className={cn(
                        "inline-flex h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold transition",
                        isActive
                          ? "bg-brand-green text-charcoal"
                          : "border-charcoal/15 text-charcoal/75 group-hover:border-brand-green/40 border",
                      )}
                    >
                      {b.upcoming ? "Yakında" : "Okula git"}{" "}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <ContentCard
          inset={false}
          className="relative h-[28rem] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={branch.slug}
              initial={reduce ? false : { opacity: 0, scale: 1.02 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.04 }}
              transition={t(0.55)}
              className="absolute inset-0"
            >
              {media?.kind === "video" ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={media.src}
                  poster={media.poster}
                  autoPlay={!reduce}
                  loop
                  muted
                  playsInline
                  aria-label={media.alt}
                />
              ) : media ? (
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 32rem"
                  className="absolute inset-0 object-cover"
                />
              ) : null}
              <div className="from-charcoal/80 via-charcoal/25 absolute inset-0 bg-gradient-to-t to-transparent" />
              <span
                aria-hidden
                className="bg-brand-honey/25 absolute top-8 right-8 inline-block w-16"
                style={{
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath: HEX_CLIP,
                }}
              />

              <div className="relative flex h-full flex-col justify-end p-8 text-white">
                <HexBadge size="lg" className="bg-brand-honey/20 text-white">
                  <MapPin className="size-7" aria-hidden />
                </HexBadge>
                <p className="section-eyebrow text-brand-honey mt-6">
                  {branch.city}
                </p>
                <h3 className="font-cinzel mt-2 text-3xl leading-tight font-bold tracking-tight">
                  {branch.name}
                </h3>
                <p className="mt-3 text-sm text-white/85">{branch.address}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {branch.levels.map((lv) => (
                    <span
                      key={lv}
                      className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.22em] uppercase"
                    >
                      {lv}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </ContentCard>
      </div>
    </SectionGrid>
  );
}
