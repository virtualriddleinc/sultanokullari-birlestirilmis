import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { contentCollectionAccess } from "@/payload/access";
import { adminHintField } from "@/payload/fields/admin-hint-field";

/** 25 MB — video dahil makul üst sınır */
const MAX_MEDIA_BYTES = 25 * 1024 * 1024;

const enforceMediaLimits: CollectionBeforeValidateHook = ({ req, data }) => {
  const file = req.file;
  if (file && typeof file.size === "number" && file.size > MAX_MEDIA_BYTES) {
    throw new Error(
      `Dosya boyutu en fazla ${Math.round(MAX_MEDIA_BYTES / (1024 * 1024))} MB olabilir.`,
    );
  }
  return data;
};

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Medya",
    plural: "Medya Kütüphanesi",
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "mimeType", "filesize", "updatedAt"],
    description: "Görsel ve video yüklemeleri — hero, yolculuk, şube galerisi vb.",
    listSearchableFields: ["filename", "alt"],
  },
  defaultSort: "-updatedAt",
  access: contentCollectionAccess,
  hooks: {
    beforeValidate: [enforceMediaLimits],
  },
  fields: [
    adminHintField(
      "mediaHint",
      "Alternatif metin (alt) erişilebilirlik için zorunludur. Hero için 1920×1080, kart görselleri için 800×600 önerilir. En fazla 25 MB; yalnızca görsel/video.",
    ),
    {
      name: "alt",
      type: "text",
      label: "Alternatif metin",
      required: true,
    },
    {
      name: "tags",
      type: "select",
      label: "Etiketler",
      hasMany: true,
      options: [
        { label: "Hero", value: "hero" },
        { label: "Şube", value: "branch" },
        { label: "Haber", value: "news" },
        { label: "Etkinlik", value: "event" },
        { label: "Kurumsal", value: "corporate" },
        { label: "Video", value: "video" },
      ],
      admin: {
        description: "Medya kütüphanesinde filtreleme için.",
      },
    },
  ],
  upload: {
    mimeTypes: ["image/*", "video/*"],
  },
};
