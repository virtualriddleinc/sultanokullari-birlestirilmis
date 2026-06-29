"use client";

import type { CSSProperties } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
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
};

export function AmbientSiteVideo({
  src,
  title,
  poster,
  className,
  style,
  autoPlay = true,
  preload = "metadata",
  playerKey,
}: AmbientSiteVideoProps) {
  return (
    <MediaPlayer
      key={playerKey ?? src}
      className={cn("site-vidstack-ambient", className)}
      src={src}
      title={title}
      poster={poster}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      load={preload === "none" ? "idle" : "visible"}
    >
      <MediaProvider
        mediaProps={{
          "aria-label": title,
          style,
        }}
      />
    </MediaPlayer>
  );
}
