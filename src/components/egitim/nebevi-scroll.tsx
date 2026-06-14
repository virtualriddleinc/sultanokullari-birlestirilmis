"use client";

import { motion, useReducedMotion } from "framer-motion";
import { nebevi } from "@/content/egitim";
import { fadeUpVariants, viewportInView } from "@/lib/animations";

export function NebeviScroll() {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-8">
      <blockquote className="rounded-lg border border-teal-200 bg-teal-50/60 px-4 py-3 text-sm text-zinc-900 italic">
        {nebevi.quote}
      </blockquote>
      {nebevi.intro.map((p, i) =>
        reduce ? (
          <section
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm leading-relaxed text-zinc-700">{p}</p>
          </section>
        ) : (
          <motion.section
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            initial="hidden"
            whileInView="visible"
            viewport={viewportInView}
            variants={fadeUpVariants}
          >
            <p className="text-sm leading-relaxed text-zinc-700">{p}</p>
          </motion.section>
        ),
      )}
    </div>
  );
}
