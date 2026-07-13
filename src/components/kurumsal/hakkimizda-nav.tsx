"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollToPlugin);

const sections = [
  { id: "kurulus", label: "Kuruluş" },
  { id: "kurucu-mesaji", label: "Kurucu mesajı" },
  { id: "zaman-cizelgesi", label: "Zaman çizelgesi" },
] as const;

export function HakkimizdaNav() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof sections)[number]["id"]>(
    sections[0].id,
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(s.id);
          }
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    if (reduce) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "auto" });
      }
      return;
    }
    gsap.to(window, {
      duration: 1,
      ease: "power3.inOut",
      scrollTo: { y: `#${id}`, offsetY: 120 },
    });
  };

  return (
    <nav
      aria-label="Hakkımızda bölüm gezinmesi"
      className="mb-fluid-8 w-fit max-w-full rounded-full border border-zinc-200 bg-white/85 p-1.5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-md"
    >
      <ul className="flex items-center gap-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollTo(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-full px-fluid-4 py-2 text-[length:var(--text-xs)] font-semibold tracking-[0.18em] uppercase transition",
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "text-zinc-700 hover:text-[var(--color-primary)]",
                )}
              >
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
