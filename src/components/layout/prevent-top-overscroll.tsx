"use client";

import { useEffect } from "react";

function isVerticallyScrollable(el: Element): boolean {
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  if (overflowY !== "auto" && overflowY !== "scroll" && overflowY !== "overlay") {
    return false;
  }
  return el.scrollHeight > el.clientHeight + 1;
}

export function PreventTopOverscroll() {
  useEffect(() => {
    let lastTouchY = 0;

    const onTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchY - lastTouchY;
      lastTouchY = touchY;

      if (deltaY <= 0 || window.scrollY > 0) return;

      let node = event.target as Element | null;
      while (node && node !== document.documentElement) {
        if (isVerticallyScrollable(node) && node.scrollTop > 0) return;
        node = node.parentElement;
      }

      event.preventDefault();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return null;
}
