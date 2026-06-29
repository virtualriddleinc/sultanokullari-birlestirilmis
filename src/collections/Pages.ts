import type { CollectionConfig } from "payload";

import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess } from "@/payload/access";
import { pageRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { seoFields } from "@/payload/fields/seo-fields";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Sayfa",
    plural: "Kurumsal Sayfalar",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.site,
    defaultColumns: ["title", "slug", "updatedAt"],
    description:
      "Kurumsal ve bilgi sayfaları — hakkımızda, burs olanakları vb.",
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug as string | undefined;
        if (!slug) return buildPreviewUrl("/");
        if (slug === "hakkimizda") return buildPreviewUrl("/kurumsal/hakkimizda");
        if (slug === "burs-olanaklari") return buildPreviewUrl("/kurumsal/burs-olanaklari");
        return buildPreviewUrl(`/kurumsal/${slug}`);
      },
    },
  },
  defaultSort: "title",
  hooks: {
    beforeChange: [trackLastEditedBy],
    afterChange: pageRevalidateHooks.afterChange,
    afterDelete: pageRevalidateHooks.afterDelete,
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "pagesHint",
      "Slug değeri site URL'sini belirler: hakkimizda → /kurumsal/hakkimizda. Taslak kayıtlar sitede görünmez; Canlı Önizleme kullanın.",
    ),
    siteLinkField("pagesSiteLink", "/kurumsal/hakkimizda", "Örnek kurumsal sayfa →"),
    {
      name: "title",
      type: "text",
      label: "Sayfa başlığı",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "hakkimizda, burs-olanaklari vb.",
      },
    },
    {
      name: "intro",
      type: "textarea",
      label: "Giriş metni",
      admin: {
        description: "Sayfa hero altında görünen kısa açıklama.",
      },
    },
    {
      name: "sections",
      type: "blocks",
      label: "İçerik bölümleri",
      blocks: [
        {
          slug: "textSection",
          labels: { singular: "Metin bölümü", plural: "Metin bölümleri" },
          fields: [
            {
              name: "heading",
              type: "text",
              label: "Başlık",
            },
            {
              name: "anchorId",
              type: "text",
              label: "Çapa ID",
              admin: { description: "Örn. kurulus — sayfa içi linkler için." },
            },
            {
              name: "paragraphs",
              type: "array",
              label: "Paragraflar",
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  label: "Paragraf",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: "timelineSection",
          labels: { singular: "Zaman çizelgesi", plural: "Zaman çizelgeleri" },
          fields: [
            {
              name: "heading",
              type: "text",
              label: "Başlık",
            },
            {
              name: "items",
              type: "array",
              label: "Öğeler",
              fields: [
                { name: "year", type: "text", label: "Yıl", required: true },
                { name: "title", type: "text", label: "Başlık", required: true },
                { name: "detail", type: "textarea", label: "Detay", required: true },
              ],
            },
          ],
        },
        {
          slug: "cardGridSection",
          labels: { singular: "Kart listesi", plural: "Kart listeleri" },
          fields: [
            {
              name: "heading",
              type: "text",
              label: "Başlık",
            },
            {
              name: "note",
              type: "textarea",
              label: "Not / açıklama",
            },
            {
              name: "cards",
              type: "array",
              label: "Kartlar",
              fields: [
                { name: "label", type: "text", label: "Etiket", required: true },
                { name: "value", type: "text", label: "Değer", required: true },
              ],
            },
          ],
        },
        {
          slug: "richTextSection",
          labels: { singular: "Zengin metin", plural: "Zengin metinler" },
          fields: [
            {
              name: "heading",
              type: "text",
              label: "Başlık",
            },
            {
              name: "body",
              type: "richText",
              label: "İçerik",
              editor: lexicalEditor(),
            },
          ],
        },
      ],
    },
    ...seoFields,
    lastEditedByField,
  ],
};
