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

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "Haber",
    plural: "Haberler",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.content,
    hidden: hideFromInboxOnly,
    defaultColumns: ["title", "kind", "date", "featuredImage", "_status", "updatedAt"],
    description: "Ana sayfa Güncel bölümü (#guncel) ve /guncel/haberler sayfası.",
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug as string | undefined;
        if (slug) return buildPreviewUrl(`/guncel/haberler/${slug}`);
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
      createAuditAfterChange("news"),
    ],
    afterDelete: [
      ...guncelRevalidateHooks.afterDelete,
      createAuditAfterDelete("news"),
    ],
  },
  access: draftContentCollectionAccess,
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  fields: [
    adminHintField(
      "newsHint",
      "Yayınlanan haberler ana sayfa #guncel ve /guncel/haberler listesinde görünür. Slug ile detay sayfası otomatik oluşur. Editörler yalnızca taslak kaydedebilir.",
    ),
    siteLinkField("newsSiteLink", "/guncel/haberler", "Haberler listesini aç →"),
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
              name: "kind",
              type: "select",
              label: "Tür",
              defaultValue: "haber",
              required: true,
              options: [
                { label: "Haber", value: "haber" },
                { label: "Duyuru", value: "duyuru" },
              ],
              admin: {
                description:
                  "Sitede Haberler ve duyurular listesinde filtre için kullanılır.",
              },
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
              admin: {
                description: "Liste ve kartlarda görünen kısa metin.",
              },
            },
            {
              name: "body",
              type: "richText",
              label: "Tam metin",
              editor: lexicalEditor(),
              admin: {
                description: "Opsiyonel — ileride haber detay sayfasında kullanılacak.",
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
                description: "Opsiyonel — liste ve öne çıkan kartlarda kullanılır.",
              },
            },
          ],
        },
      ],
    },
    lastEditedByField,
  ],
};
