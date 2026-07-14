"use client";

import type { CSSProperties } from "react";
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  useMediaState,
} from "@vidstack/react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

export type AmbientSiteVideoProps = {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  autoPlay?: boolean;
  preload?: "none" | "metadata" | "auto";
  playerKey?: string;
  /** Doğal video en-boy oranı (width/height) hazır olunca çağrılır */
  onMediaAspect?: (width: number, height: number) => void;
};

function AmbientVideoAspectProbe({
  onMediaAspect,
}: {
  onMediaAspect?: (width: number, height: number) => void;
}) {
  const width = useMediaState("width");
  const height = useMediaState("height");

  useEffect(() => {
    if (!onMediaAspect) return;
    if (
      typeof width === "number" &&
      typeof height === "number" &&
      width > 0 &&
      height > 0
    ) {
      onMediaAspect(width, height);
    }
  }, [height, onMediaAspect, width]);

  return null;
}

export function AmbientSiteVideo({
  src,
  title,
  poster,
  className,
  style,
  autoPlay = true,
  preload = "metadata",
  playerKey,
  onMediaAspect,
}: AmbientSiteVideoProps) {
  const safeSrc = src?.trim() || "";
  if (!safeSrc) return null;

  const safePoster = poster?.trim() || undefined;
  const load =
    preload === "none" ? "idle" : preload === "auto" ? "eager" : "visible";

  return (
    <MediaPlayer
      key={playerKey ?? safeSrc}
      className={cn("site-vidstack-ambient", className)}
      src={safeSrc}
      title={title}
      poster={safePoster}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      // Next DevTools, Vidstack GroupedLog içindeki Proxy state'i stringify edemez
      logLevel="silent"
      load={load}
      posterLoad={safePoster ? "eager" : undefined}
    >
      <MediaProvider
        mediaProps={{
          "aria-label": title,
          style,
        }}
      />
      {safePoster ? (
        <Poster className="site-vidstack-ambient__poster" alt={title} />
      ) : null}
      {onMediaAspect ? (
        <AmbientVideoAspectProbe onMediaAspect={onMediaAspect} />
      ) : null}
    </MediaPlayer>
  );
}
