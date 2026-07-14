import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import {
  hasRole,
  usersCollectionAccess,
  type AppUser,
  type AppUserRole,
} from "@/payload/access";
import { hideUsersFromInbox } from "@/payload/admin-visibility";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Kullanıcı",
    plural: "Kullanıcılar",
  },
  admin: {
    hidden: hideUsersFromInbox,
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
        const actor = req.user as AppUser | null;
        // Strip role changes only when a non-admin authenticated actor is present.
        // Local/system calls (no user) must retain explicit roles for seeding.
        if (data && actor && !hasRole(actor, "admin")) {
          delete data.roles;
        }

        const roles = data?.roles ?? originalDoc?.roles;
        if (roles && roles.length > 0) return data;

        const { totalDocs } = await req.payload.count({
          collection: "users",
          overrideAccess: true,
        });
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
        create: ({ req }) => hasRole(req.user as AppUser | null, "admin"),
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
