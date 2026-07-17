import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { isAdmin, isAdminOrEditorOrInbox } from "@/payload/access";

/**
 * Panel-içi bildirim merkezi (hearing-crm `notifications` uyarlaması).
 *
 * Paylaşılan (rol-hedefli) bildirimlerdir: yeni bir kayıt sistem hook'ları ile
 * (ör. yeni iletişim/İK mesajı) oluşturulur; panel kullanıcıları listeden
 * görür ve "okundu" işaretler. Payload'da realtime yoktur; sayaç, nav rozeti
 * tarafından periyodik olarak (server component + polling) okunur.
 */
export const Notifications: CollectionConfig = {
  slug: "notifications",
  labels: {
    singular: "Bildirim",
    plural: "Bildirimler",
  },
  admin: {
    group: ADMIN_GROUPS.inbox,
    useAsTitle: "title",
    defaultColumns: ["title", "type", "isRead", "createdAt"],
    description:
      "Panel bildirimleri. Yeni form kayıtları ve önemli olaylar burada listelenir. Okuduktan sonra 'Okundu' işaretleyin.",
    listSearchableFields: ["title", "message"],
  },
  defaultSort: "-createdAt",
  access: {
    // Yalnızca sistem hook'ları oluşturur (overrideAccess).
    read: isAdminOrEditorOrInbox,
    create: () => false,
    update: isAdminOrEditorOrInbox,
    delete: isAdmin,
  },
  timestamps: true,
  fields: [
    {
      name: "title",
      type: "text",
      label: "Başlık",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      label: "Mesaj",
    },
    {
      name: "type",
      type: "select",
      label: "Tür",
      required: true,
      defaultValue: "info",
      options: [
        { label: "Bilgi", value: "info" },
        { label: "Gelen Kutusu", value: "inbox" },
        { label: "İçerik", value: "content" },
        { label: "Sistem", value: "system" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "link",
      type: "text",
      label: "Bağlantı",
      admin: {
        position: "sidebar",
        description: "İlgili kaydın panel adresi (opsiyonel).",
      },
    },
    {
      name: "isRead",
      type: "checkbox",
      label: "Okundu",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};
