import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS, JOURNEY_ICON_OPTIONS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess } from "@/payload/access";
import { homeRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";

export const JourneyChapters: CollectionConfig = {
  slug: "journey-chapters",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "Yolculuk Bölümü",
    plural: "Yolculuk Bölümleri",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.home,
    defaultColumns: ["eyebrow", "title", "updatedAt"],
    description:
      "Ana sayfa Yolculuk bölümü (#yolculuk). Listede sürükle-bırak ile sıralayın.",
    livePreview: {
      url: () => buildPreviewUrl("/#yolculuk"),
    },
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    ...homeRevalidateHooks,
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "journeyHint",
      "#yolculuk bölümü. Liste sırası sitedeki görünüm sırasını belirler.",
    ),
    siteLinkField("journeySiteLink", "/#yolculuk", "Yolculuk bölümünü aç →"),
    {
      name: "eyebrow",
      type: "text",
      label: "Üst satır (ör. 01 / Köken)",
      required: true,
    },
    {
      name: "title",
      type: "text",
      label: "Başlık",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      label: "Metin",
      required: true,
    },
    {
      name: "ctaLabel",
      type: "text",
      label: "Bağlantı etiketi",
      required: true,
    },
    {
      name: "ctaHref",
      type: "text",
      label: "Bağlantı adresi",
      required: true,
    },
    {
      name: "iconKey",
      type: "select",
      label: "İkon",
      options: [...JOURNEY_ICON_OPTIONS],
      required: true,
    },
    siteMediaField("chapterMedia", "Bölüm medyası", { required: true }),
    lastEditedByField,
  ],
};
