import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { contentCollectionAccess } from "@/payload/access";
import { homeAndNedenRevalidateHooks } from "@/payload/hooks/collection-hooks";
import { trackLastEditedBy } from "@/payload/hooks/audit-hooks";
import { adminHintField, siteLinkField } from "@/payload/fields/admin-hint-field";
import { lastEditedByField } from "@/payload/fields/last-edited-by-field";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

export const NedenSultanItems: CollectionConfig = {
  slug: "neden-sultan-items",
  orderable: true,
  defaultSort: "_order",
  labels: {
    singular: "Neden Sultan Maddesi",
    plural: "Neden Sultan",
  },
  admin: {
    useAsTitle: "headline",
    group: ADMIN_GROUPS.home,
    hidden: hideFromInboxOnly,
    defaultColumns: ["headline", "updatedAt"],
    description:
      "Ana sayfa Neden Sultan petek maddeleri (#neden) ve kurumsal sayfa. Sürükle-bırak ile sıralayın.",
    livePreview: {
      url: () => buildPreviewUrl("/#neden"),
    },
  },
  hooks: {
    beforeChange: [trackLastEditedBy],
    ...homeAndNedenRevalidateHooks,
  },
  access: contentCollectionAccess,
  fields: [
    adminHintField(
      "nedenHint",
      "Ana sayfa #neden ve /kurumsal/neden-sultan sayfasını etkiler. Sürükle-bırak sıralama.",
    ),
    siteLinkField("nedenSiteLink", "/#neden", "Neden Sultan bölümünü aç →"),
    {
      name: "headline",
      type: "text",
      label: "Başlık (ön yüz)",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      label: "Metin (arka yüz)",
      required: true,
    },
    lastEditedByField,
  ],
};
