"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { SiteMedia } from "@/content/site-media";
import { t } from "@/lib/animations";
import { cn } from "@/lib/cn";

type KurumsalKimlikGalerisiProps = {
  items: readonly SiteMedia[];
  title?: string;
  description?: string;
};

type LightboxState = {
  index: number;
  mediaSrc: string;
};

export function KurumsalKimlikGalerisi({
  items,
  title = "Görsel Galeri",
  description = "Kurumsal kimliğimizi yansıtan fotoğraf ve videolardan bir seçki. Büyütmek için bir görsele dokunun.",
}: KurumsalKimlikGalerisiProps) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const open = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      setLightbox({ index, mediaSrc: item.src });
    },
    [items],
  );

  const close = useCallback(() => setLightbox(null), []);

  return (
    <section aria-labelledby="galeri-baslik" className="mt-16">
      <div className="flex items-center gap-4">
        <h2
          id="galeri-baslik"
          className="font-cinzel text-charcoal shrink-0 text-2xl font-bold sm:text-3xl"
        >
          {title}
        </h2>
        <div className="from-brand-green/60 h-px flex-1 bg-gradient-to-r to-transparent" />
      </div>
      <p className="section-body mt-3 max-w-2xl text-base">{description}</p>

      <div className="mt-8 space-y-4 sm:space-y-5">
        {items.map((item, index) =>
          index === 0 ? (
            <GalleryTile
              key={`tile-${index}-${item.src}`}
              item={item}
              index={index}
              variant="featured"
              onOpen={open}
            />
          ) : null,
        )}

        {items.length > 1 ? (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {items.slice(1).map((item, i) => {
              const index = i + 1;
              return (
                <li key={`tile-${index}-${item.src}`}>
                  <GalleryTile
                    item={item}
                    index={index}
                    variant="grid"
                    onOpen={open}
                  />
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <KurumsalKimlikLightbox
        items={items}
        lightbox={lightbox}
        onClose={close}
        onNavigate={(index) => {
          const item = items[index];
          if (!item) return;
          setLightbox({ index, mediaSrc: item.src });
        }}
      />
    </section>
  );
}

function VideoThumbnail({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const showPreviewFrame = () => {
      if (el.duration && Number.isFinite(el.duration)) {
        el.currentTime = Math.min(0.1, el.duration / 10);
      }
    };

    el.addEventListener("loadeddata", showPreviewFrame, { once: true });
    return () => el.removeEventListener("loadeddata", showPreviewFrame);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="metadata"
      aria-hidden
      className={className}
    />
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

  return (
    <button
      type="button"
      data-gallery-index={index}
      data-gallery-kind={item.kind}
      data-gallery-src={item.src}
      onClick={() => onOpen(index)}
      className={cn(
        "group focus-visible:ring-brand-green relative block w-full overflow-hidden rounded-2xl border border-black/5 bg-zinc-100 shadow-sm ring-0 transition duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none sm:rounded-3xl",
        isFeatured ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[4/3]",
      )}
      aria-label={item.kind === "video" ? "Videoyu büyüt" : "Görseli büyüt"}
    >
      {item.kind === "video" ? (
        <VideoThumbnail
          src={item.src}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <Image
          src={item.src}
          alt=""
          fill
          sizes={
            isFeatured
              ? "100vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
          }
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}

      {item.kind === "video" ? (
        <span className="bg-charcoal/55 border-brand-honey/60 pointer-events-none absolute top-3 right-3 grid size-9 place-items-center rounded-full border text-white backdrop-blur-sm sm:top-4 sm:right-4 sm:size-10">
          <Play className="size-4 translate-x-px fill-white" />
        </span>
      ) : null}
    </button>
  );
}

function LightboxVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.pause();
    el.removeAttribute("src");
    el.load();

    el.src = src;
    el.muted = false;
    el.currentTime = 0;
    el.load();

    const play = () => {
      const attempt = el.play();
      if (attempt) {
        attempt.catch(() => {
          el.muted = true;
          void el.play();
        });
      }
    };

    if (el.readyState >= 2) {
      play();
    } else {
      el.addEventListener("loadeddata", play, { once: true });
    }

    return () => {
      el.pause();
      el.removeAttribute("src");
      el.load();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      controls
      playsInline
      preload="auto"
      className="max-h-full max-w-full rounded-2xl shadow-2xl"
    />
  );
}

function KurumsalKimlikLightbox({
  items,
  lightbox,
  onClose,
  onNavigate,
}: {
  items: readonly SiteMedia[];
  lightbox: LightboxState | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const activeIndex = lightbox?.index ?? null;
  const activeItem =
    activeIndex !== null ? (items[activeIndex] ?? null) : null;
  const isOpen =
    activeItem !== null &&
    activeIndex !== null &&
    lightbox !== null &&
    activeItem.src === lightbox.mediaSrc;

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
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, goNext, goPrev]);

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchStartY.current = e.touches[0]?.clientY ?? null;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 48) return;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0) goNext();
    else goPrev();
  }

  return (
    <AnimatePresence>
      {isOpen && activeItem && activeIndex !== null ? (
        <motion.div
          key="kurumsal-kimlik-lightbox"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={t(0.35)}
          role="dialog"
          aria-modal="true"
          aria-label="Görsel galerisi"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
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

          <div className="relative z-[1] flex h-full w-full max-w-5xl flex-col items-center justify-center">
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
              className="border-brand-honey/30 text-charcoal bg-brand-honey/95 hover:bg-brand-green absolute top-1/2 left-0 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border shadow-lg transition sm:grid sm:size-12"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Sonraki görsel"
              className="border-brand-honey/30 text-charcoal bg-brand-honey/95 hover:bg-brand-green absolute top-1/2 right-0 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border shadow-lg transition sm:grid sm:size-12"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>

            <button
              type="button"
              aria-label="Önceki görsel"
              className="absolute top-1/2 left-0 z-[5] h-2/3 w-1/4 -translate-y-1/2 sm:hidden"
              onClick={goPrev}
            />
            <button
              type="button"
              aria-label="Sonraki görsel"
              className="absolute top-1/2 right-0 z-[5] h-2/3 w-1/4 -translate-y-1/2 sm:hidden"
              onClick={goNext}
            />

            <div className="relative flex h-[70vh] w-full max-w-4xl items-center justify-center overflow-hidden px-4 sm:px-16">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={`slide-${activeIndex}-${activeItem.src}`}
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
                    <LightboxVideo
                      key={`lightbox-video-${activeItem.src}`}
                      src={activeItem.src}
                    />
                  ) : (
                    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                      <Image
                        src={activeItem.src}
                        alt=""
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

            <p className="text-brand-honey mt-4 text-xs font-bold tracking-[0.2em] uppercase">
              {activeIndex + 1} / {items.length}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
