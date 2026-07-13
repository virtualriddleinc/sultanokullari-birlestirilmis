"use client";

import Image from "next/image";
import Link from "@/components/navigation/site-link";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useState } from "react";
import { FlaskConical, Users } from "lucide-react";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import { SectionGrid } from "@/components/layout/section-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  workshopItems,
  type WorkshopItem,
} from "@/content/workshops";
import {
  headerMedia,
  hexGalleryMedia,
  type SiteMedia,
} from "@/content/site-media";
import {
  springSnappy,
  staggerContainerVariants,
  staggerItemVariants,
  t,
  viewportInView,
} from "@/lib/animations";
import { cn } from "@/lib/cn";

const ATOLYE_ITEMS = workshopItems
  .filter((item) => item.category === "bilim" || item.category === "sanat")
  .slice(0, 5);

const KULUP_ITEMS = workshopItems
  .filter((item) => item.category === "sosyal")
  .slice(0, 3);

const KULUP_EXTRA = ["Okçuluk", "Yüzme"] as const;

const ATOLYE_MEDIA = headerMedia.atolyeler as SiteMedia;
const KULUP_MEDIA = hexGalleryMedia[6] as SiteMedia;

const panelReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: t(0.55),
  },
};

const dividerLineVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: t(0.55),
  },
};

function shortTitle(title: string) {
  return title
    .replace(/\s+atölyesi$/i, "")
    .replace(/\s+kulübü$/i, "")
    .trim();
}

function PanelMedia({
  media,
  reduce,
  className,
}: {
  media: SiteMedia;
  reduce: boolean | null;
  className?: string;
}) {
  if (media.kind === "video" && !reduce) {
    return (
      <AmbientSiteVideo
        src={media.src}
        poster={media.poster}
        title={media.alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        preload="metadata"
      />
    );
  }

  const src = media.kind === "video" ? (media.poster ?? media.src) : media.src;
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 1023px) 100vw, 50vw"
      className={cn("object-cover", className)}
      aria-hidden
    />
  );
}

