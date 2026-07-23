"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { branches as staticBranches } from "@/content/branches";
import { branchPreviewMedia } from "@/content/site-media";
import type { SiteMedia } from "@/content/site-media";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import { ContentCard } from "@/components/layout/content-card";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { HexBadge } from "@/components/ui/hex-badge";
import { getCampusRouteFromBranch } from "@/lib/campus-routes";
import type { CmsBranch } from "@/lib/branches-data";
import { t } from "@/lib/animations";
import { cn } from "@/lib/cn";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

function getBranchMedia(branch: CmsBranch): SiteMedia | undefined {
  return branch.previewMedia ?? branchPreviewMedia[branch.slug ?? ""];
}

function BranchPreviewMedia({
  media,
  className,
  sizes,
  autoPlay = true,
}: {
  media: SiteMedia;
  className?: string;
  sizes: string;
  autoPlay?: boolean;
}) {
  if (media.kind === "video") {
    return (
      <AmbientSiteVideo
        className={className}
        src={media.src}
        poster={media.poster}
        title={media.alt}
        autoPlay={autoPlay}
        preload={autoPlay ? "metadata" : "none"}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      className={className}
    />
  );
}

export type HomeBranchesShowcaseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  branches?: CmsBranch[];
};

export function HomeBranchesShowcase({
  eyebrow = "Okullarımız",
  title = "Size en yakın Sultan okulunu keşfedin",
  description = "Size en yakın Sultan okulunu seçerek yol tarifi alabilir, okulumuza güvenli ve pratik bir şekilde ulaşabilirsiniz.",
  ctaLabel = "Sizi Arayalım",
  ctaHref = "/iletisim",
  branches = staticBranches as CmsBranch[],
}: HomeBranchesShowcaseProps = {}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const mobileItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const intersectionRatios = useRef<Record<number, number>>({});
  const branch = branches[active] ?? branches[0];
  const media = getBranchMedia(branch);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const connectObserver = () => {
      if (mq.matches) return () => {};

      const items = mobileItemRefs.current.filter(
        (item): item is HTMLLIElement => item !== null,
      );
      if (!items.length) return () => {};

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const index = Number(
              (entry.target as HTMLLIElement).dataset.branchIndex,
            );
            if (Number.isNaN(index)) continue;
            intersectionRatios.current[index] = entry.isIntersecting
              ? entry.intersectionRatio
              : 0;
          }

          const best = Object.entries(intersectionRatios.current).sort(
            ([, a], [, b]) => b - a,
          )[0];

          if (best && best[1] > 0) {
            setActive(Number(best[0]));
          }
        },
        {
          rootMargin: "-18% 0px -52% 0px",
          threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        },
      );

      items.forEach((item) => observer.observe(item));
      return () => observer.disconnect();
    };

    let disconnect = connectObserver();
    const onBreakpointChange = () => {
      disconnect();
      intersectionRatios.current = {};
      disconnect = connectObserver();
    };

    mq.addEventListener("change", onBreakpointChange);
    return () => {
      mq.removeEventListener("change", onBreakpointChange);
      disconnect();
    };
  }, [branches.length]);

  if (!branch) return null;

  return (
    <SectionGrid
      id="okullarimiz"
      variant="white"
      className="border-charcoal/10 border-y"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Link
            href={ctaHref}
            className={cn(
              "cta-pill px-8 py-4 text-base font-bold shadow-lg shadow-brand-green/30 transition-transform hover:scale-105 hover:shadow-xl hover:shadow-brand-green/40",
            )}
          >
            {ctaLabel}
            <ArrowUpRight className="size-5" aria-hidden />
          </Link>
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
        {/* Mobil — kaydırma tetiklemeli akordiyon; fotoğraf okul adının hemen altında */}
        <ol className="border-charcoal/15 grid grid-cols-[auto_auto_1fr] gap-x-4 border-y lg:hidden">
          {branches.map((b, i) => {
            const isActive = i === active;
            const branchMedia = getBranchMedia(b);

            return (
              <li
                key={b.slug}
                ref={(el) => {
                  mobileItemRefs.current[i] = el;
                }}
                data-branch-index={i}
                className="border-charcoal/15 col-span-3 grid grid-cols-subgrid border-b last:border-b-0"
              >
                <div className="col-span-3 grid grid-cols-subgrid items-start gap-y-1 py-4">
                  <Link
                    href={getCampusRouteFromBranch(b)}
                    className="contents"
                  >
                    <span
                      className={cn(
                        "font-cinzel text-lg font-bold tracking-tight transition-colors sm:text-xl",
                        isActive ? "text-charcoal" : "text-charcoal/70",
                      )}
                    >
                      {b.district}
                    </span>
                    <span
                      className={cn(
                        "font-cinzel text-lg font-bold tracking-tight transition-colors sm:text-xl",
                        isActive ? "text-charcoal/45" : "text-charcoal/35",
                      )}
                    >
                      {b.city}
                    </span>
                  </Link>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "mt-1 size-5 justify-self-end shrink-0 text-charcoal/35 transition-transform duration-300",
                      isActive && "rotate-180 text-brand-green-ink",
                    )}
                  />
                  <p className="text-charcoal/55 col-span-2 text-xs font-medium tracking-[0.22em] uppercase">
                    {b.upcoming
                      ? "Yakında açılacak"
                      : b.levels.join(" · ")}
                  </p>
                </div>

                <div
                  className={cn(
                    "col-span-3 grid transition-[grid-template-rows] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                    reduce ? "duration-0" : "duration-500",
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  aria-hidden={!isActive}
                >
                  <div className="overflow-hidden">
                    {branchMedia ? (
                      <div
                        className={cn(
                          "relative mb-4 aspect-[16/9] overflow-hidden rounded-xl transition-opacity",
                          reduce ? "duration-0" : "duration-300",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <BranchPreviewMedia
                          media={branchMedia}
                          className="absolute inset-0 h-full w-full object-cover"
                          sizes="100vw"
                          autoPlay={isActive && !reduce}
                        />
                        <div className="from-charcoal/70 absolute inset-0 bg-gradient-to-t via-charcoal/15 to-transparent" />
                        <div className="absolute right-4 bottom-4 left-4">
                          <p className="font-cinzel text-lg leading-tight font-bold text-white">
                            {b.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-white/85">
                            {b.address}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Masaüstü — hover ile sağ panelde önizleme; ilçe/il sütunları subgrid ile hizalı */}
        <ol className="border-charcoal/15 grid grid-cols-[auto_auto_1fr] gap-x-4 border-y max-lg:hidden">
          {branches.map((b, i) => {
            const isActive = i === active;
            return (
              <li
                key={b.slug}
                className="border-charcoal/15 col-span-3 grid grid-cols-subgrid border-b last:border-b-0"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <Link
                  href={getCampusRouteFromBranch(b)}
                  className="group col-span-3 grid grid-cols-subgrid items-center gap-y-1 py-5"
                >
                  <span
                    className={cn(
                      "font-cinzel text-xl font-bold tracking-tight transition-colors sm:text-2xl",
                      isActive ? "text-charcoal" : "text-charcoal/70",
                    )}
                  >
                    {b.district}
                  </span>
                  <span
                    className={cn(
                      "font-cinzel pr-4 text-xl font-bold tracking-tight transition-colors sm:text-2xl",
                      isActive ? "text-charcoal/45" : "text-charcoal/35",
                    )}
                  >
                    {b.city}
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-10 justify-self-end items-center gap-1 rounded-full px-3 text-xs font-semibold transition",
                      isActive
                        ? "bg-brand-green text-charcoal"
                        : "border-charcoal/15 text-charcoal/75 group-hover:border-brand-green/40 border",
                    )}
                  >
                    {b.upcoming ? "Yakında" : "Okula git"}{" "}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                  <p className="text-charcoal/55 col-span-2 text-xs font-medium tracking-[0.22em] uppercase">
                    {b.upcoming ? "Yakında açılacak" : b.levels.join(" · ")}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>

        <ContentCard
          inset={false}
          className="relative hidden h-[28rem] overflow-hidden lg:block"
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
              {media ? (
                <BranchPreviewMedia
                  media={media}
                  className="absolute inset-0 h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 32rem"
                  autoPlay={!reduce}
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
