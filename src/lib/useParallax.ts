"use client";

import type { RefObject } from "react";
import { useScroll, useTransform } from "framer-motion";

/**
 * Dikey paralaks: scroll ilerlemesine göre `y` (px).
 * @param speed — çarpan; 0.3 tipik yavaş katman.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, speed: number) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [-60 * speed, 60 * speed]);
}
