"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerSectionVariants, viewportInView } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function MotionSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <section className={className}>{children}</section>;
  }
  return (
    <motion.section
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportInView}
      variants={staggerSectionVariants}
    >
      {children}
    </motion.section>
  );
}
