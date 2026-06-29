"use client";

import Link from "@/components/navigation/site-link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InstagramEmbed } from "@/components/instagram/instagram-embed";
import { InstagramGlyph } from "@/components/icons/instagram-glyph";
import {
  instagramHandle,
  instagramPosts,
  instagramProfileUrl,
} from "@/content/instagram";
import type { InstagramPost } from "@/content/instagram";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type HomeInstagramHorizontalProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  handle?: string;
  profileUrl?: string;
  posts?: InstagramPost[];
};

export function HomeInstagramHorizontal({
  eyebrow = "Sosyal medya vitrini",
  title = "Sosyal Medyada Biz",
  description = "Sultan Okulları'nın resmî sosyal medya hesaplarından okul atmosferi, etkinlikler ve kısa video paylaşımları — aşağı kaydırın, kareler yana doğru aksın.",
  handle = instagramHandle,
  profileUrl = instagramProfileUrl,
  posts = instagramPosts,
}: HomeInstagramHorizontalProps = {}) {
  const rootRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const section = rootRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsInView = entry.isIntersecting;
        setIsSectionInView(nextIsInView);

        if (nextIsInView) {
          setActiveVideoIndex(0);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = rootRef.current;
      const strip = stripRef.current;
      if (!section || !strip) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          let pinWrapWidth = strip.scrollWidth;
          let horizontalScrollLength = pinWrapWidth - window.innerWidth;

          const refresh = () => {
            pinWrapWidth = strip.scrollWidth;
            horizontalScrollLength = pinWrapWidth - window.innerWidth;
          };

          refresh();

          const tween = gsap.to(strip, {
            x: () => -Math.max(horizontalScrollLength, 0),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: section,
              pinSpacing: true,
              pinReparent: true,
              anticipatePin: 1,
              start: "center center",
              end: () => `+=${Math.max(horizontalScrollLength, 1)}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          const resizeObserver = new ResizeObserver(() => {
            ScrollTrigger.refresh();
          });
          resizeObserver.observe(strip);

          ScrollTrigger.addEventListener("refreshInit", refresh);

          // Instagram embed'leri asenkron büyüdüğü için layout settle olduktan
          // sonra ScrollTrigger'ı tazele.
          const settleTimer = window.setTimeout(
            () => ScrollTrigger.refresh(),
            600,
          );
          const onLoad = () => ScrollTrigger.refresh();
          window.addEventListener("load", onLoad);

          return () => {
            resizeObserver.disconnect();
            ScrollTrigger.removeEventListener("refreshInit", refresh);
            window.removeEventListener("load", onLoad);
            window.clearTimeout(settleTimer);
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="instagram"
      data-section="instagram"
      aria-label="Sultan Okulları Instagram galerisi"
      className="border-charcoal/10 relative z-[1] overflow-hidden border-y bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,240,133,0.72))]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.045] mix-blend-multiply" />
      <div className="bg-brand-green/10 pointer-events-none absolute top-12 -left-24 size-72 rounded-full blur-3xl" />
      <div className="bg-brand-honey/35 pointer-events-none absolute -right-24 bottom-12 size-72 rounded-full blur-3xl" />

      <div className="section-page-grid py-fluid-8 sm:py-fluid-16">
        <div className="section-page-grid__content">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-eyebrow">{eyebrow}</p>
              <h2 className="section-title mt-4">{title}</h2>
              <p className="section-body mt-4 max-w-xl">{description}</p>
            </div>
            <Link
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram'da ${handle}`}
              className="group border-charcoal/10 text-charcoal hover:border-brand-green/30 inline-flex items-center gap-2.5 rounded-full border bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:shadow-md"
            >
              <InstagramGlyph className="size-5 transition-transform group-hover:scale-110" />
              <span>{handle}</span>
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="horiz-gallery-wrapper relative mt-12 w-full overflow-hidden lg:mt-16"
      >
        <div
          ref={stripRef}
          className={cn(
            "horiz-gallery-strip flex flex-nowrap will-change-transform",
            // Mobile / reduced-motion fallback: native horizontal scroll-snap.
            "snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pt-2 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden",
            // Desktop with motion: GSAP takes over; disable native overflow.
            "lg:motion-safe:overflow-visible lg:motion-safe:px-[6vw]",
          )}
        >
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="project-wrap relative box-border flex w-[min(82vw,18rem)] shrink-0 snap-start px-2 sm:w-[20rem] md:w-[22rem] lg:w-[23rem] lg:px-3"
            >
              <div className="border-charcoal/10 relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border bg-white/82 p-3 shadow-[0_30px_100px_rgba(26,28,24,0.12)] backdrop-blur-xl">
                <InstagramEmbed
                  post={post}
                  shouldPlay={isSectionInView && activeVideoIndex === index}
                  onEnded={() =>
                    setActiveVideoIndex((index + 1) % instagramPosts.length)
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
