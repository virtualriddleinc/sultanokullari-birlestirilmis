"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HexBadge } from "@/components/ui/hex-badge";
import { sectionCardVariants, springSnappy } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function FeatureCard({
  eyebrow,
  title,
  description,
  icon,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-2 text-base font-semibold text-zinc-950">
            {title}
          </h3>
        </div>
        {icon ? (
          <motion.div
            whileHover={reduce ? undefined : { rotate: 4, scale: 1.08 }}
            transition={springSnappy}
          >
            <HexBadge size="md">{icon}</HexBadge>
          </motion.div>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
    </>
  );

  if (reduce) {
    return (
      <div
        className={cn(
          "h-full rounded-3xl border border-zinc-200 bg-white/85 p-5 shadow-sm",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "h-full rounded-3xl border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur transition-colors",
        className,
      )}
      variants={sectionCardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={springSnappy}
    >
      {content}
    </motion.div>
  );
}
