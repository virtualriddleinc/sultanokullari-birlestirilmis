"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import { medyaFiltreleri } from "@/content/guncel";
import type { SiteMediaItem } from "@/lib/media-items-data";
import {
  staggerContainerVariants,
  staggerItemVariants,
  transitionShort,
  viewportInView,
} from "@/lib/animations";
import { cn } from "@/lib/cn";

type FilterKey = string;

function buildFilters(items: SiteMediaItem[]): FilterKey[] {
  const tags = new Set<string>();
  let hasFoto = false;
  let hasVideo = false;

  for (const item of items) {
    if (item.kind === "foto") hasFoto = true;
    if (item.kind === "video") hasVideo = true;
    for (const tag of item.tags) tags.add(tag);
  }

  const fromItems = [
    "Tümü",
    ...(hasFoto ? ["Fotoğraf"] : []),
    ...(hasVideo ? ["Video"] : []),
    ...[...tags].sort((a, b) => a.localeCompare(b, "tr")),
  ];

  if (fromItems.length > 1) return fromItems;
  return [...medyaFiltreleri];
}

function matchesFilter(item: SiteMediaItem, filter: FilterKey): boolean {
  if (filter === "Tümü") return true;
  if (filter === "Fotoğraf") return item.kind === "foto";
  if (filter === "Video") return item.kind === "video";
  if (filter === "Etkinlik") {
    return item.tags.some((t) => /etkinlik/i.test(t));
  }
  return item.tags.some((t) => t.toLocaleLowerCase("tr") === filter.toLocaleLowerCase("tr"));
}

export function MedyaClient({ items }: { items: SiteMediaItem[] }) {
  const filters = useMemo(() => buildFilters(items), [items]);
  const [tag, setTag] = useState<FilterKey>("Tümü");
  const reduce = useReducedMotion();

  const cards = useMemo(
    () => items.filter((item) => matchesFilter(item, tag)),
    [items, tag],
  );

  const emptyMessage =
    items.length === 0
      ? "Medya arşivinde henüz yayınlanmış öğe yok. CMS’ten medya eklediğinizde burada listelenir."
      : "Bu filtre için henüz kayıt yok.";

  return (
    <>
      <div className="flex flex-wrap gap-fluid-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setTag(f)}
            className={cn(
              "inline-flex min-h-[44px] items-center rounded-full px-fluid-4 text-[length:var(--text-xs)] font-semibold transition",
              f === tag
                ? "bg-[var(--color-primary)] text-white"
                : "border border-zinc-200 bg-white font-medium text-zinc-700 hover:border-zinc-300",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      {reduce ? (
        <ul className="mt-fluid-8 grid gap-fluid-4 md:grid-cols-2">
          {cards.length === 0 ? (
            <li className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-fluid-6 text-[length:var(--text-sm)] text-zinc-600">
              {emptyMessage}
            </li>
          ) : (
            cards.map((item) => (
              <li
                key={item.id}
                className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-[length:var(--text-sm)] text-white"
              >
                <MediaBackdrop item={item} />
                <div className="relative flex h-full flex-col justify-end p-fluid-4">
                  <p className="font-semibold">{item.title}</p>
                  {item.caption ? (
                    <p className="mt-fluid-2 text-white/82">{item.caption}</p>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      ) : (
        <motion.ul
          className="mt-fluid-8 grid gap-fluid-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportInView}
          variants={staggerContainerVariants}
        >
          {cards.length === 0 ? (
            <motion.li
              variants={staggerItemVariants}
              transition={transitionShort}
              className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-fluid-6 text-[length:var(--text-sm)] text-zinc-600"
            >
              {emptyMessage}
            </motion.li>
          ) : (
            cards.map((item) => (
              <motion.li
                key={item.id}
                variants={staggerItemVariants}
                transition={transitionShort}
                className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-[length:var(--text-sm)] text-white"
              >
                <MediaBackdrop item={item} />
                <div className="relative flex h-full flex-col justify-end p-fluid-4">
                  <p className="font-semibold">{item.title}</p>
                  {item.caption ? (
                    <p className="mt-fluid-2 text-white/82">{item.caption}</p>
                  ) : null}
                </div>
              </motion.li>
            ))
          )}
        </motion.ul>
      )}
    </>
  );
}

function MediaBackdrop({ item }: { item: SiteMediaItem }) {
  const isVideo =
    item.kind === "video" ||
    Boolean(item.mimeType?.startsWith("video/")) ||
    /\.(mp4|webm|mov)(\?|$)/i.test(item.url);

  return (
    <>
      {isVideo ? (
        <AmbientSiteVideo
          className="absolute inset-0 h-full w-full object-cover"
          src={item.url}
          title={item.alt || item.title}
        />
      ) : (
        <Image
          src={item.url}
          alt={item.alt || item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/74 via-zinc-950/18 to-transparent" />
    </>
  );
}
