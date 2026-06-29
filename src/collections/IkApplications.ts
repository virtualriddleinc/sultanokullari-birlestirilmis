import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { inboxCollectionAccess } from "@/payload/access";
import { inboxNotifyAfterChange } from "@/payload/hooks/inbox-hooks";
import { adminHintField } from "@/payload/fields/admin-hint-field";

export const IkApplications: CollectionConfig = {
  slug: "ik-applications",
  labels: {
    singular: "İK Başvurusu",
    plural: "İK Başvuruları",
  },
  admin: {
    useAsTitle: "fullName",
    group: ADMIN_GROUPS.inbox,
    defaultColumns: ["fullName", "position", "status", "createdAt"],
    description: "İnsan Kaynakları sayfasından gelen iş başvuruları.",
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/payload/admin/InboxActionWrappers#IkInboxActions",
        ],
      },
      beforeListTable: [
        "@/components/payload/admin/InboxBulkActions#IkInboxBulkActions",
      ],
    },
  },
  defaultSort: "-createdAt",
  access: inboxCollectionAccess,
  hooks: {
    afterChange: [inboxNotifyAfterChange],
  },
  timestamps: true,
  fields: [
    adminHintField(
      "ikHint",
      "İK başvuruları yalnızca panelden okunur. Yeni kayıtlar INBOX_NOTIFY_EMAIL ile bildirilir.",
    ),
    {
      name: "fullName",
      type: "text",
      label: "Ad Soyad",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "E-posta",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      label: "Telefon",
      required: true,
    },
    {
      name: "branchSlug",
      type: "text",
      label: "Tercih edilen şube",
    },
    {
      name: "position",
      type: "text",
      label: "Pozisyon",
      required: true,
    },
    {
      name: "experienceYears",
      type: "number",
      label: "Deneyim (yıl)",
      required: true,
      min: 0,
      max: 50,
    },
    {
      name: "education",
      type: "text",
      label: "Eğitim",
      required: true,
    },
    {
      name: "coverLetter",
      type: "textarea",
      label: "Ön yazı",
      required: true,
    },
    {
      name: "status",
      type: "select",
      label: "Durum",
      required: true,
      defaultValue: "new",
      options: [
        { label: "Yeni", value: "new" },
        { label: "İncelendi", value: "read" },
        { label: "Arşiv", value: "archived" },
      ],
      admin: {
        position: "sidebar",
        components: {
          Cell: "@/components/payload/admin/InboxStatusCell",
        },
      },
    },
  ],
};
