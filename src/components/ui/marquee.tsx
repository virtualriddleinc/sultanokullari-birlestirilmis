"use client";

import type { CSSProperties, ReactNode } from "react";
import { Children } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
  className,
  innerClassName,
  itemClassName,
}: {
  children: ReactNode;
  /** Tam tur süresi saniye cinsinden — büyük değer = yavaş akış. */
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  innerClassName?: string;
  itemClassName?: string;
}) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  if (reduce) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-6",
          className,
        )}
      >
        {items}
      </div>
    );
  }

  const sequence = [...items, ...items];

  const style: CSSProperties = {
    animationDuration: `${speed}s`,
    animationDirection: reverse ? "reverse" : "normal",
  };

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        pauseOnHover &&
          "[--marquee-play:running] hover:[--marquee-play:paused]",
        className,
      )}
      role="presentation"
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-6 pr-6 will-change-transform [animation-iteration-count:infinite] [animation-name:sultan-marquee] [animation-play-state:var(--marquee-play,running)] [animation-timing-function:linear]",
          innerClassName,
        )}
        style={style}
      >
        {sequence.map((node, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 items-center gap-6", itemClassName)}
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
