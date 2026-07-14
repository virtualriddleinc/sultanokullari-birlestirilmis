import type { GlobalConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { buildPreviewUrl } from "@/lib/preview-url";
import { globalReadAccess } from "@/payload/access";
import { revalidateAnaSayfaAfterChange } from "@/payload/hooks/collection-hooks";
import { sectionPreviewField } from "@/payload/fields/section-preview-field";
import { siteLinkField } from "@/payload/fields/admin-hint-field";
import { missionGroupFields } from "@/payload/fields/mission-group-fields";
import { hideFromInboxOnly } from "@/payload/admin-visibility";

/**
 * Ana sayfa Gâyemiz petek + hover bilgi kartları — sol menüde Hero ile aynı seviyede.
 */
export const Gayemiz: GlobalConfig = {
  slug: "gayemiz",
  label: "Gâyemiz",
  hooks: {
    afterChange: [revalidateAnaSayfaAfterChange],
  },
  admin: {
    hidden: hideFromInboxOnly,
    group: ADMIN_GROUPS.home,
    description:
      "Hero sonrası petek örüntüsü ve hücre hover bilgi kartları. Tüm bilgi kartları silinebilir. Kayıt sonrası ana sayfada anında yansır.",
    livePreview: {
      url: () => buildPreviewUrl("/#gayemiz"),
    },
  },
  access: globalReadAccess,
  fields: [
    siteLinkField("gayemizSiteLink", "/#gayemiz", "Gâyemiz bölümünü aç →"),
    sectionPreviewField(
      "gayemizPreview",
      "@/components/payload/admin/SectionPreviewLink#GayemizSectionPreview",
    ),
    ...missionGroupFields(),
  ],
};
