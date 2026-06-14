"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { medyaFiltreleri, staticEvents } from "@/content/guncel";
import { mediaPageItems } from "@/content/site-media";
import {
  staggerContainerVariants,
  staggerItemVariants,
  transitionShort,
  viewportInView,
} from "@/lib/animations";

export function MedyaClient() {
  const [tag, setTag] = useState<(typeof medyaFiltreleri)[number]>("Tümü");
  const reduce = useReducedMotion();
  const cards = useMemo(() => {
    if (tag === "Tümü") return staticEvents;
    if (tag === "Etkinlik") return staticEvents;
    return [];
  }, [tag]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {medyaFiltreleri.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setTag(f)}
            className={
              f === tag
                ? "rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-300"
            }
          >
            {f}
          </button>
        ))}
      </div>
      {reduce ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.length === 0 ? (
            <li className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
              Bu etiket için henüz örnek kayıt yok. Veri eklendiğinde kartlar
              burada listelenir.
            </li>
          ) : (
            cards.map((e, index) => {
              const media = mediaPageItems[index % mediaPageItems.length];
              return (
                <li
                  key={e.id}
                  className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-sm text-white"
                >
                  <MediaBackdrop media={media} />
                  <div className="relative flex h-full flex-col justify-end p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="mt-2 text-white/82">{e.excerpt}</p>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      ) : (
        <motion.ul
          className="mt-8 grid gap-4 sm:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportInView}
          variants={staggerContainerVariants}
        >
          {cards.length === 0 ? (
            <motion.li
              variants={staggerItemVariants}
              transition={transitionShort}
              className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600"
            >
              Bu etiket için henüz örnek kayıt yok. Veri eklendiğinde kartlar
              burada listelenir.
            </motion.li>
          ) : (
            cards.map((e, index) => {
              const media = mediaPageItems[index % mediaPageItems.length];
              return (
                <motion.li
                  key={e.id}
                  variants={staggerItemVariants}
                  transition={transitionShort}
                  className="relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-sm text-white"
                >
                  <MediaBackdrop media={media} />
                  <div className="relative flex h-full flex-col justify-end p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="mt-2 text-white/82">{e.excerpt}</p>
                  </div>
                </motion.li>
              );
            })
          )}
        </motion.ul>
      )}
    </>
  );
}

function MediaBackdrop({ media }: { media: (typeof mediaPageItems)[number] }) {
  return (
    <>
      {media.kind === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          autoPlay
          loop
          muted
          playsInline
          aria-label={media.alt}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/74 via-zinc-950/18 to-transparent" />
    </>
  );
}
