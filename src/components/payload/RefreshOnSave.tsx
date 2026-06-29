"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { startTransition, useCallback } from "react";

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:5001";

type PayloadRefreshOnSaveProps = {
  /** Yalnızca Payload taslak / canlı önizleme oturumunda etkinleştirilir */
  enabled?: boolean;
};

export function PayloadRefreshOnSave({
  enabled = false,
}: PayloadRefreshOnSaveProps) {
  const router = useRouter();

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  if (!enabled) return null;

  return <RefreshRouteOnSave refresh={refresh} serverURL={serverURL} />;
}
