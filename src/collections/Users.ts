import type { CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import { hasRole, usersCollectionAccess, type AppUser, type AppUserRole } from "@/payload/access";

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
      "Yönetici: tam yetki. Editör: içerik ve form gelen kutusu; kullanıcı yönetimi yok.",
  },
  auth: true,
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
        const fallbackRole =
          operation === "create" || totalDocs <= 1 ? "admin" : "editor";

        return { ...data, roles: [fallbackRole] };
      },
    ],
    afterLogin: [
      async ({ user, req }) => {
        const appUser = user as AppUser;
        if (appUser.roles?.length) return user;

        const roles: AppUserRole[] = ["admin"];

        await req.payload.update({
          collection: "users",
          id: user.id,
          data: { roles },
          overrideAccess: true,
        });

        return { ...user, roles };
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
      ],
      access: {
        update: ({ req }) => hasRole(req.user as AppUser | null, "admin"),
      },
      admin: {
        description: "En az bir rol seçin. Yönetici tüm panele erişir.",
      },
      saveToJWT: true,
    },
  ],
  versions: false,
};
