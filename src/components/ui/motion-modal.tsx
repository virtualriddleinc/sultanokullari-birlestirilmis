"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { modalPanelVariants, t } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function MotionModal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="motion-modal-root"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={t(0.35)}
        >
          <motion.button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 bg-emerald-950/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduce ? 0.6 : 0.6 }}
            exit={{ opacity: 0 }}
            transition={t(0.4)}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            className={cn(
              "relative z-[101] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl",
              className,
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalPanelVariants}
            transition={reduce ? { duration: 0 } : undefined}
          >
            {title ? (
              <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            ) : null}
            <div className={title ? "mt-4" : ""}>{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
