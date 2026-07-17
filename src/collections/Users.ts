import { APIError, type CollectionConfig } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import {
  hasRole,
  usersCollectionAccess,
  type AppUser,
  type AppUserRole,
} from "@/payload/access";
import { hideUnlessAdmin } from "@/payload/admin-visibility";
import {
  createAuditAfterChange,
  createAuditAfterDelete,
} from "@/payload/hooks/audit-log-hooks";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Kullanıcı",
    plural: "Kullanıcılar",
  },
  admin: {
    hidden: hideUnlessAdmin,
    useAsTitle: "email",
    group: ADMIN_GROUPS.system,
    defaultColumns: ["email", "roles", "updatedAt"],
    description:
      "Yalnızca yöneticiler kullanıcı ekleyebilir, silebilir ve rollerini değiştirebilir.",
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: usersCollectionAccess,
  hooks: {
    beforeLogin: [
      ({ user }) => {
        // Pasifleştirilen kullanıcıların girişini engelle (hearing-crm is_active uyarlaması).
        if (user && (user as { isActive?: boolean }).isActive === false) {
          throw new APIError(
            "Hesabınız pasif durumda. Lütfen bir yönetici ile iletişime geçin.",
            403,
          );
        }
        return user;
      },
    ],
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        const actor = req.user as AppUser | null;
        // Strip role changes only when a non-admin authenticated actor is present.
        // Local/system calls (no user) must retain explicit roles for seeding.
        if (data && actor && !hasRole(actor, "admin")) {
          delete data.roles;
          // Non-admins may not toggle their own active state.
          delete data.isActive;
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
    afterChange: [createAuditAfterChange("users")],
    afterDelete: [createAuditAfterDelete("users")],
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
    {
      name: "isActive",
      type: "checkbox",
      label: "Aktif",
      defaultValue: true,
      access: {
        update: ({ req }) => hasRole(req.user as AppUser | null, "admin"),
        create: ({ req }) => hasRole(req.user as AppUser | null, "admin"),
      },
      admin: {
        position: "sidebar",
        description:
          "Pasifleştirilen kullanıcı panele giriş yapamaz. Yalnızca yönetici değiştirebilir.",
      },
      saveToJWT: true,
    },
  ],
  versions: false,
};
