import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { contentCollectionAccess } from "@/payload/access";
import { adminHintField } from "@/payload/fields/admin-hint-field";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Medya",
    plural: "Medya Kütüphanesi",
  },
  admin: {
    group: ADMIN_GROUPS.system,
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "mimeType", "filesize", "updatedAt"],
    description: "Görsel ve video yüklemeleri — hero, yolculuk, şube galerisi vb.",
    listSearchableFields: ["filename", "alt"],
  },
  defaultSort: "-updatedAt",
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "mediaHint",
      "Alternatif metin (alt) erişilebilirlik için zorunludur. Hero için 1920×1080, kart görselleri için 800×600 önerilir.",
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
  upload: true,
};
