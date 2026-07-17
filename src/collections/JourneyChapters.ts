import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS, JOURNEY_ICON_OPTIONS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess } from "@/payload/access";
import { homeRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { hexFocalPickerField } from "@/payload/fields/hex-focal-picker-field";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

export const JourneyChapters: CollectionConfig = {
  slug: "journey-chapters",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "Yolculuk Bölümü",
    plural: "Yolculuk",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.home,
    hidden: hideFromInboxOnly,
    defaultColumns: ["eyebrow", "title", "updatedAt"],
    description:
      "Ana sayfa Yolculuk bölümü panelleri (#yolculuk). Sürükle-bırak ile sıralayın.",
    livePreview: {
      url: () => buildPreviewUrl("/#yolculuk"),
    },
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    afterChange: [
      ...homeRevalidateHooks.afterChange,
      createAuditAfterChange("journey-chapters"),
    ],
    afterDelete: [
      ...homeRevalidateHooks.afterDelete,
      createAuditAfterDelete("journey-chapters"),
    ],
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
    hexFocalPickerField("hexFocalPicker", { mediaPathPrefix: "chapterMedia" }),
    {
      name: "focalPoint",
      type: "group",
      label: "Odak noktası",
      fields: [
        {
          name: "x",
          type: "number",
          label: "X (%)",
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: { step: 1 },
        },
        {
          name: "y",
          type: "number",
          label: "Y (%)",
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: { step: 1 },
        },
      ],
    },
    {
      name: "mediaScale",
      type: "number",
      label: "Yakınlaştırma",
      defaultValue: 1,
      min: 1,
      max: 3,
      admin: {
        step: 0.05,
      },
    },
    {
      name: "mediaAspect",
      type: "number",
      label: "Medya en-boy oranı",
      admin: {
        readOnly: true,
      },
    },
    lastEditedByField,
  ],
};
