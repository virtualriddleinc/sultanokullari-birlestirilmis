"use client";

import { useEffect, useState } from "react";

const MOBILE_HEX_QUERY = "(max-width: 1023px)";

/** Hero altıgen swipe ile tıklama çakışmasını önlemek için — yalnızca tablet-mobil (< lg). */
export function useMobileHexInteractive(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_HEX_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}
