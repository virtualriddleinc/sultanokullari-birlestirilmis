"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  staggerContainerVariants,
  staggerItemVariants,
  transitionShort,
  viewportInView,
} from "@/lib/animations";

export function StaggerList({
  children,
  className,
  as = "ul",
}: {
  children: ReactNode;
  className?: string;
  as?: "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const MotionTag = as === "ol" ? motion.ol : motion.ul;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportInView}
      variants={staggerContainerVariants}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <li className={className}>{children}</li>;
  return (
    <motion.li
      className={className}
      variants={staggerItemVariants}
      transition={transitionShort}
    >
      {children}
    </motion.li>
  );
}
