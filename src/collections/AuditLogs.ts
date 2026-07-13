import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { auditLogAccess } from "@/payload/access";

export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  labels: {
    singular: "Denetim Kaydı",
    plural: "Denetim Kayıtları",
  },
  admin: {
    useAsTitle: "summary",
    group: ADMIN_GROUPS.system,
    defaultColumns: ["summary", "action", "collection", "userEmail", "createdAt"],
    description: "İçerik değişikliklerinin kim/ne/ne zaman kaydı. Salt okunur.",
    listSearchableFields: ["summary", "userEmail", "collection", "documentId"],
  },
  defaultSort: "-createdAt",
  access: auditLogAccess,
  timestamps: true,
  fields: [
    {
      name: "summary",
      type: "text",
      label: "Özet",
      required: true,
    },
    {
      name: "action",
      type: "select",
      label: "İşlem",
      required: true,
      options: [
        { label: "Oluşturma", value: "create" },
        { label: "Güncelleme", value: "update" },
        { label: "Silme", value: "delete" },
      ],
    },
    {
      name: "collection",
      type: "text",
      label: "Koleksiyon",
      required: true,
    },
    {
      name: "documentId",
      type: "text",
      label: "Kayıt ID",
    },
    {
      name: "userEmail",
      type: "text",
      label: "Kullanıcı e-posta",
    },
    {
      name: "userId",
      type: "text",
      label: "Kullanıcı ID",
    },
    {
      name: "meta",
      type: "json",
      label: "Ek bilgi",
      admin: {
        description: "Opsiyonel bağlam (ör. _status değişimi).",
      },
    },
  ],
};
