"use client";

import { useEffect } from "react";

const RETRY_DELAYS_MS = [0, 50, 150, 400, 900, 1600];

function scrollToHash(hash: string): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  // Header belge akışında (sticky değil); ofset bırakmak önceki bölümün
  // (ör. yemekhane yeşili) viewport üstünde kalmasına yol açar.
  // Bölüm başlangıcı ekranın üst kenarına hizalanır.
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "auto" });
  return true;
}

/**
 * Hash deep-link'lerde (#guncel, #okullarimiz) tarayıcı ilk scroll'u
 * layout/GSAP oturmadan yapabiliyor. Hedef element hazır olunca
 * bölüm üst kenarını viewport başına hizalar.
 */
export function HashAnchorScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const timers: number[] = [];

    const run = (hash: string) => {
      if (!hash || hash === "#") return;
      for (const delay of RETRY_DELAYS_MS) {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            if (window.location.hash !== hash) return;
            scrollToHash(hash);
          }, delay),
        );
      }
    };

    // Tarayıcının native hash scroll'unu bastırıp kendi hizamızı uygula
    if (window.location.hash) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      run(window.location.hash);
    }

    const onHashChange = () => run(window.location.hash);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
