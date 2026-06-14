"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springSnappy } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function MotionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div
        className={cn(
          "rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm",
          className,
        )}
      >
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm will-change-transform",
        className,
      )}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={springSnappy}
      onHoverStart={(e) =>
        (e.currentTarget as HTMLElement).classList.add("will-change-transform")
      }
      onHoverEnd={(e) =>
        (e.currentTarget as HTMLElement).classList.remove(
          "will-change-transform",
        )
      }
    >
      {children}
    </motion.div>
  );
}
