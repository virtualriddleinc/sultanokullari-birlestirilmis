import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { contentCollectionAccess } from "@/payload/access";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import { staffRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";

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
    group: ADMIN_GROUPS.site,
    defaultColumns: ["fullName", "title", "department", "branchSlug", "updatedAt"],
    description: "/kurumsal/idari-kadro sayfasındaki yönetim ve şube kadroları.",
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    ...staffRevalidateHooks,
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "staffHint",
      "Yönetim kadrosu için birim: Yönetim, şube alanı boş. Şube kadroları için birim + şube slug seçin. Sürükle-bırak ile sıralayın. Fotoğraf kullanılmıyor; bunun yerine unvan, görev ve eğitim bilgisi öne çıkarılıyor.",
    ),
    siteLinkField("staffSiteLink", "/kurumsal/idari-kadro", "İdari kadro sayfasını aç →"),
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
        { label: "Sancaktepe", value: "sancaktepe" },
        { label: "Başiskele", value: "basiskele" },
        { label: "Serdivan", value: "serdivan" },
        { label: "Sincan", value: "sincan" },
      ],
    },
    lastEditedByField,
  ],
};
