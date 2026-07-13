"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { notifyRouteReady } from "@/lib/route-ready";

export function RouteReadySignal() {
  const pathname = usePathname();

  useEffect(() => {
    notifyRouteReady(pathname);
  }, [pathname]);

  return null;
}
