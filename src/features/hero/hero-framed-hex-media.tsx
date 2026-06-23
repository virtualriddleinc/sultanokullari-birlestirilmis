import Image from "next/image";
import cerceveFrame from "@/images/cini-cerceve.png";
import type { SiteMedia } from "@/content/site-media";
import { HEX_CLIP_PATH, HEX_MEDIA_COVER_SCALE } from "./geometry";

export type HeroFramedHexMediaProps = {
  media: SiteMedia;
  priority?: boolean;
  sizes?: string;
  focalPoint?: { x: number; y: number };
};

function FramedHexMediaInner({
  media,
  priority,
  sizes = "(max-width: 1024px) 60vw, 35vw",
  focalPoint,
}: HeroFramedHexMediaProps) {
  const objectPosition = focalPoint
    ? `${focalPoint.x}% ${focalPoint.y}%`
    : undefined;

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{ clipPath: HEX_CLIP_PATH }}
      >
        <div
          className="relative h-full w-full origin-center"
          style={{ transform: `scale(${HEX_MEDIA_COVER_SCALE})` }}
        >
          {media.kind === "video" ? (
            <video
              src={media.src}
              poster={media.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              style={objectPosition ? { objectPosition } : undefined}
              aria-label={media.alt}
            />
          ) : (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              style={objectPosition ? { objectPosition } : undefined}
            />
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <Image
          src={cerceveFrame}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      </div>
    </div>
  );
}

/** Hero ile birebir: band → konteyner → clip + cini çerçeve */
export function HeroFramedHexMedia(props: HeroFramedHexMediaProps) {
  return (
    <div className="hero-slide-media relative">
      <FramedHexMediaInner {...props} />
    </div>
  );
}

/** Yalnızca iç medya + çerçeve (animasyon sarmalayıcıları için) */
export function HeroFramedHexMediaContent(props: HeroFramedHexMediaProps) {
  return <FramedHexMediaInner {...props} />;
}