function SplitPanel({
  tone,
  icon: Icon,
  label,
  blurb,
  items,
  extras,
  media,
  reduce,
  active,
  onActivate,
}: {
  tone: "atolye" | "kulup";
  icon: typeof FlaskConical;
  label: string;
  blurb: string;
  items: WorkshopItem[];
  extras?: readonly string[];
  media: SiteMedia;
  reduce: boolean | null;
  active: boolean;
  onActivate: () => void;
}) {
  const isAtolye = tone === "atolye";

  return (
    <motion.div
      variants={reduce ? undefined : panelReveal}
      className={cn(
        "home-atolye-split-panel group relative flex h-full min-h-[min(52svh,28rem)] overflow-hidden lg:min-h-[min(58svh,32rem)]",
        "transition-[filter,transform] duration-500 ease-out",
        active ? "z-[1] brightness-105" : "brightness-95 lg:brightness-100",
        "lg:hover:brightness-105",
      )}
      onPointerEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      role="group"
      aria-label={label}
    >
      <div className="absolute inset-0" aria-hidden>
        <PanelMedia
          media={media}
          reduce={reduce}
          className={cn(
            "scale-105 transition-transform duration-700 ease-out",
            active && "scale-110",
            "lg:group-hover:scale-110",
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            isAtolye
              ? "bg-[linear-gradient(165deg,rgba(12,28,22,0.78)_0%,rgba(12,28,22,0.42)_45%,rgba(76,255,0,0.22)_100%)]"
              : "bg-[linear-gradient(195deg,rgba(28,18,12,0.78)_0%,rgba(28,18,12,0.44)_45%,rgba(255,240,133,0.28)_100%)]",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light",
            isAtolye
              ? "bg-[radial-gradient(ellipse_at_20%_15%,rgba(76,255,0,0.45),transparent_50%)]"
              : "bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,240,133,0.55),transparent_52%)]",
          )}
        />
      </div>

      <div className="relative z-[1] flex min-h-[min(52svh,28rem)] flex-1 flex-col justify-between gap-fluid-6 p-fluid-5 sm:p-fluid-6 lg:min-h-[min(58svh,32rem)] lg:p-fluid-8">
        <div>
          <div className="flex items-center gap-fluid-3">
            <span
              className={cn(
                "inline-flex size-10 items-center justify-center sm:size-11",
                isAtolye ? "bg-brand-green/90 text-charcoal" : "bg-brand-honey/90 text-charcoal",
              )}
              style={{
                clipPath:
                  "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
              }}
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={2.25} />
            </span>
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.32em] text-white/75 uppercase">
              {label}
            </p>
          </div>
          <p className="mt-fluid-4 max-w-md text-[length:var(--text-sm)] leading-relaxed text-white/85 sm:text-[length:var(--text-base)]">
            {blurb}
          </p>
        </div>

        <motion.ul
          variants={reduce ? undefined : staggerContainerVariants}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={viewportInView}
          className="flex flex-col gap-fluid-2"
        >
          {items.map((item) => (
            <motion.li
              key={item.id}
              variants={reduce ? undefined : staggerItemVariants}
              className="flex items-center gap-fluid-3"
            >
              <span
                aria-hidden
                className={cn(
                  "h-px w-5 shrink-0 sm:w-7",
                  isAtolye ? "bg-brand-green" : "bg-brand-honey",
                )}
              />
              <span className="text-[length:var(--text-base)] font-medium tracking-tight text-white sm:text-[length:var(--text-lg)]">
                {shortTitle(item.title)}
              </span>
            </motion.li>
          ))}
          {extras?.map((extra) => (
            <motion.li
              key={extra}
              variants={reduce ? undefined : staggerItemVariants}
              className="flex items-center gap-fluid-3"
            >
              <span
                aria-hidden
                className="bg-brand-honey h-px w-5 shrink-0 sm:w-7"
              />
              <span className="text-[length:var(--text-base)] font-medium tracking-tight text-white/90 sm:text-[length:var(--text-lg)]">
                {extra}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

export type HomeAtolyelerPreviewProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function HomeAtolyelerPreview({
  eyebrow = "Keşif · Atölye ve Kulüpler",
  title = "Yetenekler burada filizlenir",
  description = "Bilimden sanata, sosyal sorumluluktan spora — her öğrenci kendi ilgi alanını keşfeder.",
  ctaLabel = "Atölyeler ve Kulüpler",
  ctaHref = "/atolyeler-ve-kulupler",
}: HomeAtolyelerPreviewProps = {}) {
  const reduce = useReducedMotion();
  const [activePanel, setActivePanel] = useState<"atolye" | "kulup">("atolye");

  return (
    <SectionGrid
      id="atolyeler"
      data-section="atolyeler"
      variant="white"
      className="border-charcoal/8 border-y"
      innerClassName="flex flex-col gap-fluid-6 sm:gap-fluid-8"
      aria-label="Atölyeler ve Kulüpler"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Link href={ctaHref} className="cta-pill hidden min-h-11 lg:inline-flex">
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        }
      />

      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={viewportInView}
        variants={
          reduce
            ? undefined
            : {
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.06 },
                },
              }
        }
        className="home-atolye-split relative isolate grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]"
      >
        <SplitPanel
          tone="atolye"
          icon={FlaskConical}
          label="Atölyeler"
          blurb="Robotik, sanat ve zihin oyunlarıyla yaparak öğrenme."
          items={ATOLYE_ITEMS}
          media={ATOLYE_MEDIA}
          reduce={reduce}
          active={activePanel === "atolye"}
          onActivate={() => setActivePanel("atolye")}
        />

        {/* Mobil: yatay ayırıcı / Desktop: dikey ayırıcı */}
        <motion.div
          variants={reduce ? undefined : dividerLineVariants}
          className="home-atolye-split-divider relative z-[2] flex items-center justify-center"
          aria-hidden
        >
          <span className="home-atolye-split-divider__line" />
          <span className="home-atolye-split-divider__badge">
            <motion.span
              animate={reduce ? undefined : { rotate: [0, 8, -8, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              }
              className="text-brand-green"
            >
              +
            </motion.span>
          </span>
        </motion.div>

        <SplitPanel
          tone="kulup"
          icon={Users}
          label="Kulüpler"
          blurb="Paylaşma, ifade ve sporla karakter ve yetenek gelişimi."
          items={KULUP_ITEMS}
          extras={KULUP_EXTRA}
          media={KULUP_MEDIA}
          reduce={reduce}
          active={activePanel === "kulup"}
          onActivate={() => setActivePanel("kulup")}
        />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={viewportInView}
        transition={reduce ? undefined : springSnappy}
        className="flex justify-center lg:hidden"
      >
        <Link href={ctaHref} className="cta-pill min-h-11 w-full max-w-sm justify-center">
          {ctaLabel} <span aria-hidden>→</span>
        </Link>
      </motion.div>
    </SectionGrid>
  );
}
