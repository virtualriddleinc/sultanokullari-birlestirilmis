import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { HERO_SLIDE_LIMITS } from "@/lib/hero-slide-limits";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess } from "@/payload/access";
import { homeRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { hexFocalPickerField } from "@/payload/fields/hex-focal-picker-field";

const { tagline, titleLine, description, buttonText } = HERO_SLIDE_LIMITS;

export const HeroSlides: CollectionConfig = {
  slug: "hero-slides",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "Hero Slaytı",
    plural: "1 · Hero Slaytları",
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    afterChange: [
      ...homeRevalidateHooks.afterChange,
      createAuditAfterChange("hero-slides"),
    ],
    afterDelete: [
      ...homeRevalidateHooks.afterDelete,
      createAuditAfterDelete("hero-slides"),
    ],
  },
  access: contentCollectionAccess,
  // Anında canlı: taslak yok — kayıt sonrası sitede hemen görünür (editör el kitabı).
  admin: {
    useAsTitle: "tagline",
    group: ADMIN_GROUPS.home,
    defaultColumns: ["tagline", "updatedAt"],
    description:
      "Ana sayfa en üstündeki kaydırmalı hero bölümü. Kayıt anında canlıya geçer (taslak yok). Listede sürükle-bırak ile sıralayın.",
    livePreview: {
      url: () => buildPreviewUrl("/"),
    },
  },
  fields: [
    adminHintField(
      "heroLayoutHint",
      "Rehberlik slaytı referans alınır: 3 satırlık tam cümle başlık + kısa açıklama. Limit aşılırsa sitede metin '...' ile kısaltılır.",
    ),
    adminHintField(
      "heroHint",
      "Ana sayfa hero slider. Sürükle-bırak ile sıra değişir; kayıt sonrası anında yansır.",
    ),
    siteLinkField("heroSiteLink", "/", "Ana sayfayı aç →"),
    {
      name: "tagline",
      type: "text",
      label: "Üst etiket",
      required: true,
      maxLength: tagline,
      admin: {
        description: `Tek satır pill; Rehberlik slaytı ~27 karakter. En fazla ${tagline} karakter.`,
      },
    },
    {
      name: "titleLine1",
      type: "text",
      label: "Başlık satırı 1",
      required: true,
      maxLength: titleLine,
      admin: {
        description: `Başlık satırı; satır başına ~20 karakter ideal. En fazla ${titleLine} karakter.`,
      },
    },
    {
      name: "titleLine2",
      type: "text",
      label: "Başlık satırı 2",
      required: true,
      maxLength: titleLine,
      admin: {
        description: `Başlık satırı; satır başına ~20 karakter ideal. En fazla ${titleLine} karakter.`,
      },
    },
    {
      name: "titleLine3",
      type: "text",
      label: "Başlık satırı 3",
      required: true,
      maxLength: titleLine,
      admin: {
        description: `Başlık satırı; satır başına ~20 karakter ideal. En fazla ${titleLine} karakter.`,
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Açıklama",
      required: true,
      maxLength: description,
      admin: {
        description: `Destek cümlesi; Rehberlik slaytı ~102 karakter. En fazla ${description} karakter.`,
      },
    },
    {
      name: "buttonText",
      type: "text",
      label: "Buton metni",
      required: true,
      maxLength: buttonText,
      admin: {
        description: `CTA butonu; tek satır. En fazla ${buttonText} karakter.`,
      },
    },
    {
      name: "buttonLink",
      type: "text",
      label: "Buton bağlantısı",
      required: true,
    },
    siteMediaField("slideMedia", "Slayt medyası", { required: true }),
    hexFocalPickerField(),
    {
      name: "focalPoint",
      type: "group",
      label: "Odak noktası",
      admin: {
        description:
          "Altıgen çerçevede görünen alanın merkezi (yüzde). Canlı seçici ile ayarlayın.",
      },
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
        description: "1x–3x. Canlı seçicideki kaydırıcı ile de ayarlanır.",
      },
    },
    {
      name: "mediaAspect",
      type: "number",
      label: "Medya en-boy oranı",
      admin: {
        readOnly: true,
        description:
          "Görsel/video yüklendiğinde otomatik hesaplanır (genişlik ÷ yükseklik).",
      },
    },
    {
      name: "displayDuration",
      type: "number",
      label: "Görüntülenme süresi (sn)",
      defaultValue: 6,
      admin: { position: "sidebar" },
    },
    lastEditedByField,
  ],
};
