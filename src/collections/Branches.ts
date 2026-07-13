import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess, hasRole, type AppUser } from "@/payload/access";
import { branchRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { seoTab } from "@/payload/fields/seo-fields";

export const Branches: CollectionConfig = {
  slug: "branches",
  labels: {
    singular: "Şube",
    plural: "Şubeler",
  },
  admin: {
    useAsTitle: "name",
    group: ADMIN_GROUPS.schools,
    defaultColumns: ["name", "city", "district", "upcoming", "isPublished", "updatedAt"],
    description:
      "Kampüs sayfaları, iletişim formu, footer ve ana sayfa Okullarımız bölümü (#okullarimiz).",
    livePreview: {
      url: ({ data }) => {
        const citySlug = data?.citySlug as string | undefined;
        const campusSlug = data?.campusSlug as string | undefined;
        if (citySlug && campusSlug) {
          return buildPreviewUrl(`/okullarimiz/${citySlug}/${campusSlug}`);
        }
        return buildPreviewUrl("/#okullarimiz");
      },
    },
    listSearchableFields: ["name", "city", "district", "slug"],
  },
  defaultSort: "city",
  hooks: {
    beforeChange: [trackLastEditedBy],
    afterChange: [
      ...branchRevalidateHooks.afterChange,
      createAuditAfterChange("branches"),
    ],
    afterDelete: [
      ...branchRevalidateHooks.afterDelete,
      createAuditAfterDelete("branches"),
    ],
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "branchHint",
      "Şube kartları #okullarimiz, footer, iletişim formu ve kampüs sayfalarını etkiler. Yayında değil işaretli şubeler sitede görünmez.",
    ),
    siteLinkField("branchSiteLink", "/#okullarimiz", "Okullarımız bölümünü aç →"),
    {
      name: "isPublished",
      type: "checkbox",
      label: "Yayında",
      defaultValue: true,
      access: {
        update: ({ req }) => hasRole(req.user as AppUser | null, "admin"),
      },
      admin: {
        position: "sidebar",
        description: "Yalnızca yönetici yayına alabilir / kaldırabilir.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Genel",
          fields: [
            {
              name: "name",
              type: "text",
              label: "Okul adı",
              required: true,
            },
            {
              name: "city",
              type: "text",
              label: "İl",
              required: true,
            },
            {
              name: "district",
              type: "text",
              label: "İlçe / kampüs adı",
              required: true,
            },
            {
              name: "levels",
              type: "array",
              label: "Kademeler",
              fields: [
                {
                  name: "level",
                  type: "text",
                  label: "Kademe",
                  required: true,
                },
              ],
            },
            {
              name: "upcoming",
              type: "checkbox",
              label: "Yakında açılacak",
              defaultValue: false,
            },
          ],
        },
        {
          label: "İletişim",
          fields: [
            {
              name: "address",
              type: "textarea",
              label: "Adres",
              required: true,
            },
            {
              name: "phone",
              type: "text",
              label: "Telefon",
              required: true,
            },
          ],
        },
        {
          label: "Medya & Galeri",
          fields: [
            siteMediaField("previewMedia", "Ana sayfa önizleme medyası"),
            {
              name: "gallery",
              type: "array",
              label: "Galeri",
              fields: [siteMediaField("item", "Medya öğesi", { required: true })],
            },
          ],
        },
        seoTab,
        {
          label: "URL",
          fields: [
            {
              name: "slug",
              type: "text",
              label: "Slug",
              required: true,
              unique: true,
              admin: {
                description: "Etkinlik filtreleme ve dahili referanslar için.",
              },
            },
            {
              name: "citySlug",
              type: "text",
              label: "İl slug (URL)",
              required: true,
              admin: {
                description: "Örn. istanbul, kocaeli",
              },
            },
            {
              name: "campusSlug",
              type: "text",
              label: "Kampüs slug (URL)",
              required: true,
              admin: {
                description: "Örn. sancaktepe, basiskele",
              },
            },
          ],
        },
      ],
    },
    lastEditedByField,
  ],
};
