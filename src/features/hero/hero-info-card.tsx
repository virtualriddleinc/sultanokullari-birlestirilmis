import Link from "next/link";
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
  titleAs?: "h1" | "h2";
  children?: ReactNode;
  className?: string;
};

const CARD_CLASS =
  "hero-slide-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#fff085] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_12px_32px_rgb(0_0_0/0.08)]";

function HeroInfoCardFooterSpacer() {
  return (
    <div
      className="flex items-center gap-2 border-t border-black/10 pt-3 xl:gap-4 xl:pt-4"
      aria-hidden="true"
    >
      <div className="h-9 w-9 shrink-0 opacity-0 xl:h-10 xl:w-10" />
      <div className="h-9 w-9 shrink-0 opacity-0 xl:h-10 xl:w-10" />
      <span className="ml-1 shrink-0 text-xs opacity-0 xl:ml-2 xl:text-sm">
        00<span className="mx-0.5 opacity-50">/</span>00
      </span>
      <div className="ml-1 flex flex-1 items-center gap-1.5 opacity-0 xl:ml-2 xl:gap-2">
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
            <span className="hero-slide-tagline mb-3 shrink-0 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.62rem] font-bold tracking-widest text-[#1a1c18] uppercase shadow-sm xl:mb-4 xl:px-4 xl:py-2 xl:text-xs">
              {tagline}
            </span>

            <div className="hero-slide-copy">
              <TitleTag className="font-cinzel mb-3 w-full min-w-0 shrink-0 text-[clamp(1.3rem,2.2vw,2.5rem)] leading-[1.15] font-bold tracking-tight text-balance text-[#1a1c18]">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </TitleTag>

              <p className="mb-4 w-full min-w-0 shrink-0 text-[length:var(--text-sm)] leading-relaxed font-medium text-pretty text-[#1a1c18]/80 xl:mb-6">
                {description}
              </p>

              {secondaryDescription ? (
                <p className="mb-4 w-full min-w-0 shrink-0 text-[length:var(--text-sm)] leading-relaxed font-medium text-pretty text-[#1a1c18]/65 xl:mb-6">
                  {secondaryDescription}
                </p>
              ) : null}
            </div>

            {cta ? (
              <Link
                href={cta.href}
                className="hero-slide-cta group flex shrink-0 items-center justify-between gap-4 rounded-full bg-[#1a1c18] py-1.5 pr-1.5 pl-4 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c18] xl:py-2 xl:pr-2 xl:pl-6"
              >
                <span className="hero-slide-cta-label text-[length:var(--text-sm)] font-bold tracking-wide text-white">
                  {cta.label}
                </span>
                <span className="flex items-center justify-center rounded-full bg-white/20 p-1.5 backdrop-blur-md transition-transform group-hover:translate-x-1 xl:p-2">
                  <ArrowRight
                    size={18}
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
        <div className="hero-slide-content hero-slide-content--band relative z-20 mt-auto shrink-0 pt-2 pb-4 sm:pb-5 lg:pb-6 xl:pt-3 xl:pb-8">
          {footerContent}
        </div>
      ) : null}
    </div>
  );
}
