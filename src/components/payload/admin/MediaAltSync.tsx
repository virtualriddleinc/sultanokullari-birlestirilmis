"use client";

import React from "react";
import { useField, useFormFields } from "@payloadcms/ui";

type MediaValue =
  | number
  | string
  | {
      id?: number | string;
      alt?: string | null;
    }
  | null
  | undefined;

type Props = {
  /** clientProps — varsayılan: slideMedia.media */
  mediaPath?: string;
  /** clientProps — varsayılan: slideMedia.alt */
  altPath?: string;
};

function resolveMediaId(media: MediaValue): number | string | null {
  if (media == null) return null;
  if (typeof media === "number" || typeof media === "string") return media;
  if (typeof media === "object" && media.id != null) return media.id;
  return null;
}

function resolveMediaAlt(media: MediaValue): string | null {
  if (media && typeof media === "object" && typeof media.alt === "string") {
    const trimmed = media.alt.trim();
    return trimmed || null;
  }
  return null;
}

/**
 * Yüklenen / seçilen medyanın alternatif metnini ilgili alt alanına yazar.
 */
export default function MediaAltSync({
  mediaPath = "slideMedia.media",
  altPath = "slideMedia.alt",
}: Props) {
  const media = useFormFields(
    ([fields]) => fields[mediaPath]?.value as MediaValue,
  );
  const { setValue: setAlt } = useField<string>({ path: altPath });
  const lastSyncedId = React.useRef<number | string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const mediaId = resolveMediaId(media);

    if (mediaId == null) {
      lastSyncedId.current = null;
      return;
    }

    if (lastSyncedId.current === mediaId) return;

    async function syncAlt() {
      let altText = resolveMediaAlt(media);

      if (!altText && mediaId != null) {
        try {
          const res = await fetch(`/api/media/${mediaId}?depth=0`, {
            credentials: "include",
          });
          if (res.ok) {
            const doc = (await res.json()) as { alt?: string | null };
            if (typeof doc.alt === "string" && doc.alt.trim()) {
              altText = doc.alt.trim();
            }
          }
        } catch {
          // Sessizce yoksay — kullanıcı elle doldurabilir
        }
      }

      if (cancelled || !altText) return;
      lastSyncedId.current = mediaId;
      setAlt(altText);
    }

    void syncAlt();
    return () => {
      cancelled = true;
    };
  }, [media, setAlt]);

  return null;
}
