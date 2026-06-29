import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { inboxCollectionAccess } from "@/payload/access";
import { inboxNotifyAfterChange } from "@/payload/hooks/inbox-hooks";
import { adminHintField } from "@/payload/fields/admin-hint-field";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: {
    singular: "İletişim Mesajı",
    plural: "İletişim Mesajları",
  },
  admin: {
    useAsTitle: "subject",
    group: ADMIN_GROUPS.inbox,
    defaultColumns: ["name", "subject", "source", "status", "createdAt"],
    description:
      "İletişim sayfası ve ana sayfa Sizi Arayalım modalından gelen mesajlar.",
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/payload/admin/InboxActionWrappers#ContactInboxActions",
        ],
      },
      beforeListTable: [
        "@/components/payload/admin/InboxBulkActions#ContactInboxBulkActions",
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
      "inboxHint",
      "Kayıt açıldığında otomatik okundu işaretlenir. Toplu işlem için listede satırları seçin.",
    ),
    {
      name: "name",
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
      name: "subject",
      type: "text",
      label: "Konu",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      label: "Mesaj",
      required: true,
    },
    {
      name: "branchSlug",
      type: "text",
      label: "Şube slug",
      admin: {
        description: "Formda şube seçildiyse.",
      },
    },
    {
      name: "source",
      type: "select",
      label: "Kaynak",
      required: true,
      defaultValue: "contact",
      options: [
        { label: "İletişim sayfası", value: "contact" },
        { label: "Sizi Arayalım modal", value: "info_request" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      label: "Durum",
      required: true,
      defaultValue: "new",
      options: [
        { label: "Yeni", value: "new" },
        { label: "Okundu", value: "read" },
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
