import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import {
  hasRole,
  usersCollectionAccess,
  type AppUser,
  type AppUserRole,
} from "@/payload/access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Kullanıcı",
    plural: "Kullanıcılar",
  },
  admin: {
    useAsTitle: "email",
    group: ADMIN_GROUPS.system,
    defaultColumns: ["email", "roles", "updatedAt"],
    description:
      "Yönetici: tam yetki. Editör: içerik. Gelen kutusu: yalnızca form mesajları.",
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: usersCollectionAccess,
  hooks: {
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        const roles = data?.roles ?? originalDoc?.roles;
        if (roles && roles.length > 0) return data;

        const { totalDocs } = await req.payload.count({
          collection: "users",
          overrideAccess: true,
        });
        // İlk kullanıcı admin; sonrakiler varsayılan editör (asla otomatik admin yükseltme yok)
        const fallbackRole: AppUserRole =
          operation === "create" && totalDocs === 0 ? "admin" : "editor";

        return { ...data, roles: [fallbackRole] };
      },
    ],
  },
  fields: [
    {
      name: "roles",
      type: "select",
      label: "Roller",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      options: [
        { label: "Yönetici", value: "admin" },
        { label: "Editör", value: "editor" },
        { label: "Gelen Kutusu", value: "inbox" },
      ],
      access: {
        update: ({ req }) => hasRole(req.user as AppUser | null, "admin"),
      },
      admin: {
        description:
          "Yönetici: tam yetki. Editör: içerik. Gelen kutusu: yalnızca iletişim/İK.",
      },
      saveToJWT: true,
    },
  ],
  versions: false,
};
