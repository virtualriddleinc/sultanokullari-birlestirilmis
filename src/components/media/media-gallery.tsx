import Image from "next/image";
import { InteractiveSiteVideo } from "@/components/media/interactive-site-video";
import type { SiteMedia } from "@/content/site-media";
import { cn } from "@/lib/cn";

type MediaGalleryProps = {
  title: string;
  items: readonly SiteMedia[];
  /** Geniş şerit + daha büyük başlık ve görsel hücreleri. */
  size?: "default" | "large";
};

export function MediaGallery({
  title,
  items,
  size = "default",
}: MediaGalleryProps) {
  const isLarge = size === "large";

  return (
    <section
      className={cn(
        "mt-10",
        isLarge &&
          "relative left-1/2 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 px-0 sm:mt-14",
      )}
      aria-label={title}
    >
      <h2
        className={cn(
          "font-semibold text-[var(--color-primary)]",
          isLarge ? "text-xl tracking-tight sm:text-2xl" : "text-lg",
        )}
      >
        {title}
      </h2>
      <ul
        className={cn(
          "grid",
          isLarge
            ? "mt-6 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
            : "mt-4 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items.map((item, index) => (
          <li
            key={`${item.src}-${index}`}
            className={cn(
              "relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm",
              isLarge
                ? "rounded-3xl shadow-md ring-1 ring-zinc-200/70"
                : "rounded-2xl",
            )}
          >
            {item.kind === "video" ? (
              <InteractiveSiteVideo
                className="h-full w-full object-cover"
                src={item.src}
                poster={item.poster}
                title={item.alt}
              />
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={
                  isLarge
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, min(640px, 33vw)"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className="object-cover"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
