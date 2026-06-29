"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDocumentInfo } from "@payloadcms/ui";

type Props = {
  collectionSlug: "contact-messages" | "ik-applications";
};

/** Gelen kutusu kaydını hızlıca okundu / arşiv olarak işaretle */
export default function InboxQuickActions({ collectionSlug }: Props) {
  const router = useRouter();
  const documentInfo = useDocumentInfo();
  const id = documentInfo?.id;
  const slug = documentInfo?.collectionSlug;
  const [pending, setPending] = React.useState(false);

  if (!id || slug !== collectionSlug) return null;

  async function updateStatus(status: string) {
    setPending(true);
    try {
      const res = await fetch(`/api/${collectionSlug}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="sultan-inbox-actions">
      <button
        type="button"
        disabled={pending}
        className="sultan-inbox-actions__btn"
        onClick={() => updateStatus("read")}
      >
        {collectionSlug === "ik-applications" ? "İncelendi" : "Okundu"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="sultan-inbox-actions__btn sultan-inbox-actions__btn--muted"
        onClick={() => updateStatus("archived")}
      >
        Arşivle
      </button>
    </div>
  );
}
