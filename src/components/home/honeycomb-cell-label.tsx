"use client";

import { useLayoutEffect, useRef } from "react";

/** Flat-top altıgende orta bantta güvenli yatay alan oranı (köşe kırpmasına pay). */
const HEX_SAFE_WIDTH_RATIO = 0.82;
/** Tek satır başlık için güvenli dikey alan oranı. */
const HEX_SAFE_HEIGHT_RATIO = 0.4;

function measureLabel(text: HTMLElement) {
  const { width, height } = text.getBoundingClientRect();
  return { width, height };
}

function fitLabelFontSize(
  container: HTMLElement,
  text: HTMLElement,
  label: string,
): void {
  const { width: cw, height: ch } = container.getBoundingClientRect();
  if (cw <= 0 || ch <= 0) return;

  const maxWidth = cw * HEX_SAFE_WIDTH_RATIO;
  const maxHeight = ch * HEX_SAFE_HEIGHT_RATIO;

  text.textContent = label;

  let lo = 8;
  let hi = Math.min(cw * 0.22, ch * 0.48, 44);
  let best = lo;

  while (hi - lo > 0.25) {
    const mid = (lo + hi) / 2;
    text.style.fontSize = `${mid}px`;
    const { width, height } = measureLabel(text);
    const fits = width <= maxWidth && height <= maxHeight;
    if (fits) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  text.style.fontSize = `${best}px`;
}

type HoneycombCellLabelProps = {
  label: string;
};

/** Petek hücresi başlığı — tam ortalı, hücreye sığan en büyük font. */
export function HoneycombCellLabel({ label }: HoneycombCellLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let cancelled = false;

    const runFit = () => {
      if (cancelled) return;
      fitLabelFontSize(container, text, label);
    };

    runFit();

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(runFit);
    }

    const observer = new ResizeObserver(runFit);
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [label]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 grid place-items-center overflow-hidden"
    >
      <p
        ref={textRef}
        className="font-cinzel m-0 max-w-full text-center font-bold leading-none tracking-tight whitespace-nowrap"
      >
        {label}
      </p>
    </div>
  );
}
