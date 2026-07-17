"use client";

import { useLayoutEffect, useRef } from "react";

/** Flat-top altıgende orta bantta güvenli yatay alan oranı (köşe kırpmasına pay). */
const HEX_SAFE_WIDTH_RATIO = 0.78;
/** Tek satır başlık için güvenli dikey alan oranı. */
const HEX_SAFE_HEIGHT_RATIO = 0.36;
/**
 * Cinzel + Türkçe İ noktasında geometrik ortalama optik olarak yukarı kayar;
 * hafif aşağı kaydırma metni optik merkeze alır.
 */
const OPTICAL_NUDGE_Y = "0.1em";

function toHexLabel(label: string) {
  return label.trim().toLocaleUpperCase("tr-TR");
}

function measureLabel(text: HTMLElement) {
  const { width, height } = text.getBoundingClientRect();
  return { width, height };
}

function fitLabelFontSize(
  container: HTMLElement,
  text: HTMLElement,
  displayLabel: string,
): void {
  const { width: cw, height: ch } = container.getBoundingClientRect();
  if (cw <= 0 || ch <= 0) return;

  const maxWidth = cw * HEX_SAFE_WIDTH_RATIO;
  const maxHeight = ch * HEX_SAFE_HEIGHT_RATIO;

  text.textContent = displayLabel;

  let lo = 8;
  let hi = Math.min(cw * 0.2, ch * 0.42, 40);
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

/** Petek hücresi başlığı — optik ortalı, hücreye sığan en büyük font. */
export function HoneycombCellLabel({ label }: HoneycombCellLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const displayLabel = toHexLabel(label);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let cancelled = false;

    const runFit = () => {
      if (cancelled) return;
      fitLabelFontSize(container, text, displayLabel);
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
  }, [displayLabel]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 grid place-items-center overflow-hidden"
    >
      <p
        ref={textRef}
        className="font-cinzel m-0 max-w-full text-center font-bold leading-none tracking-[0.02em] whitespace-nowrap"
        style={{ transform: `translateY(${OPTICAL_NUDGE_Y})` }}
      >
        {displayLabel}
      </p>
    </div>
  );
}
