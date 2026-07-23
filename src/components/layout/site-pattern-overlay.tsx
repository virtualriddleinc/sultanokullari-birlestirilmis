import beyazDesen from "@/images/beyaz-desen.svg";
import { cn } from "@/lib/cn";

type SitePatternOverlayProps = {
  className?: string;
  /** 0–1 opacity; defaults match previous img overlays */
  opacity?: number;
};

/**
 * Dekoratif desen — CSS background ile (img değil).
 * Böylece LCP adayı olmaz ve Next preload enjekte etmez.
 */
export function SitePatternOverlay({
  className,
  opacity = 0.06,
}: SitePatternOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 w-[220vw] max-w-none -translate-x-1/2 -translate-y-1/2 select-none bg-center bg-no-repeat",
        className,
      )}
      style={{
        backgroundImage: `url(${beyazDesen.src})`,
        backgroundSize: "100% auto",
        opacity,
      }}
    />
  );
}
