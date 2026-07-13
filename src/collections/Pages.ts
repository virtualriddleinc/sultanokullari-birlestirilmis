import type { CollectionConfig } from "payload";

import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { draftContentCollectionAccess } from "@/payload/access";
import { pageRevalidateHooks } from "@/payload/hooks/collection-hooks";
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
import { siteMediaField } from "@/payload/fields/site-media-fields";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Sayfa",
    plural: "Sayfalar",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.content,
    defaultColumns: ["title", "slug", "pathPrefix", "template", "_status", "updatedAt"],
    description:
      "Site sayfaları — kurumsal, eğitim, rehberlik, yasal. Şablon seçin; sitede ilgili rotada görünür.",
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug as string | undefined;
        const prefix = (data?.pathPrefix as string | undefined) || "kurumsal";
        if (!slug) return buildPreviewUrl("/");
        if (prefix === "root") return buildPreviewUrl(`/${slug}`);
        return buildPreviewUrl(`/${prefix}/${slug}`);
      },
    },
  },
  defaultSort: "title",
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  hooks: {
    beforeChange: [trackLastEditedBy, applyScheduledPublish, restrictEditorPublish],
    afterChange: [
      ...pageRevalidateHooks.afterChange,
      createAuditAfterChange("pages"),
    ],
    afterDelete: [
      ...pageRevalidateHooks.afterDelete,
      createAuditAfterDelete("pages"),
    ],
  },
  access: draftContentCollectionAccess,
  fields: [
    adminHintField(
      "pagesHint",
      "pathPrefix + slug site URL'sini belirler (ör. egitim + anaokulu → /egitim/anaokulu). Taslak kayıtlar sitede görünmez; Canlı Önizleme kullanın. Bu alanlar sitede: ilgili sayfa içeriği.",
    ),
    siteLinkField("pagesSiteLink", "/kurumsal/hakkimizda", "Örnek kurumsal sayfa →"),
    publishAtField,
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
        description: "URL son segmenti: hakkimizda, anaokulu vb.",
      },
    },
    {
      name: "pathPrefix",
      type: "select",
      label: "URL öneki",
      defaultValue: "kurumsal",
      required: true,
      admin: {
        position: "sidebar",
        description: "Sayfanın site yolu: /{öneki}/{slug}",
      },
      options: [
        { label: "Kurumsal (/kurumsal/...)", value: "kurumsal" },
        { label: "Eğitim (/egitim/...)", value: "egitim" },
        { label: "Rehberlik (/rehberlik/...)", value: "rehberlik" },
        { label: "Akademik (/akademik/...)", value: "akademik" },
        { label: "Yaşam (/yasam/...)", value: "yasam" },
        { label: "Kök (/...)", value: "root" },
      ],
    },
    {
      name: "template",
      type: "select",
      label: "Sayfa şablonu",
      defaultValue: "kurumsal-blok",
      required: true,
      admin: {
        position: "sidebar",
        description: "Şablon, sitede hangi düzenin kullanılacağını belirler.",
      },
      options: [
        { label: "Kurumsal bloklar", value: "kurumsal-blok" },
        { label: "Overlay hikâye", value: "overlay-story" },
        { label: "Eğitim segmenti", value: "egitim-segment" },
        { label: "Rehberlik", value: "rehberlik" },
        { label: "Yasal metin", value: "yasal" },
      ],
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
      name: "storyEyebrow",
      type: "text",
      label: "Hikâye üst satır",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment" ||
          siblingData?.template === "rehberlik",
      },
    },
    {
      name: "storyMotto",
      type: "textarea",
      label: "Hikâye motto",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment" ||
          siblingData?.template === "rehberlik",
      },
    },
    {
      name: "storyRows",
      type: "array",
      label: "Hikâye satırları",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment" ||
          siblingData?.template === "rehberlik",
      },
      fields: [
        { name: "eyebrow", type: "text", label: "Satır başlığı" },
        { name: "text", type: "textarea", label: "Metin", required: true },
        {
          name: "highlights",
          type: "array",
          label: "Vurgular",
          fields: [{ name: "text", type: "text", label: "Vurgu", required: true }],
        },
      ],
    },
    {
      name: "galleryTitle",
      type: "text",
      label: "Galeri başlığı",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment",
      },
    },
    {
      name: "galleryDescription",
      type: "textarea",
      label: "Galeri açıklaması",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment",
      },
    },
    {
      name: "galleryItems",
      type: "array",
      label: "Galeri öğeleri",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment",
      },
      fields: [siteMediaField("item", "Görsel / video")],
    },
    {
      name: "heroMedia",
      type: "group",
      label: "Hero medya",
      admin: {
        description:
          "Medya yükleyin veya public klasöründeki dosya yolunu girin. Video için poster yolu ekleyin.",
        condition: (_, siblingData) =>
          siblingData?.template === "overlay-story" ||
          siblingData?.template === "egitim-segment" ||
          siblingData?.template === "rehberlik",
      },
      fields: [
        {
          name: "kind",
          type: "select",
          label: "Medya türü",
          defaultValue: "image",
          options: [
            { label: "Görsel", value: "image" },
            { label: "Video", value: "video" },
          ],
        },
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          label: "Yüklenen dosya",
        },
        {
          name: "src",
          type: "text",
          label: "Dosya yolu (public)",
          admin: {
            condition: (_, siblingData) => !siblingData?.media,
          },
        },
        {
          name: "alt",
          type: "text",
          label: "Alternatif metin",
        },
        {
          name: "poster",
          type: "text",
          label: "Video poster yolu",
          admin: {
            condition: (_, siblingData) => siblingData?.kind === "video",
          },
        },
      ],
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
