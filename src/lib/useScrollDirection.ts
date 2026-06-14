"use client";

import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | "idle";

/**
 * Pencere scroll yönü. `threshold` px üzeri değişimde güncellenir.
 */
export function useScrollDirection(threshold = 8): ScrollDirection {
  const [dir, setDir] = useState<ScrollDirection>("idle");
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (Math.abs(delta) < threshold) return;
        setDir(delta > 0 ? "down" : "up");
        lastY.current = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return dir;
}
