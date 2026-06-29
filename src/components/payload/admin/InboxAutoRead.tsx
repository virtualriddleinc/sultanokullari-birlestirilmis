"use client";

import React from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

type Props = {
  collectionSlug: "contact-messages" | "ik-applications";
};

/** Kayıt açıldığında yeni → okundu otomatik işaretle */
export default function InboxAutoRead({ collectionSlug }: Props) {
  const documentInfo = useDocumentInfo();
  const id = documentInfo?.id;
  const slug = documentInfo?.collectionSlug;
  const status = useFormFields(([fields]) => fields.status?.value as string | undefined);
  const marked = React.useRef(false);

  React.useEffect(() => {
    if (!id || slug !== collectionSlug || marked.current) return;
    if (status !== "new") return;

    marked.current = true;
    void fetch(`/api/${collectionSlug}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "read" }),
    });
  }, [id, slug, collectionSlug, status]);

  return null;
}
