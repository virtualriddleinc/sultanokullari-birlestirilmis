import type { GlobalConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { globalReadAccess } from "@/payload/access";
import { adminHintField } from "@/payload/fields/admin-hint-field";

export const SiteAyarlari: GlobalConfig = {
  slug: "site-ayarlari",
  label: "Site Ayarları",
  admin: {
    group: ADMIN_GROUPS.system,
    description: "Footer, sosyal medya ve genel iletişim bilgileri.",
  },
  access: globalReadAccess,
  fields: [
    adminHintField(
      "siteHint",
      "Bu ayarlar footer ve iletişim bölümlerinde kullanılır. Kayıttan sonra site anında güncellenir.",
    ),
    {
      name: "instagramHandle",
      type: "text",
      label: "Instagram kullanıcı adı",
      defaultValue: "sultanokullari",
    },
    {
      name: "instagramUrl",
      type: "text",
      label: "Instagram profil URL",
    },
    {
      name: "footerEmail",
      type: "email",
      label: "Footer e-posta",
    },
    {
      name: "footerPhone",
      type: "text",
      label: "Footer telefon",
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Sosyal medya bağlantıları",
      fields: [
        { name: "label", type: "text", label: "Etiket", required: true },
        { name: "href", type: "text", label: "URL", required: true },
      ],
    },
    {
      name: "defaultOgImage",
      type: "upload",
      relationTo: "media",
      label: "Varsayılan paylaşım görseli (OG)",
      admin: {
        description: "Sayfa özel görseli yoksa sosyal medya önizlemesinde kullanılır.",
      },
    },
  ],
};
