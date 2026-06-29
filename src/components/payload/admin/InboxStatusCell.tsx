import React from "react";

const STATUS_LABELS: Record<string, string> = {
  new: "Yeni",
  read: "Okundu",
  archived: "Arşiv",
};

type Props = {
  cellData?: string;
};

/** Gelen kutusu durum badge — liste görünümü */
export default function InboxStatusCell({ cellData }: Props) {
  const status = cellData || "new";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span className={`sultan-inbox-badge sultan-inbox-badge--${status}`}>
      {label}
    </span>
  );
}
