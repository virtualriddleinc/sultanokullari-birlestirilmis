import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { draftContentCollectionAccess } from "@/payload/access";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";
import { restrictEditorPublish } from "@/payload/hooks/publish-access";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { revalidateSitePaths } from "@/payload/hooks/revalidate-site";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

export const MediaItems: CollectionConfig = {
  slug: "media-items",
  labels: {
    singular: "Medya Öğesi",
    plural: "Medya Arşivi",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.content,
    hidden: hideFromInboxOnly,
    defaultColumns: ["title", "kind", "date", "featured", "_status", "updatedAt"],
    description: "/guncel/medya sayfası ve ana sayfa medya önizlemesi.",
    livePreview: {
      url: () => buildPreviewUrl("/guncel/medya"),
    },
    listSearchableFields: ["title", "caption", "alt"],
  },
  defaultSort: "-date",
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  hooks: {
    beforeChange: [trackLastEditedBy, restrictEditorPublish],
    afterChange: [
      () => {
        revalidateSitePaths("/guncel/medya", "/");
      },
      createAuditAfterChange("media-items"),
    ],
    afterDelete: [
      () => {
        revalidateSitePaths("/guncel/medya", "/");
      },
      createAuditAfterDelete("media-items"),
    ],
  },
  access: draftContentCollectionAccess,
  fields: [
    adminHintField(
      "mediaItemsHint",
      "Yayınlanan öğeler /guncel/medya arşivinde listelenir. Foto veya video seçin; etiketler filtre için kullanılır.",
    ),
    siteLinkField("mediaItemsSiteLink", "/guncel/medya", "Medya arşivini aç →"),
    {
      name: "title",
      type: "text",
      label: "Başlık",
      required: true,
      maxLength: 120,
    },
    {
      name: "kind",
      type: "select",
      label: "Tür",
      defaultValue: "foto",
      required: true,
      options: [
        { label: "Fotoğraf", value: "foto" },
        { label: "Video", value: "video" },
      ],
    },
    {
      name: "date",
      type: "date",
      label: "Tarih",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "tags",
      type: "array",
      label: "Etiketler",
      fields: [
        {
          name: "tag",
          type: "text",
          label: "Etiket",
          required: true,
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Öne çıkan",
      defaultValue: false,
      admin: {
        description: "Ana sayfa veya arşivde öncelikli gösterim için.",
      },
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      label: "Medya dosyası",
      required: true,
    },
    {
      name: "alt",
      type: "text",
      label: "Alternatif metin",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
      label: "Açıklama",
    },
    lastEditedByField,
  ],
};
