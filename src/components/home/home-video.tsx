"use client";

import { useRef } from "react";
import { Play } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { AnimatedLinkButton } from "@/components/ui/animated-link-button";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredVideo } from "@/content/site-media";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export function HomeVideo() {
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
      variant="accent"
      className="!py-fluid-8 sm:!py-fluid-16 relative isolate flex min-h-[80svh] items-center overflow-hidden"
      innerClassName="flex flex-col gap-10"
      aria-label="Tanıtım"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
        style={reduce ? undefined : { y: posterY, scale: posterScale }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,240,133,0.48),transparent_38rem),radial-gradient(circle_at_80%_85%,rgba(76,255,0,0.18),transparent_30rem)]" />
        <div className="absolute inset-0 bg-[url('/desen.svg')] bg-cover bg-center bg-no-repeat opacity-[0.10] mix-blend-multiply" />
      </motion.div>

      <SectionHeading
        eyebrow="Tanıtım · Sinematik bakış"
        title="Okul atmosferini yakından görün."
        description="Sultan Okulları'nın sınıf, bahçe ve etkinlik atmosferinden seçilen kısa bir tanıtım kesiti."
      />

      <div className="relative mx-auto grid w-full max-w-5xl place-items-center">
        <div className="border-charcoal/10 relative w-full overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,rgba(255,240,133,0.66),rgba(76,255,0,0.26))] shadow-[0_40px_140px_rgba(26,28,24,0.20)]">
          <div className="relative aspect-video w-full overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,240,133,0.24),transparent_60%)]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={featuredVideo.src}
              poster={featuredVideo.poster}
              autoPlay={!reduce}
              loop
              muted
              playsInline
              controls
              aria-label={featuredVideo.alt}
            />
            <div className="from-charcoal/34 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-white/8" />
            <div className="pointer-events-none absolute inset-0 flex h-full flex-col items-center justify-center gap-4">
              <motion.button
                type="button"
                className="from-brand-honey via-brand-green/90 to-brand-green text-charcoal grid w-28 place-items-center bg-gradient-to-br shadow-[0_30px_80px_rgba(26,28,24,0.28)] backdrop-blur-sm transition"
                style={{
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath: HEX_CLIP,
                }}
                whileHover={reduce ? undefined : { scale: 1.06 }}
                whileTap={reduce ? undefined : { scale: 0.96 }}
                aria-hidden
                tabIndex={-1}
              >
                <Play className="ml-1 size-9 fill-current" aria-hidden />
              </motion.button>
              <span className="bg-charcoal/45 rounded-full px-3 py-1 text-xs font-medium tracking-[0.32em] text-white/86 uppercase backdrop-blur-sm">
                Sultan Okulları · tanıtım
              </span>
            </div>
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

      <div className="flex flex-wrap items-center justify-between gap-5 pt-4">
        <p className="text-charcoal/70 max-w-md text-sm">
          Veliler için ayrıntılı görüşme planlamak veya ön kayıt almak
          isterseniz, sizi bekliyoruz.
        </p>
        <AnimatedLinkButton href="/iletisim" variant="light">
          Görüşme planla
        </AnimatedLinkButton>
      </div>
    </SectionGrid>
  );
}
