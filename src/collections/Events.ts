import type { CollectionConfig } from "payload";

import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { draftContentCollectionAccess } from "@/payload/access";
import { guncelRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";
import {
  applyScheduledPublish,
  restrictEditorPublish,
} from "@/payload/hooks/publish-access";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { publishAtField } from "@/payload/fields/publish-at-field";
import { seoFields } from "@/payload/fields/seo-fields";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Etkinlik",
    plural: "Etkinlikler",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.content,
    hidden: hideFromInboxOnly,
    defaultColumns: ["title", "date", "branch", "featuredImage", "_status", "updatedAt"],
    description: "Ana sayfa Güncel bölümü (#guncel) ve /guncel/etkinlikler sayfası.",
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug as string | undefined;
        if (slug) return buildPreviewUrl(`/guncel/etkinlikler/${slug}`);
        return buildPreviewUrl("/#guncel");
      },
    },
    listSearchableFields: ["title", "excerpt", "slug"],
  },
  defaultSort: "-date",
  hooks: {
    beforeChange: [trackLastEditedBy, applyScheduledPublish, restrictEditorPublish],
    afterChange: [
      ...guncelRevalidateHooks.afterChange,
      createAuditAfterChange("events"),
    ],
    afterDelete: [
      ...guncelRevalidateHooks.afterDelete,
      createAuditAfterDelete("events"),
    ],
  },
  access: draftContentCollectionAccess,
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  fields: [
    adminHintField(
      "eventsHint",
      "Yayınlanan etkinlikler #guncel ve /guncel/etkinlikler sayfasında listelenir. Slug ile detay sayfası oluşur.",
    ),
    siteLinkField("eventsSiteLink", "/guncel/etkinlikler", "Etkinlikler listesini aç →"),
    publishAtField,
    {
      type: "tabs",
      tabs: [
        {
          label: "İçerik",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Başlık",
              required: true,
              maxLength: 120,
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
              name: "excerpt",
              type: "textarea",
              label: "Özet",
              required: true,
            },
            {
              name: "body",
              type: "richText",
              label: "Detay metni",
              editor: lexicalEditor(),
              admin: {
                description: "Etkinlik detay sayfasında görünür.",
              },
            },
            {
              name: "branch",
              type: "relationship",
              relationTo: "branches",
              label: "Şube",
              admin: {
                description: "Boş bırakılırsa tüm şubeler için geçerlidir.",
              },
            },
          ],
        },
        {
          label: "SEO & Yayın",
          fields: [
            {
              name: "slug",
              type: "text",
              label: "Slug",
              unique: true,
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (value) return value;
                    if (!data?.title || typeof data.title !== "string") return value;
                    return data.title
                      .toLowerCase()
                      .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-");
                  },
                ],
              },
            },
            ...seoFields,
          ],
        },
        {
          label: "Medya",
          fields: [
            {
              name: "featuredImage",
              type: "upload",
              relationTo: "media",
              label: "Öne çıkan görsel",
              admin: {
                description: "Opsiyonel — öne çıkan etkinlik kartında kullanılır.",
              },
            },
          ],
        },
      ],
    },
    lastEditedByField,
  ],
};
