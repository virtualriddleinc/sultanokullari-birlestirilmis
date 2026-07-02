"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { InteractiveSiteVideo } from "@/components/media/interactive-site-video";
import { AnimatedLinkButton } from "@/components/ui/animated-link-button";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredVideo } from "@/content/site-media";
import type { SiteMedia } from "@/content/site-media";
import { t } from "@/lib/animations";
import beyazDesen from "@/images/beyaz-desen.svg";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export type HomeVideoProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  video?: SiteMedia;
};

export function HomeVideo({
  eyebrow = "Tanıtım · Sinematik bakış",
  title = "Okul atmosferini yakından görün.",
  description = "Sultan Okulları'nın sınıf, bahçe ve etkinlik atmosferinden seçilen kısa bir tanıtım kesiti.",
  ctaLabel = "Görüşme planla",
  ctaHref = "/iletisim",
  video = featuredVideo,
}: HomeVideoProps = {}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const posterScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const posterY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <SectionGrid
      ref={sectionRef}
      id="video"
      data-section="video"
      variant="honey"
      className="!bg-brand-honey !py-fluid-8 sm:!py-fluid-16 relative isolate flex min-h-[80svh] items-center overflow-hidden"
      innerClassName="flex flex-col gap-10"
      aria-label="Tanıtım"
    >
      {/* Beyaz desen — hero ile aynı; daha az zoom (150vw) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beyazDesen.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[150vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
        style={reduce ? undefined : { y: posterY, scale: posterScale }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,240,133,0.48),transparent_38rem),radial-gradient(circle_at_80%_85%,rgba(76,255,0,0.18),transparent_30rem)]" />
      </motion.div>

      <div className="relative z-[1]">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>

      <div className="relative z-[1] mx-auto grid w-full max-w-5xl place-items-center">
        <div className="border-charcoal/10 relative w-full overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,rgba(255,240,133,0.66),rgba(76,255,0,0.26))] shadow-[0_40px_140px_rgba(26,28,24,0.20)]">
          <div className="relative aspect-video w-full overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,240,133,0.24),transparent_60%)]">
            <InteractiveSiteVideo
              className="absolute inset-0 h-full w-full object-cover"
              src={video.src}
              poster={video.poster}
              title={video.alt}
              autoPlay={!reduce}
              loop
            />
            <div className="from-charcoal/34 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-white/8" />
          </div>
        </div>
        <span
          aria-hidden
          className="bg-brand-honey/40 pointer-events-none absolute -top-6 -left-6 hidden w-16 sm:block"
          style={{ aspectRatio: "2 / 1.7320508075688772", clipPath: HEX_CLIP }}
        />
        <span
          aria-hidden
          className="bg-brand-green/35 pointer-events-none absolute -right-6 -bottom-6 hidden w-24 sm:block"
          style={{ aspectRatio: "2 / 1.7320508075688772", clipPath: HEX_CLIP }}
        />
      </div>

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 28 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={t(0.6)}
        className="relative z-[1] isolate mt-4 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-3xl border border-charcoal/10 bg-brand-green px-6 py-8 shadow-[0_30px_100px_rgba(26,28,24,0.12)] sm:px-10 sm:py-10"
      >
        <p className="relative max-w-md text-lg font-semibold text-charcoal sm:text-2xl">
          Görüşmeye hazır mısınız?
        </p>
        <AnimatedLinkButton
          href={ctaHref}
          variant="light"
          showArrow={false}
          className="relative px-8 py-4 text-base"
        >
          {ctaLabel}
          <ArrowUpRight
            className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden
          />
        </AnimatedLinkButton>
      </motion.div>
    </SectionGrid>
  );
}
