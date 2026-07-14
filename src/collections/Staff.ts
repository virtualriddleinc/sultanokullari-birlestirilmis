import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { contentCollectionAccess, hasRole, type AppUser } from "@/payload/access";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";
import { staffRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

export const Staff: CollectionConfig = {
  slug: "staff",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "İdari Kadro Üyesi",
    plural: "İdari Kadro",
  },
  admin: {
    useAsTitle: "fullName",
    group: ADMIN_GROUPS.schools,
    hidden: hideFromInboxOnly,
    defaultColumns: ["fullName", "title", "department", "branchSlug", "isPublished", "updatedAt"],
    description: "/kurumsal/idari-kadro sayfasındaki yönetim ve şube kadroları.",
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    afterChange: [
      ...staffRevalidateHooks.afterChange,
      createAuditAfterChange("staff"),
    ],
    afterDelete: [
      ...staffRevalidateHooks.afterDelete,
      createAuditAfterDelete("staff"),
    ],
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "staffHint",
      "Yönetim kadrosu için birim: Yönetim, şube alanı boş. Şube kadroları için birim + şube slug seçin. Sürükle-bırak ile sıralayın. Yayında değil kayıtlar sitede görünmez.",
    ),
    siteLinkField("staffSiteLink", "/kurumsal/idari-kadro", "İdari kadro sayfasını aç →"),
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
      name: "fullName",
      type: "text",
      label: "Ad Soyad",
      required: true,
    },
    {
      name: "academicTitle",
      type: "text",
      label: "Unvan (Dr., Öğr. Gör. vb.)",
      admin: {
        description: "Ad Soyad'ın önüne eklenir. Örn: Dr., Prof. Dr., Öğr. Gör. Boş bırakılabilir.",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Görev",
      required: true,
    },
    {
      name: "education",
      type: "text",
      label: "En Yüksek Eğitim Derecesi",
      admin: {
        description: "Örn: X Üniversitesi Y Bölümü Doktorası. Boş bırakılabilir.",
      },
    },
    {
      name: "department",
      type: "select",
      label: "Birim",
      required: true,
      options: [
        { label: "Yönetim", value: "yonetim" },
        { label: "Eğitim Danışma Kurulu", value: "egitim_danisma" },
        { label: "Eğitim", value: "egitim" },
        { label: "İdari", value: "idari" },
      ],
    },
    {
      name: "branchSlug",
      type: "select",
      label: "Şube",
      admin: {
        description: "Yönetim ve Eğitim Danışma Kurulu için boş bırakın.",
      },
      options: [
        { label: "Sancaktepe – İstanbul", value: "sancaktepe" },
        { label: "Başiskele – Kocaeli", value: "basiskele" },
        { label: "Serdivan – Sakarya", value: "serdivan" },
        { label: "Sincan – Ankara", value: "sincan" },
        { label: "Mevlânâ – Konya", value: "mevlana" },
      ],
    },
    lastEditedByField,
  ],
};
