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
  mediaLayout = "default",
  media,
  bodyMotion = "inView",
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
  headingLayout?: "default" | "centerHero";
  mediaLayout?: "default" | "underHeader" | "overlay";
  media?: PageMedia;
  bodyMotion?: "inView" | "immediate";
}) {
  const reduce = useReducedMotion();
  const hero = headingLayout === "centerHero";
  const underHeaderMedia = mediaLayout === "underHeader" && media;
  const overlayMedia = mediaLayout === "overlay" && media;

  const headingClass = cn(
    "font-cinzel font-bold tracking-tight text-charcoal text-[length:var(--text-3xl)]",
    hero && "text-balance text-center text-[length:var(--text-4xl)]",
    overlayMedia &&
      "text-balance text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] text-[length:var(--text-4xl)]",
  );

  const introClass = cn(
    "section-body mt-fluid-4 text-[length:var(--text-base)]",
    hero && "mx-auto max-w-2xl text-center",
    overlayMedia &&
      "text-white/90 max-w-2xl text-[length:var(--text-base)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
  );

  const sectionClass = cn(
    "py-fluid-8 sm:py-fluid-16",
    (underHeaderMedia || overlayMedia) && "pt-fluid-4 sm:pt-fluid-8",
  );

  const bodyClassName = "text-charcoal/85 mt-fluid-8 space-y-fluid-6";
  const bodyContent = (
    <div className={bodyClassName}>{children}</div>
  );

  const needsLogoClearance = !underHeaderMedia && !overlayMedia;

  const logoClearanceSpacer = needsLogoClearance ? (
    <div className="hero-logo-spacer lg:hidden" aria-hidden="true" />
  ) : null;

  const overlayHeadingContent = overlayMedia ? (
    <div className="page-shell-content">
      <h1 className={headingClass}>{title}</h1>
      {intro ? <p className={introClass}>{intro}</p> : null}
    </div>
  ) : null;

  const underHeaderHero = underHeaderMedia ? (
    <div className="page-hero-under-header">
      <PageHeroMedia media={media} variant="underHeader" priority />
    </div>
  ) : null;

  const overlayHero = overlayMedia ? (
    <div className="page-hero-under-header">
      <PageHeroMedia media={media} variant="overlay" priority>
        {overlayHeadingContent}
      </PageHeroMedia>
    </div>
  ) : null;

  if (reduce) {
    return (
      <>
        {underHeaderHero}
        {overlayHero}
        <SectionGrid
          variant="white"
          className={cn(sectionClass, overlayMedia && "page-shell-section")}
          innerClassName={overlayMedia ? "page-shell-content" : undefined}
        >
          <article>
            {logoClearanceSpacer}
            {media && !underHeaderMedia && !overlayMedia ? (
              <PageHeroMedia media={media} priority />
            ) : null}
            {!overlayMedia ? (
              <>
                <h1 className={headingClass}>{title}</h1>
                {intro ? <p className={introClass}>{intro}</p> : null}
              </>
            ) : null}
            {bodyContent}
          </article>
        </SectionGrid>
      </>
    );
  }

  return (
    <>
      {underHeaderMedia ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          {underHeaderHero}
        </motion.div>
      ) : null}
      {overlayMedia ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          {overlayHero}
        </motion.div>
      ) : null}
      <SectionGrid
        variant="white"
        className={cn(sectionClass, overlayMedia && "page-shell-section")}
        innerClassName={overlayMedia ? "page-shell-content" : undefined}
      >
        <article>
          {logoClearanceSpacer}
          {media && !underHeaderMedia && !overlayMedia ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
            >
              <PageHeroMedia media={media} priority />
            </motion.div>
          ) : null}
        {!overlayMedia ? (
          <>
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
          </>
        ) : null}
        {bodyMotion === "immediate" ? (
          <motion.div
            className={bodyClassName}
            initial="hidden"
            animate="visible"
            variants={fadeUpDelayedBodyVariants}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            className={bodyClassName}
            initial="hidden"
            whileInView="visible"
            viewport={viewportInView}
            variants={fadeUpDelayedBodyVariants}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        )}
      </article>
    </SectionGrid>
    </>
  );
}
