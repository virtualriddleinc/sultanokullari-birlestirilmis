"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ShieldCheck } from "lucide-react";
import { yemekhaneParagraphs } from "@/content/yemekhane";
import { yemekhaneMedia } from "@/content/site-media";
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

export function HomeYemekhane() {
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
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: -24 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={t(0.55)}
          className="order-2 lg:order-1"
        >
          <span className="bg-brand-honey mb-3 inline-block h-1 w-10 rounded-full sm:h-1.5 sm:w-14" />

          <SectionHeading
            eyebrow="Destek hizmetleri · Yemekhane"
            title="Kantinsiz okul, helâl ve sağlıklı beslenme"
            className="[&_.section-eyebrow]:text-charcoal/60 [&_.section-eyebrow]:font-semibold [&_.section-eyebrow]:tracking-wide [&_.section-title]:text-charcoal [&_.section-title]:text-xl [&_.section-title]:sm:text-2xl lg:[&_.section-title]:text-3xl"
          />

          <div className="border-charcoal/15 relative mt-5 space-y-4 border-l-2 pl-4 sm:mt-6 sm:space-y-5 sm:pl-5">
            {yemekhaneParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-charcoal/75 text-sm leading-relaxed sm:text-base"
              >
                {renderWithQuoteHighlights(paragraph)}
              </p>
            ))}
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, label }, index) => (
              <motion.li
                key={label}
                initial={reduce ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ ...t(0.45), delay: 0.15 + index * 0.08 }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-brand-honey p-3.5 shadow-[0_10px_24px_rgba(26,28,24,0.12)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(26,28,24,0.18)] sm:p-4"
              >
                <span
                  aria-hidden
                  className="bg-brand-green/0 group-hover:bg-brand-green/10 pointer-events-none absolute inset-0 transition-colors duration-300"
                />
                <span
                  aria-hidden
                  className="bg-brand-green text-charcoal relative grid size-10 shrink-0 place-items-center rounded-full shadow-[0_4px_10px_rgba(76,255,0,0.35)] sm:size-11"
                >
                  <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <span className="text-charcoal relative text-sm leading-snug font-semibold sm:text-base">
                  {label}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ ...t(0.55), delay: 0.08 }}
          className="order-1 lg:order-2"
        >
          <div className="relative overflow-hidden rounded-2xl bg-brand-honey shadow-[0_20px_50px_rgba(26,28,24,0.16)]">
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[4/3]">
              <Image
                src={yemekhaneMedia.src}
                alt={yemekhaneMedia.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </SectionGrid>
  );
}
