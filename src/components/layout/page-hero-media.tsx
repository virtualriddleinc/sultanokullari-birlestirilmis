import type { ReactNode } from "react";
import Image from "next/image";
import { AmbientSiteVideo } from "@/components/media/ambient-site-video";
import type { PageMedia } from "@/lib/menu-images";
import { cn } from "@/lib/cn";

export function PageHeroMedia({
  media,
  className,
  priority,
  variant = "default",
  children,
}: {
  media: PageMedia;
  className?: string;
  priority?: boolean;
  variant?: "default" | "underHeader" | "overlay";
  children?: ReactNode;
}) {
  const underHeader = variant === "underHeader" || variant === "overlay";
  const overlay = variant === "overlay";

  return (
    <div
      className={cn(
        underHeader
          ? "page-hero-media--under-header"
          : "border-charcoal/10 bg-brand-honey/20 relative mb-8 aspect-[16/9] max-h-[28rem] w-full overflow-hidden rounded-[2rem] border",
        overlay && "page-hero-media--overlay",
        className,
      )}
    >
      {media.type === "video" ? (
        <AmbientSiteVideo
          className="absolute inset-0 h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          title={media.alt}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={underHeader ? "100vw" : "(max-width: 1024px) 100vw, 896px"}
          className="object-cover"
        />
      )}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t",
          overlay
            ? "from-charcoal/90 via-charcoal/35 to-charcoal/10"
            : "from-charcoal/25 via-transparent to-transparent",
        )}
      />
      {children ? (
        <div className="page-hero-media__content">{children}</div>
      ) : null}
    </div>
  );
}
