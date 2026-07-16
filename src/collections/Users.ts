import type { CollectionConfig, PayloadRequest } from "payload";
import { APIError } from "payload";

import { ADMIN_GROUPS } from "@/payload/admin-groups";
import {
  hasRole,
  usersCollectionAccess,
  type AppUser,
  type AppUserRole,
} from "@/payload/access";
import { hideUnlessAdmin } from "@/payload/admin-visibility";
import {
  emitBootstrapEvent,
  isBootstrapFailClosed,
  isBootstrapLockClaimed,
  tryClaimBootstrapLock,
} from "@/lib/cms-security";

function extractEmail(data: Record<string, unknown> | undefined): string {
  const email = data?.email;
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

async function enforceBootstrapClaimOnCreate(
  data: Record<string, unknown> | undefined,
  req: PayloadRequest,
  actor: AppUser | null,
): Promise<Record<string, unknown> | undefined> {
  if (!data) return data;

  const { totalDocs } = await req.payload.count({
    collection: "users",
    overrideAccess: true,
  });

  // Sonraki kullanıcılar — bootstrap kilidine girme
  if (totalDocs > 0) {
    return data;
  }

  // Break-glass seed: lock zaten claim edilmiş olabilir
  const ctx = req.context as { skipBootstrapLock?: boolean } | undefined;
  if (ctx?.skipBootstrapLock) {
    return {
      ...data,
      roles: (data.roles as AppUserRole[] | undefined)?.length
        ? data.roles
        : (["admin"] as AppUserRole[]),
    };
  }

  const email = extractEmail(data) || "unknown";
  const lockAlready = await isBootstrapLockClaimed();
  if (lockAlready) {
    void emitBootstrapEvent({
      event: "cms.bootstrap.lock_conflict",
      level: "warn",
      email,
    });
    throw new APIError(
      "İlk kullanıcı oluşturma bu sistemde kapatıldı. Yöneticinizle iletişime geçin.",
      403,
    );
  }

  const claim = await tryClaimBootstrapLock(email);
  if (claim === "already_claimed") {
    void emitBootstrapEvent({
      event: "cms.bootstrap.lock_conflict",
      level: "warn",
      email,
    });
    throw new APIError(
      "İlk kullanıcı oluşturma yarışı kaybedildi. Sistem zaten yapılandırılıyor veya yapılandırılmış.",
      409,
    );
  }

  // Client roles yok say — ilk kullanıcı her zaman admin (admin actor dahil)
  void emitBootstrapEvent({
    event: "cms.bootstrap.first_admin_created",
    level: "critical",
    email,
    detail: actor ? `actor:${actor.id}` : "anonymous",
  });
  return { ...data, roles: ["admin"] as AppUserRole[] };
}

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
    cookies: {
      secure: isBootstrapFailClosed() || process.env.NODE_ENV === "production",
      sameSite: "Lax",
    },
  },
  access: usersCollectionAccess,
  hooks: {
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        const actor = req.user as AppUser | null;

        if (operation === "create") {
          const nextData = await enforceBootstrapClaimOnCreate(
            data as Record<string, unknown> | undefined,
            req,
            actor,
          );
          data = nextData ?? data;
        }

        // Strip role changes only when a non-admin authenticated actor is present.
        if (data && actor && !hasRole(actor, "admin")) {
          delete data.roles;
        }

        // İlk create'te roles zaten admin zorlandı; diğer durumlarda fallback
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
