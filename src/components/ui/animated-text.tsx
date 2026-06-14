"use client";

import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";
import { t, viewportInViewTight } from "@/lib/animations";
import { cn } from "@/lib/cn";

const wordParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const wordChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: t(0.5) },
};

export function AnimatedText({
  text,
  className,
  as: level = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  /** Yalnızca U+0020 boşlukta böl; `\u00A0` ile birleştirilen ifadeler tek kelime kalır (satır kırılması kontrolü). */
  const words = text.split(/ +/).filter(Boolean);

  if (reduce) {
    const Comp = level;
    return <Comp className={className}>{text}</Comp>;
  }

  const shared = {
    className: cn(className),
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: viewportInViewTight,
    variants: wordParent,
  };

  const inner = words.map((w, i) => (
    <motion.span
      key={`${w}-${i}`}
      className="inline-block"
      variants={wordChild}
      style={{ willChange: "opacity, transform" }}
    >
      {w}
      {i < words.length - 1 ? "\u00A0" : null}
    </motion.span>
  ));

  if (level === "h2") return <motion.h2 {...shared}>{inner}</motion.h2>;
  if (level === "h3") return <motion.h3 {...shared}>{inner}</motion.h3>;
  if (level === "p") return <motion.p {...shared}>{inner}</motion.p>;
  return <motion.h1 {...shared}>{inner}</motion.h1>;
}
