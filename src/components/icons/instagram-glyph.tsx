import type { SVGProps } from "react";

/**
 * Instagram orijinal glyph (kameralı yuvarlak köşeli kare).
 * Marka renk gradient'i (sarı → pembe → mor) ile renkli; varsayılan boyut 24.
 * `useGradient={false}` verilirse currentColor (monochrome) renderlenir.
 */
export function InstagramGlyph({
  useGradient = true,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { useGradient?: boolean }) {
  const gradientId = "ig-glyph-gradient";

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Instagram"
      className={className}
      fill="none"
      {...props}
    >
      {useGradient ? (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="25%" stopColor="#fa7e1e" />
            <stop offset="50%" stopColor="#d62976" />
            <stop offset="75%" stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
      ) : null}

      {/* Yuvarlak köşeli kare çerçeve */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke={useGradient ? `url(#${gradientId})` : "currentColor"}
        strokeWidth="2"
      />
      {/* Lens */}
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke={useGradient ? `url(#${gradientId})` : "currentColor"}
        strokeWidth="2"
      />
      {/* Flash noktası */}
      <circle
        cx="17.5"
        cy="6.5"
        r="1.25"
        fill={useGradient ? `url(#${gradientId})` : "currentColor"}
      />
    </svg>
  );
}
