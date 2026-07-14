"use client";

import React from "react";
import { useRowLabel } from "@payloadcms/ui";

const SLOT_LABELS: Record<string, string> = {
  "top-left": "Kademeler (sol üst)",
  "top-right": "Nebevî Eğitim (sağ üst)",
  right: "Akademik Gelişim (sağ)",
  bottom: "Rehberlik (alt)",
};

export default function MissionDecorCellRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    slot?: string;
    tagline?: string;
  }>();

  const slotLabel = data?.slot
    ? (SLOT_LABELS[data.slot] ?? data.slot)
    : `Hücre ${String(rowNumber).padStart(2, "0")}`;
  const tagline = data?.tagline?.trim();

  return (
    <span>
      {slotLabel}
      {tagline ? ` — ${tagline}` : ""}
    </span>
  );
}
