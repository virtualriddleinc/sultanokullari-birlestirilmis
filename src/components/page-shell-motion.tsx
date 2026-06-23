"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHeroMedia } from "@/components/layout/page-hero-media";
import { SectionGrid } from "@/components/layout/section-grid";
import type { PageMedia } from "@/lib/menu-images";
import { cn } from "@/lib/cn";
import {
  fadeUpDelayedBodyVariants,
  fadeUpVariants,
  viewportInView,
} from "@/lib/animations";

export function PageShellMotion({
  title,
  intro,
  children,
  headingLayout = "default",
  media,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
  headingLayout?: "default" | "centerHero";
  media?: PageMedia;
}) {
  const reduce = useReducedMotion();
  const hero = headingLayout === "centerHero";

  const headingClass = cn(
    "font-cinzel text-3xl font-bold tracking-tight text-charcoal sm:text-4xl",
    hero && "text-balance text-center text-4xl sm:text-5xl",
  );

  const introClass = cn(
    "section-body mt-4 text-base sm:text-lg",
    hero && "mx-auto max-w-2xl text-center",
  );

  if (reduce) {
    return (
      <SectionGrid variant="white" className="py-fluid-8">
        <article>
          {media ? <PageHeroMedia media={media} priority /> : null}
          <h1 className={headingClass}>{title}</h1>
          {intro ? <p className={introClass}>{intro}</p> : null}
          <div className="text-charcoal/85 mt-10 space-y-6">{children}</div>
        </article>
      </SectionGrid>
    );
  }

  return (
    <SectionGrid variant="white" className="py-fluid-8">
      <article>
        {media ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            <PageHeroMedia media={media} priority />
          </motion.div>
        ) : null}
        <motion.h1
          className={headingClass}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          {title}
        </motion.h1>
        {intro ? (
          <motion.p
            className={introClass}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ delay: 0.04 }}
          >
            {intro}
          </motion.p>
        ) : null}
        <motion.div
          className="text-charcoal/85 mt-10 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportInView}
          variants={fadeUpDelayedBodyVariants}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </article>
    </SectionGrid>
  );
}
