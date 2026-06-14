"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springSnappy } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function GlassPanel({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  const reduce = useReducedMotion();
  const classes = cn(
    "rounded-3xl border border-charcoal/10 bg-white/75 shadow-[0_24px_80px_rgba(26,28,24,0.08)] backdrop-blur-xl",
    className,
  );

  if (reduce || !interactive) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <motion.div
      className={classes}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={springSnappy}
    >
      {children}
    </motion.div>
  );
}
