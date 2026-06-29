"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "@payloadcms/ui";

type Props = {
  collectionSlug: "contact-messages" | "ik-applications";
};

/** Liste görünümünde seçili kayıtları toplu okundu / arşiv */
export default function InboxBulkActions({ collectionSlug }: Props) {
  const router = useRouter();
  const { selectedIDs, count } = useSelection();
  const [pending, setPending] = React.useState(false);

  if (!count) return null;

  async function bulkUpdate(status: string) {
    setPending(true);
    try {
      await Promise.all(
        selectedIDs.map(async (id) => {
          await fetch(`/api/${collectionSlug}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status }),
          });
        }),
      );
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="sultan-inbox-bulk">
      <span className="sultan-inbox-bulk__label">{count} seçili</span>
      <button
        type="button"
        disabled={pending}
        className="sultan-inbox-actions__btn"
        onClick={() => bulkUpdate("read")}
      >
        Okundu işaretle
      </button>
      <button
        type="button"
        disabled={pending}
        className="sultan-inbox-actions__btn sultan-inbox-actions__btn--muted"
        onClick={() => bulkUpdate("archived")}
      >
        Arşivle
      </button>
    </div>
  );
}

export function ContactInboxBulkActions() {
  return <InboxBulkActions collectionSlug="contact-messages" />;
}

export function IkInboxBulkActions() {
  return <InboxBulkActions collectionSlug="ik-applications" />;
}
