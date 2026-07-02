"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { InteractiveSiteVideo } from "@/components/media/interactive-site-video";
import type { SiteMedia } from "@/content/site-media";
import { t } from "@/lib/animations";
import { cn } from "@/lib/cn";

type KurumsalKimlikGalerisiProps = {
  items: readonly SiteMedia[];
};

export function KurumsalKimlikGalerisi({
  items,
}: KurumsalKimlikGalerisiProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  const [featured, ...gridItems] = items;

  return (
    <section aria-labelledby="galeri-baslik" className="mt-16">
      <div className="flex items-center gap-4">
        <h2
          id="galeri-baslik"
          className="font-cinzel text-charcoal shrink-0 text-2xl font-bold sm:text-3xl"
        >
          Görsel Galeri
        </h2>
        <div className="from-brand-green/60 h-px flex-1 bg-gradient-to-r to-transparent" />
      </div>
      <p className="section-body mt-3 max-w-2xl text-base">
        Kurumsal kimliğimizi yansıtan fotoğraf ve videolardan bir seçki.
        Büyütmek için bir görsele dokunun.
      </p>

      <div className="mt-8 space-y-4 sm:space-y-5">
        {featured ? (
          <GalleryTile
            item={featured}
            index={0}
            variant="featured"
            onOpen={open}
          />
        ) : null}

        {gridItems.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {gridItems.map((item, i) => (
              <li key={`${item.src}-${i + 1}`}>
                <GalleryTile
                  item={item}
                  index={i + 1}
                  variant="grid"
                  onOpen={open}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <KurumsalKimlikLightbox
        items={items}
        activeIndex={activeIndex}
        onClose={close}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}

function GalleryTile({
  item,
  index,
  variant,
  onOpen,
}: {
  item: SiteMedia;
  index: number;
  variant: "featured" | "grid";
  onOpen: (index: number) => void;
}) {
  const isFeatured = variant === "featured";
  const thumbSrc = item.kind === "video" ? item.poster! : item.src;

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        "group focus-visible:ring-brand-green relative block w-full overflow-hidden rounded-2xl border border-black/5 bg-zinc-100 shadow-sm ring-0 transition duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none sm:rounded-3xl",
        isFeatured ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[4/3]",
      )}
      aria-label={`${item.alt} — büyüt`}
    >
      <Image
        src={thumbSrc}
        alt={item.alt}
        fill
        sizes={
          isFeatured
            ? "100vw"
            : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
        }
        className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
      />

      <div className="from-charcoal/75 absolute inset-0 bg-gradient-to-t via-charcoal/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

      {item.kind === "video" ? (
        <span className="bg-charcoal/55 border-brand-honey/60 absolute top-3 right-3 grid size-9 place-items-center rounded-full border text-white backdrop-blur-sm sm:top-4 sm:right-4 sm:size-10">
          <Play className="size-4 translate-x-px fill-white" />
        </span>
      ) : null}

      <span
        className={cn(
          "absolute inset-x-0 bottom-0 translate-y-full px-4 py-3 text-left transition duration-300 group-hover:translate-y-0",
          isFeatured ? "sm:px-6 sm:py-4" : "px-3 py-2.5 sm:px-4",
        )}
      >
        <span className="font-cinzel line-clamp-2 text-xs leading-snug font-semibold text-white sm:text-sm">
          {item.alt}
        </span>
      </span>
    </button>
  );
}

function KurumsalKimlikLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: {
  items: readonly SiteMedia[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const isOpen = activeIndex !== null;

  const goTo = useCallback(
    (nextIndex: number, dir: 1 | -1) => {
      setDirection(dir);
      const total = items.length;
      onNavigate(((nextIndex % total) + total) % total);
    },
    [items.length, onNavigate],
  );

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, goNext, goPrev]);

  const activeItem = useMemo(
    () => (activeIndex !== null ? items[activeIndex] : null),
    [activeIndex, items],
  );

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  }

  return (
    <AnimatePresence>
      {isOpen && activeItem ? (
        <motion.div
          key="kurumsal-kimlik-lightbox"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={t(0.35)}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt}
        >
          <motion.button
            type="button"
            aria-label="Kapat"
            className="bg-charcoal/90 absolute inset-0 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t(0.4)}
            onClick={onClose}
          />

          <div
            className="relative z-[1] flex h-full w-full max-w-5xl flex-col items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="border-brand-honey/40 text-charcoal bg-brand-honey hover:bg-brand-green absolute top-0 right-0 z-10 grid size-10 place-items-center rounded-full border shadow-lg transition sm:size-11"
            >
              <X className="size-5" />
            </button>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Önceki görsel"
              className="border-brand-honey/30 text-charcoal bg-brand-honey/95 hover:bg-brand-green absolute top-1/2 left-0 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border shadow-lg transition sm:size-12"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Sonraki görsel"
              className="border-brand-honey/30 text-charcoal bg-brand-honey/95 hover:bg-brand-green absolute top-1/2 right-0 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border shadow-lg transition sm:size-12"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>

            <div className="relative flex h-[70vh] w-full max-w-4xl items-center justify-center overflow-hidden px-12 sm:px-16">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction > 0 ? 48 : -48 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction > 0 ? -48 : 48 }
                  }
                  transition={t(0.4)}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {activeItem.kind === "video" ? (
                    <div className="relative aspect-video w-full max-h-full overflow-hidden rounded-2xl shadow-2xl">
                      <InteractiveSiteVideo
                        className="h-full w-full object-contain"
                        src={activeItem.src}
                        poster={activeItem.poster}
                        title={activeItem.alt}
                        autoPlay
                      />
                    </div>
                  ) : (
                    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                      <Image
                        src={activeItem.src}
                        alt={activeItem.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 70vw"
                        className="object-contain"
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="font-cinzel max-w-xl px-4 text-sm font-semibold text-white sm:text-base">
                {activeItem.alt}
              </p>
              <p className="text-brand-honey text-xs font-bold tracking-[0.2em] uppercase">
                {(activeIndex ?? 0) + 1} / {items.length}
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
