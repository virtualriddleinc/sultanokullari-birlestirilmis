import type { Transition, Variants } from "framer-motion";

/** Ortak cubic-bezier — tüm süreler 0.4–0.8s aralığında. */
export const easeBrand = [0.25, 0.46, 0.45, 0.94] as const;

export const t = (duration: number): Transition => ({
  duration: Math.min(0.8, Math.max(0.4, duration)),
  ease: easeBrand,
});

export const viewportInView = { once: true, margin: "-100px" } as const;

export const viewportInViewTight = { once: true, margin: "-80px" } as const;

/** Sayfa geçişi — 0.35s (genel 0.4–0.8 kuralının dışında). */
const pageTransitionEase: Transition = {
  duration: 0.35,
  ease: easeBrand,
};

/** Sayfa geçişi (AnimatePresence) */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: pageTransitionEase,
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: pageTransitionEase,
  },
};

/** whileInView / stagger ile kullanım: initial="hidden" animate="visible" */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: t(0.55) },
  exit: { opacity: 0, y: -16, transition: t(0.45) },
};

export const fadeUpDelayedBodyVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: t(0.5) },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: t(0.5) },
  exit: { opacity: 0, transition: t(0.4) },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: t(0.55) },
  exit: { opacity: 0, x: 24, transition: t(0.45) },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: t(0.55) },
  exit: { opacity: 0, x: -24, transition: t(0.45) },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: t(0.5) },
  exit: { opacity: 0, scale: 0.95, transition: t(0.4) },
};

/** Scroll bölümü — kart stagger */
export const staggerSectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const sectionHeadingVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: t(0.65) },
};

export const sectionCardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: t(0.65) },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: t(0.45) },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

/** CTA hero — gecikme 0.6s */
export const heroCtaVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...t(0.55), delay: 0.6 },
  },
};

/** Modal */
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.6, transition: t(0.4) },
  exit: { opacity: 0, transition: t(0.35) },
};

export const modalPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: t(0.35),
  },
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};

export const springNav = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

/** Liste öğeleri — kısa geçiş (stagger çocukları). */
export const transitionShort: Transition = t(0.45);

/** @deprecated Yerine viewportInView / viewportInViewTight kullanın */
export const viewportOnce = viewportInViewTight;
