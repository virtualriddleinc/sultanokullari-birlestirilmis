import Image from "next/image";
import type { PageMedia } from "@/lib/menu-images";
import { cn } from "@/lib/cn";

export function PageHeroMedia({
  media,
  className,
  priority,
}: {
  media: PageMedia;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-charcoal/10 bg-brand-honey/20 relative mb-8 aspect-[16/9] max-h-[28rem] w-full overflow-hidden rounded-[2rem] border",
        className,
      )}
    >
      {media.type === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          autoPlay
          loop
          muted
          playsInline
          aria-label={media.alt}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
        />
      )}
      <div className="from-charcoal/25 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
    </div>
  );
}
