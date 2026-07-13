import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { isAdmin, isAdminOrEditorOrInbox } from "@/payload/access";

const MAX_BYTES = 5 * 1024 * 1024;

const enforceSize: CollectionBeforeValidateHook = ({ req, data }) => {
  const file = req.file;
  if (file && typeof file.size === "number" && file.size > MAX_BYTES) {
    throw new Error("Başvuru dosyası en fazla 5 MB olabilir.");
  }
  return data;
};

/** İK CV / başvuru ekleri — PDF ve Word */
export const ApplicationFiles: CollectionConfig = {
  slug: "application-files",
  labels: {
    singular: "Başvuru Dosyası",
    plural: "Başvuru Dosyaları",
  },
  admin: {
    group: ADMIN_GROUPS.inbox,
    useAsTitle: "filename",
    defaultColumns: ["filename", "mimeType", "filesize", "updatedAt"],
    description: "İK başvurularına eklenen CV dosyaları (PDF/Word, max 5 MB).",
  },
  access: {
    read: isAdminOrEditorOrInbox,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [enforceSize],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Açıklama",
      required: true,
    },
  ],
  upload: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};
