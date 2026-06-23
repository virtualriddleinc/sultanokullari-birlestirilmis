"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransitionVariants } from "@/lib/animations";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransitionVariants}
        className="min-h-0 w-full min-w-0 flex-1 overflow-x-clip"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
