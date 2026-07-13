"use client";

import { motion, useReducedMotion } from "framer-motion";
import { OrnamentalQuote } from "@/components/egitim/ornamental-quote";
import { nebevi } from "@/content/egitim";
import { fadeUpVariants, viewportInView } from "@/lib/animations";

export function NebeviScroll() {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-fluid-8">
      <blockquote className="rounded-lg border border-teal-200 bg-teal-50/60 px-fluid-4 py-fluid-3 text-[length:var(--text-sm)] text-zinc-900 italic">
        {nebevi.quote}
      </blockquote>
      {reduce ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-fluid-4 shadow-sm md:p-fluid-6">
          <p className="text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
            {nebevi.introLead}
          </p>
          <OrnamentalQuote
            quote={nebevi.hadithQuote}
            className="mt-fluid-4 rounded-2xl px-fluid-4 py-fluid-5"
          />
          <p className="mt-fluid-4 text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
            {nebevi.introTrail}
          </p>
        </section>
      ) : (
        <motion.section
          className="rounded-xl border border-zinc-200 bg-white p-fluid-4 shadow-sm md:p-fluid-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportInView}
          variants={fadeUpVariants}
        >
          <p className="text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
            {nebevi.introLead}
          </p>
          <OrnamentalQuote
            quote={nebevi.hadithQuote}
            className="mt-fluid-4 rounded-2xl px-fluid-4 py-fluid-5"
          />
          <p className="mt-fluid-4 text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
            {nebevi.introTrail}
          </p>
        </motion.section>
      )}
      {nebevi.intro.slice(1).map((p, i) =>
        reduce ? (
          <section
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-fluid-4 shadow-sm md:p-fluid-6"
          >
            <p className="text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
              {p}
            </p>
          </section>
        ) : (
          <motion.section
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-fluid-4 shadow-sm md:p-fluid-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportInView}
            variants={fadeUpVariants}
          >
            <p className="text-[length:var(--text-sm)] leading-relaxed text-zinc-700">
              {p}
            </p>
          </motion.section>
        ),
      )}
    </div>
  );
}
