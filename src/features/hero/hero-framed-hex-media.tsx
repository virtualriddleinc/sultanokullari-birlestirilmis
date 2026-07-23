"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import cerceveFrame from "@/images/cini-cerceve.webp";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import type { SiteMedia } from "@/content/site-media";
import { cn } from "@/lib/cn";
import { HEX_CLIP_PATH, HEX_MEDIA_COVER_SCALE } from "./geometry";
import {
  computeMediaPlacement,
  type FocalPoint,
} from "./media-placement";

export type HeroFramedHexMediaProps = {
  media: SiteMedia;
  priority?: boolean;
  sizes?: string;
  focalPoint?: FocalPoint;
  mediaScale?: number;
  /** naturalWidth / naturalHeight — verilmezse yükleme anında ölçülür */
  mediaAspect?: number;
  interactive?: boolean;
  onActivate?: () => void;
  activateLabel?: string;
};

function FramedHexMediaInner({
  media,
  priority,
  sizes = "(max-width: 1024px) 60vw, 35vw",
  focalPoint,
  mediaScale,
  mediaAspect,
  interactive = false,
  onActivate,
  activateLabel,
}: HeroFramedHexMediaProps) {
  const [measuredAspect, setMeasuredAspect] = useState<number | undefined>();
  // LCP için önce poster; ambient video gecikmeli başlar
  const [ambientReady, setAmbientReady] = useState(false);

  useEffect(() => {
    setMeasuredAspect(undefined);
    setAmbientReady(false);
  }, [media.src]);

  useEffect(() => {
    if (media.kind !== "video") return;
    const delay = priority ? 2200 : 0;
    const id = window.setTimeout(() => setAmbientReady(true), delay);
    return () => window.clearTimeout(id);
  }, [media.kind, media.src, priority]);

  const resolvedAspect =
    typeof mediaAspect === "number" && mediaAspect > 0
      ? mediaAspect
      : measuredAspect;

  const { wrapperStyle } = computeMediaPlacement({
    mediaAspect: resolvedAspect,
    mediaScale,
    focalPoint,
  });

  const captureAspect = useCallback((width: number, height: number) => {
    if (!(width > 0 && height > 0)) return;
    const next = width / height;
    setMeasuredAspect((prev) =>
      prev && Math.abs(prev - next) < 0.0001 ? prev : next,
    );
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive || !onActivate) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full",
        interactive &&
          "cursor-pointer touch-manipulation transition-transform duration-300 hover:z-10 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1c18]",
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? activateLabel : undefined}
      onClick={interactive ? onActivate : undefined}
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{ clipPath: HEX_CLIP_PATH }}
      >
        <div
          className="relative h-full w-full origin-center overflow-hidden"
          style={{ transform: `scale(${HEX_MEDIA_COVER_SCALE})` }}
        >
          <div style={wrapperStyle}>
            {media.kind === "video" ? (
              <>
                {/*
                  clip-path + <video> Safari’de sıkça boş/koyu kutu bırakır.
                  Poster (veya yoksa video kaynağı yerine poster) alt katmanda
                  her zaman görünür kalsın; video üstte oynasın.
                */}
                {media.poster ? (
                  <Image
                    src={media.poster}
                    alt={media.alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    fetchPriority={priority ? "high" : "auto"}
                    className="object-cover"
                    onLoadingComplete={(img) => {
                      captureAspect(img.naturalWidth, img.naturalHeight);
                    }}
                  />
                ) : null}
                {ambientReady ? (
                  <AmbientSiteVideo
                    src={media.src}
                    poster={media.poster}
                    title={media.alt}
                    preload={priority ? "metadata" : "none"}
                    autoPlay
                    className="absolute inset-0 h-full w-full object-cover"
                    onMediaAspect={media.poster ? undefined : captureAspect}
                  />
                ) : null}
              </>
            ) : (
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes={sizes}
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                className="object-cover"
                onLoadingComplete={(img) => {
                  captureAspect(img.naturalWidth, img.naturalHeight);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <Image
          src={cerceveFrame}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          // Çerçeve dekoratif — LCP olmamalı; priority yalnızca iç medyada
          loading="lazy"
          className="object-contain"
        />
      </div>
    </div>
  );
}

/** Hero ile birebir: band → konteyner → clip + cini çerçeve */
export function HeroFramedHexMedia(props: HeroFramedHexMediaProps) {
  return (
    <div className="hero-slide-media relative">
      <FramedHexMediaInner {...props} />
    </div>
  );
}

/** Yalnızca iç medya + çerçeve (animasyon sarmalayıcıları için) */
export function HeroFramedHexMediaContent(props: HeroFramedHexMediaProps) {
  return <FramedHexMediaInner {...props} />;
}
