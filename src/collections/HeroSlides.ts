import type { CollectionConfig, TextField, TextareaField } from "payload";

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
import { debugHeroSlideOrderBeforeChange } from "@/payload/hooks/debug-hero-order";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { hexFocalPickerField } from "@/payload/fields/hex-focal-picker-field";

const { tagline, titleLine, description, buttonText } = HERO_SLIDE_LIMITS;

const LIMITED_TEXT_FIELD =
  "@/components/payload/admin/LimitedTextField#default";

function limitedText(
  field: Omit<TextField, "type" | "hasMany"> & { type?: "text" },
  max: number,
): TextField {
  return {
    ...field,
    type: "text",
    hasMany: false,
    maxLength: max,
    admin: {
      ...field.admin,
      components: {
        Field: {
          path: LIMITED_TEXT_FIELD,
          clientProps: { maxLength: max },
        },
      },
    },
  } as TextField;
}

function limitedTextarea(
  field: Omit<TextareaField, "type"> & { type?: "textarea" },
  max: number,
): TextareaField {
  return {
    ...field,
    type: "textarea",
    maxLength: max,
    admin: {
      ...field.admin,
      components: {
        Field: {
          path: LIMITED_TEXT_FIELD,
          clientProps: { maxLength: max, multiline: true },
        },
      },
    },
  };
}

export const HeroSlides: CollectionConfig = {
  slug: "hero-slides",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "Hero Slaytı",
    plural: "1 · Hero Slaytları",
  },
  hooks: {
    beforeChange: [debugHeroSlideOrderBeforeChange, trackLastEditedBy],
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
    livePreview: {
      url: () => buildPreviewUrl("/"),
    },
  },
  fields: [
    siteLinkField("heroSiteLink", "/", "Ana sayfayı aç →"),
    limitedText(
      {
        name: "tagline",
        label: "Üst etiket",
        required: true,
      },
      tagline,
    ),
    limitedText(
      {
        name: "titleLine1",
        label: "Başlık satırı 1",
        required: true,
      },
      titleLine,
    ),
    limitedText(
      {
        name: "titleLine2",
        label: "Başlık satırı 2",
        required: true,
      },
      titleLine,
    ),
    limitedText(
      {
        name: "titleLine3",
        label: "Başlık satırı 3",
        required: true,
      },
      titleLine,
    ),
    limitedTextarea(
      {
        name: "description",
        label: "Açıklama",
        required: true,
      },
      description,
    ),
    limitedText(
      {
        name: "buttonText",
        label: "Buton metni",
        required: true,
      },
      buttonText,
    ),
    {
      name: "buttonLink",
      type: "text",
      label: "Buton bağlantısı",
      required: true,
    },
    siteMediaField("slideMedia", "Slayt medyası", {
      required: true,
      hideDescriptions: true,
      syncAltFromMedia: true,
    }),
    hexFocalPickerField(),
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
