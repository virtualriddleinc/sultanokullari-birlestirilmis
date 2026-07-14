"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck } from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import { yemekhaneParagraphs as staticParagraphs } from "@/content/yemekhane";
import { yemekhaneMedia as staticMedia } from "@/content/site-media";
import type { SiteMedia } from "@/content/site-media";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { t } from "@/lib/animations";

const highlights = [
  { icon: Leaf, label: "Kantinsiz okul" },
  { icon: ShieldCheck, label: "Gimdes Helâl Sertifikalı" },
] as const;

const QUOTED_TEXT_PATTERN = /[“"]([^”"]+)[”"]/g;

function renderWithQuoteHighlights(text: string) {
  const parts: Array<{ content: string; quoted: boolean }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(QUOTED_TEXT_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ content: text.slice(lastIndex, index), quoted: false });
    }
    parts.push({ content: match[1], quoted: true });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ content: text.slice(lastIndex), quoted: false });
  }

  return parts.map((part, index) =>
    part.quoted ? (
      <span
        key={index}
        className="text-charcoal bg-brand-honey/70 rounded-md px-1.5 py-0.5 font-semibold whitespace-normal"
      >
        {part.content}
      </span>
    ) : (
      <span key={index}>{part.content}</span>
    ),
  );
}

type HomeYemekhaneProps = {
  paragraphs?: string[];
  media?: SiteMedia;
};

export function HomeYemekhane({
  paragraphs = [...staticParagraphs],
  media = staticMedia,
}: HomeYemekhaneProps) {
  const reduce = useReducedMotion();

  return (
    <SectionGrid
      id="yemekhane"
      data-section="yemekhane"
      variant="accent"
      className="!bg-brand-green relative isolate overflow-hidden !py-fluid-4 sm:!py-fluid-8"
      innerClassName="relative z-[1]"
      aria-label="Yemekhane"
    >
      <div className="grid items-center gap-fluid-6 lg:grid-cols-2 lg:gap-fluid-8">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: -24 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={t(0.55)}
          className="order-2 lg:order-1"
        >
          <span className="bg-brand-honey mb-fluid-3 inline-block h-1 w-10 rounded-full md:h-1.5 md:w-14" />

          <SectionHeading
            eyebrow="Destek hizmetleri · Yemekhane"
            title="Kantinsiz okul, helâl ve sağlıklı beslenme"
            className="[&_.section-eyebrow]:text-charcoal/60 [&_.section-eyebrow]:font-semibold [&_.section-eyebrow]:tracking-wide [&_.section-title]:text-charcoal"
          />

          <div className="border-charcoal/15 relative mt-fluid-4 space-y-fluid-4 border-l-2 pl-fluid-4 md:mt-fluid-6 md:space-y-fluid-4 md:pl-fluid-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="section-body text-charcoal/75">
                {renderWithQuoteHighlights(paragraph)}
              </p>
            ))}
          </div>

          <ul className="mt-fluid-4 grid grid-cols-1 gap-fluid-3 md:mt-fluid-6 md:grid-cols-2">
            {highlights.map(({ icon: Icon, label }, index) => (
              <motion.li
                key={label}
                initial={reduce ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ ...t(0.45), delay: 0.15 + index * 0.08 }}
                className="group relative flex items-center gap-fluid-3 overflow-hidden rounded-2xl bg-brand-honey p-fluid-3 shadow-[0_10px_24px_rgba(26,28,24,0.12)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(26,28,24,0.18)] md:p-fluid-4"
              >
                <span
                  aria-hidden
                  className="bg-brand-green/0 group-hover:bg-brand-green/10 pointer-events-none absolute inset-0 transition-colors duration-300"
                />
                <span
                  aria-hidden
                  className="bg-brand-green text-charcoal relative grid size-10 shrink-0 place-items-center rounded-full shadow-[0_4px_10px_rgba(76,255,0,0.35)] md:size-11"
                >
                  <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <span className="text-charcoal relative text-[length:var(--text-sm)] leading-snug font-semibold md:text-[length:var(--text-base)]">
                  {label}
                </span>
              </motion.li>
            ))}
          </ul>

          <Link
            href="/yasam/sultanda-yasam"
            className="text-charcoal mt-fluid-4 inline-flex min-h-[44px] items-center gap-2 text-[length:var(--text-sm)] font-semibold underline-offset-4 hover:underline md:mt-fluid-6 md:text-[length:var(--text-base)]"
          >
            Helâl gıda ve kantinsiz okul
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ ...t(0.55), delay: 0.08 }}
          className="order-1 lg:order-2"
        >
          <div className="relative overflow-hidden rounded-2xl bg-brand-honey shadow-[0_20px_50px_rgba(26,28,24,0.16)]">
            <div className="relative aspect-[16/9] w-full md:aspect-[21/9] lg:aspect-[4/3]">
              {media.kind === "video" && !reduce ? (
                <AmbientSiteVideo
                  src={media.src}
                  poster={media.poster}
                  title={media.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  preload="metadata"
                />
              ) : (
                <Image
                  src={media.kind === "video" ? (media.poster ?? media.src) : media.src}
                  alt={media.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={false}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionGrid>
  );
}
