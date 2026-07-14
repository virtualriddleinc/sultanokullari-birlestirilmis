import type { GlobalConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { adminOnlyGlobalAccess } from "@/payload/access";
import { adminHintField } from "@/payload/fields/admin-hint-field";
import { createGlobalAuditAfterChange } from "@/payload/hooks/audit-log-hooks";
import {
  revalidateSiteLayout,
  revalidateSitePaths,
} from "@/payload/hooks/revalidate-site";
import { hideUnlessAdmin } from "@/payload/admin-visibility";

const navItemFields = [
  {
    name: "label",
    type: "text" as const,
    label: "Etiket",
    required: true,
  },
  {
    name: "href",
    type: "text" as const,
    label: "URL",
    required: true,
    admin: {
      description: "Örn. /egitim/anaokulu",
    },
  },
  {
    name: "icon",
    type: "text" as const,
    label: "İkon (lucide adı)",
    admin: {
      description: "Opsiyonel — örn. BookOpen, Compass",
    },
  },
];

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigasyon",
  admin: {
    hidden: hideUnlessAdmin,
    group: ADMIN_GROUPS.system,
    description:
      "Üst menü yönetimi. Bölümler doluysa kod içi menünün yerine geçer; boşsa kod menüsü + ek linkler kullanılır. Yalnızca yönetici.",
  },
  access: adminOnlyGlobalAccess,
  hooks: {
    afterChange: [
      () => {
        revalidateSiteLayout();
        revalidateSitePaths("/", "/sitemap");
      },
      createGlobalAuditAfterChange("navigation"),
    ],
  },
  fields: [
    adminHintField(
      "navHint",
      "Tam menü için 'Menü bölümleri'ni doldurun (kod menüsünü geçersiz kılar). Ya da yalnızca 'Ek menü bağlantıları' ile mevcut bölümlere link ekleyin.",
    ),
    {
      name: "useCmsMenu",
      type: "checkbox",
      label: "CMS menüsünü kullan (kod menüsünü geçersiz kıl)",
      defaultValue: false,
      admin: {
        description:
          "Açıkken aşağıdaki menü bölümleri site üst menüsünün kaynağı olur.",
      },
    },
    {
      name: "sections",
      type: "array",
      label: "Menü bölümleri",
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.useCmsMenu),
        description: "Her bölüm bir üst menü başlığıdır (Kurumsal, Eğitim…).",
      },
      fields: [
        {
          name: "key",
          type: "text",
          label: "Anahtar",
          required: true,
          admin: {
            description: "Benzersiz slug — örn. kurumsal, egitim",
          },
        },
        {
          name: "label",
          type: "text",
          label: "Bölüm etiketi",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Açıklama",
        },
        {
          name: "items",
          type: "array",
          label: "Bağlantılar",
          fields: navItemFields,
        },
      ],
    },
    {
      name: "extraLinks",
      type: "array",
      label: "Ek menü bağlantıları",
      admin: {
        description:
          "CMS menüsü kapalıyken kod menüsüne eklenir. CMS menüsü açıkken ilgili bölüme eklenmez — bölüm items kullanın.",
      },
      fields: [
        ...navItemFields,
        {
          name: "group",
          type: "select",
          label: "Menü grubu",
          defaultValue: "kurumsal",
          options: [
            { label: "Kurumsal", value: "kurumsal" },
            { label: "Eğitim", value: "egitim" },
            { label: "Akademik", value: "akademik" },
            { label: "Rehberlik", value: "rehberlik" },
            { label: "Okullar", value: "okullar" },
            { label: "Yaşam", value: "yasam" },
            { label: "Güncel", value: "guncel" },
          ],
        },
      ],
    },
  ],
};
