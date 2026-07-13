"use client";

import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Arapça Elif harfi — scroll ile kaligrafik çizim animasyonu. */
export function ElifCalligraphy({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const uid = useId().replace(/:/g, "");
  const brushId = `elif-brush-${uid}`;
  const gradId = `elif-grad-${uid}`;
  const maskId = `elif-mask-${uid}`;

  useGSAP(
    () => {
      const reveal = revealRef.current;
      if (!reveal) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(reveal, { strokeDasharray: 0, strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const length = reveal.getTotalLength();
        gsap.set(reveal, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(reveal, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 1.5,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none relative shrink-0 mix-blend-multiply opacity-95",
        className,
      )}
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox="635 30 100 410"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={brushId} x="-20%" y="-10%" width="140%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.1"
              numOctaves={3}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={2.5}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#021c0b" stopOpacity={0.95} />
            <stop offset="25%" stopColor="#021c0b" stopOpacity={1} />
            <stop offset="70%" stopColor="#032910" stopOpacity={0.9} />
            <stop offset="90%" stopColor="#06421c" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#085223" stopOpacity={0.1} />
          </linearGradient>
          <mask id={maskId}>
            <path
              ref={revealRef}
              d="M 685,30 Q 710,220 640,450"
              fill="none"
              stroke="white"
              strokeWidth={90}
              strokeLinecap="round"
            />
          </mask>
        </defs>
        <path
          d="M 685,40 L 720,110 Q 725,120 715,120 L 695,115 Q 700,250 660,400 Q 650,430 645,430 Q 640,430 645,410 Q 675,250 670,115 L 665,80 Z"
          fill={`url(#${gradId})`}
          mask={`url(#${maskId})`}
          filter={`url(#${brushId})`}
        />
      </svg>
    </div>
  );
}
