import Link from "@/components/navigation/site-link";
import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type HeroInfoCardCta = {
  href: string;
  label: string;
};

export type HeroInfoCardProps = {
  tagline?: string;
  titleLines?: string[];
  description?: string;
  secondaryDescription?: string;
  cta?: HeroInfoCardCta;
  footer?: ReactNode;
  /** Alt navigasyon bandı yüksekliğini korur (hero ile aynı kart oranı) */
  preserveFooterSpace?: boolean;
  /** Alt navigasyon bandı yalnızca lg+ (masaüstü kart footer) */
  footerVisibility?: "always" | "desktop-only";
  titleAs?: "h1" | "h2";
  children?: ReactNode;
  className?: string;
};

const CARD_CLASS =
  "hero-slide-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#fff085] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_12px_32px_rgb(0_0_0/0.08)]";

/** Hero bilgi kartı pill etiketi — slider + kart ortak stil */
export const HERO_SLIDE_TAGLINE_CLASS =
  "hero-slide-tagline shrink-0 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.6875rem] font-bold tracking-widest text-[#1a1c18] uppercase shadow-sm lg:px-3.5 lg:py-1.5 lg:text-[0.75rem] xl:px-4 xl:py-2 xl:text-xs";

/** Hero etiketi — mobil: tam genişlik band; masaüstü: pill (hero slider ile özdeş) */
export function HeroSlideTagline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  if (children == null || children === "") return null;

  return (
    <>
      <div
        className={cn(
          "hero-slide-tagline-band mb-3 w-full max-w-full min-w-0 lg:hidden xl:mb-4",
          className,
        )}
      >
        <span className="hero-slide-tagline hero-slide-tagline--in-band">
          {children}
        </span>
      </div>
      <span
        className={cn(
          HERO_SLIDE_TAGLINE_CLASS,
          "mb-3 hidden max-w-full min-w-0 lg:inline-flex xl:mb-4",
          className,
        )}
      >
        {children}
      </span>
    </>
  );
}

const HERO_SLIDE_TITLE_CLASS =
  "font-cinzel w-full min-w-0 max-w-full shrink-0 text-[clamp(1.35rem,2.6vw,2.75rem)] leading-[1.12] font-bold tracking-tight text-[#1a1c18] max-lg:text-center max-lg:text-pretty lg:text-left lg:text-balance";

export const HERO_SLIDE_DESCRIPTION_CLASS =
  "w-full min-w-0 max-w-full shrink-0 text-[length:var(--text-sm)] leading-relaxed font-medium text-pretty text-[#1a1c18]/80 max-lg:text-center lg:text-[length:var(--text-base)] lg:leading-snug lg:text-left";

export function HeroSlideTitle({
  lines,
  as: Tag = "h2",
  className,
  flow = false,
}: {
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
  /** Satırları zorla bölmek yerine, mevcut genişliğe göre kelime kelime doğal sar */
  flow?: boolean;
}) {
  if (flow) {
    return (
      <Tag className={cn(HERO_SLIDE_TITLE_CLASS, className)}>
        <span className="hero-slide-title-flow">{lines.join(" ")}</span>
      </Tag>
    );
  }

  return (
    <Tag className={cn(HERO_SLIDE_TITLE_CLASS, className)}>
      <span className="hero-slide-title-flow lg:hidden">{lines.join(" ")}</span>
      <span className="hidden lg:contents">
        {lines.map((line, index) => (
          <span key={`title-line-${index}`} className="block">
            {line}
          </span>
        ))}
      </span>
    </Tag>
  );
}

function HeroInfoCardFooterSpacer() {
  return (
    <div
      className="hero-slide-footer flex items-center gap-2 border-t border-black/10 pt-3 xl:gap-4 xl:pt-4"
      aria-hidden="true"
    >
      <div className="hero-slide-footer-controls flex shrink-0 gap-1 xl:gap-2">
        <div className="hero-slide-footer-btn h-9 w-9 shrink-0 opacity-0 xl:h-10 xl:w-10" />
        <div className="hero-slide-footer-btn h-9 w-9 shrink-0 opacity-0 xl:h-10 xl:w-10" />
      </div>
      <span className="hero-slide-footer-counter ml-1 shrink-0 text-xs opacity-0 xl:ml-2 xl:text-sm">
        00<span className="mx-0.5 opacity-50">/</span>00
      </span>
      <div className="hero-slide-footer-progress ml-1 flex flex-1 items-center gap-1.5 opacity-0 xl:ml-2 xl:gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-black/10" />
      </div>
    </div>
  );
}

export function HeroInfoCardShell({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "hero-slide-fill relative z-[10] min-h-0 min-w-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function HeroInfoCard({
  tagline = "",
  titleLines = [],
  description = "",
  secondaryDescription,
  cta,
  footer,
  preserveFooterSpace = false,
  footerVisibility = "always",
  titleAs: TitleTag = "h2",
  children,
  className,
}: HeroInfoCardProps) {
  const footerContent =
    footer ?? (preserveFooterSpace ? <HeroInfoCardFooterSpacer /> : null);

  return (
    <div className={cn(CARD_CLASS, className)}>
      <div className="hero-slide-content flex min-h-0 flex-1 flex-col justify-center pt-8 pb-2 lg:pt-6 xl:pt-8">
        {children ?? (
          <div className="flex min-h-0 w-full max-w-full min-w-0 flex-col items-stretch">
            <HeroSlideTagline>{tagline}</HeroSlideTagline>

            <div className="hero-slide-copy">
              <HeroSlideTitle
                as={TitleTag}
                lines={titleLines}
                className="mb-3"
              />

              <p className={cn(HERO_SLIDE_DESCRIPTION_CLASS, "mb-4 xl:mb-6")}>
                {description}
              </p>

              {secondaryDescription ? (
                <p className="mb-4 w-full min-w-0 shrink-0 text-[length:var(--text-sm)] leading-relaxed font-medium text-pretty text-[#1a1c18]/65 lg:text-[length:var(--text-base)] lg:leading-snug xl:mb-6">
                  {secondaryDescription}
                </p>
              ) : null}
            </div>

            {cta ? (
              <Link
                href={cta.href}
                className="hero-slide-cta group flex shrink-0 items-center justify-between gap-3 rounded-full bg-[#1a1c18] py-2 pr-1.5 pl-4 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] lg:gap-4 lg:py-2 lg:pl-5 xl:py-2.5 xl:pr-2 xl:pl-6"
              >
                <span className="hero-slide-cta-label text-[length:var(--text-sm)] font-bold tracking-wide text-white lg:text-[length:var(--text-base)]">
                  {cta.label}
                </span>
                <span className="hero-slide-cta-icon flex shrink-0 items-center justify-center rounded-full bg-white/20 p-1.5 backdrop-blur-md transition-transform group-hover:translate-x-1 lg:p-2 xl:p-2">
                  <ArrowRight
                    size={20}
                    strokeWidth={2.5}
                    className="text-[#4cff00]"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ) : null}
          </div>
        )}
      </div>

      {footerContent ? (
        <div
          className={cn(
            "hero-slide-content hero-slide-content--band relative z-20 mt-auto shrink-0 pt-2 pb-4 sm:pb-5 lg:pb-6 xl:pt-3 xl:pb-8",
            footerVisibility === "desktop-only" && "hidden lg:block",
          )}
        >
          {footerContent}
        </div>
      ) : null}
    </div>
  );
}
