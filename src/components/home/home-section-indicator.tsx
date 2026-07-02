"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const HEX_CLIP = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "yolculuk", label: "Yolculuk" },
  { id: "gayemiz", label: "Gâyemiz" },
  { id: "neden", label: "Neden Sultan?" },
  { id: "video", label: "Tanıtım" },
  { id: "yemekhane", label: "Yemekhane" },
  { id: "okullarimiz", label: "Okullarımız" },
  { id: "guncel", label: "Güncel" },
  { id: "kisa-yollar", label: "Kısa yollar" },
] as const;

export function HomeSectionIndicator() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -30% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <nav
      aria-label="Sayfa içi gezinme"
      className="pointer-events-none fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col items-end gap-3 rounded-full border border-zinc-200/70 bg-white/65 px-2 py-3 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[0.62rem] font-semibold tracking-[0.22em] uppercase transition-opacity",
                  isActive
                    ? "text-[var(--color-primary)] opacity-100"
                    : "opacity-0 group-hover:opacity-60",
                )}
                aria-hidden
              >
                {s.label}
              </span>
              <button
                type="button"
                onClick={() => scrollTo(s.id)}
                aria-label={s.label}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block transition",
                  isActive ? "scale-125" : "opacity-50 hover:opacity-100",
                )}
                style={{
                  width: "0.75rem",
                  aspectRatio: "2 / 1.7320508075688772",
                  clipPath: HEX_CLIP,
                  background: isActive
                    ? "var(--color-primary)"
                    : "rgba(15, 23, 42, 0.45)",
                }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
