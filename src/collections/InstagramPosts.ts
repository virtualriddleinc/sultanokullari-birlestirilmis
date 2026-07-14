import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess } from "@/payload/access";
import { homeRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import { siteMediaField } from "@/payload/fields/site-media-fields";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

export const InstagramPosts: CollectionConfig = {
  slug: "instagram-posts",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "Instagram Gönderisi",
    plural: "Instagram",
  },
  admin: {
    useAsTitle: "title",
    group: ADMIN_GROUPS.home,
    hidden: hideFromInboxOnly,
    defaultColumns: ["title", "updatedAt"],
    description:
      "Ana sayfa Instagram şeridi gönderileri (#instagram). Sürükle-bırak ile sıralayın.",
    livePreview: {
      url: () => buildPreviewUrl("/#instagram"),
    },
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    ...homeRevalidateHooks,
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "instagramHint",
      "Ana sayfa #instagram şeridi. Görseller medya kütüphanesinden seçilir.",
    ),
    siteLinkField("instagramSiteLink", "/#instagram", "Instagram bölümünü aç →"),
    {
      name: "title",
      type: "text",
      label: "Başlık",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Açıklama",
    },
    siteMediaField("postMedia", "Video / görsel"),
    {
      name: "externalUrl",
      type: "text",
      label: "Instagram bağlantısı",
      admin: {
        description: "Boş bırakılırsa profil adresi kullanılır.",
      },
    },
    lastEditedByField,
  ],
};
