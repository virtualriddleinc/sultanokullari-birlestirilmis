"use client";

import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface HexProfileFrameProps {
  src?: string;
  alt: string;
  initials: string;
  size?: "md" | "lg";
  className?: string;
}

/**
 * Altıgen degrade çerçeve ve içinde yuvarlak profil fotoğrafı.
 * Fotoğraf yoksa isim baş harfleriyle (initials) fallback gösterir.
 */
export function HexProfileFrame({
  src,
  alt,
  initials,
  size = "md",
  className,
}: HexProfileFrameProps) {
  const gradientId = useId();
  const innerGradientId = `${gradientId}-inner`;

  const dimension = size === "lg" ? "h-32 w-32" : "h-24 w-24";

  return (
    <div
      className={cn("relative shrink-0", dimension, className)}
      aria-hidden={src ? undefined : true}
    >
      <svg
        viewBox="0 0 100 86.6"
        className="absolute inset-0 h-full w-full drop-shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
          <linearGradient
            id={innerGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--color-primary-light)" />
            <stop offset="100%" stopColor="rgba(255, 244, 214, 0.9)" />
          </linearGradient>
        </defs>
        <polygon
          points="25,1.5 75,1.5 98.5,43.3 75,85.1 25,85.1 1.5,43.3"
          fill={`url(#${innerGradientId})`}
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      <div className="absolute inset-[18%] overflow-hidden rounded-full bg-[var(--color-primary)] shadow-inner ring-2 ring-white/80">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={size === "lg" ? "128px" : "96px"}
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-sm font-semibold text-white">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
