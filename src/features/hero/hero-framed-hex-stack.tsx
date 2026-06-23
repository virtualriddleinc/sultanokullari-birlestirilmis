import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeroFramedHexStackProps = {
  children: ReactNode;
  className?: string;
};

/** Hero sağ hücre — medya bandı + boyutlandırma (hero-slider ile özdeş) */
export function HeroFramedHexStack({ children, className }: HeroFramedHexStackProps) {
  return (
    <div
      className={cn(
        "hero-slide-media-col relative z-[1] h-full min-h-0 w-full min-w-0 overflow-visible",
        className,
      )}
    >
      <div className="hero-slide-media-band">
        {children}
      </div>
    </div>
  );
}
