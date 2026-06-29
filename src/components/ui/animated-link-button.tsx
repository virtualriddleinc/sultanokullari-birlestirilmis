"use client";

import Link from "@/components/navigation/site-link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { t } from "@/lib/animations";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-lg shadow-emerald-900/10 hover:bg-[var(--color-primary-dark)]",
  secondary:
    "border border-zinc-200 bg-white/80 text-zinc-900 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]",
  light:
    "bg-white text-[var(--color-primary)] shadow-lg shadow-emerald-950/10 hover:bg-zinc-100",
};

export function AnimatedLinkButton({
  href,
  children,
  className,
  variant = "primary",
  showArrow = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  showArrow?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className="inline-flex"
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={t(0.4)}
    >
      <Link
        href={href}
        className={cn(
          "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
          variants[variant],
          className,
        )}
      >
        {children}
        {showArrow ? (
          <motion.span
            className="inline-flex"
            whileHover={reduce ? undefined : { x: 4 }}
            transition={t(0.4)}
          >
            <ArrowRight className="size-4" aria-hidden />
          </motion.span>
        ) : null}
      </Link>
    </motion.span>
  );
}
