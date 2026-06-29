import type { Access } from "payload";

export type AppUserRole = "admin" | "editor";

export type AppUser = {
  id: number | string;
  roles?: AppUserRole[];
};

export function hasRole(user: AppUser | null | undefined, role: AppUserRole): boolean {
  return Boolean(user?.roles?.includes(role));
}

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) =>
  hasRole(req.user as AppUser | null, "admin");

export const isAdminOrEditor: Access = ({ req }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  return hasRole(user, "admin") || hasRole(user, "editor");
};

/** Yönetici tüm kullanıcıları; editör yalnızca kendi hesabını okur/günceller */
const readSelfOrAdmin: Access = ({ req }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  if (hasRole(user, "admin")) return true;
  return { id: { equals: user.id } };
};

const updateSelfOrAdmin: Access = ({ req }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  if (hasRole(user, "admin")) return true;
  return { id: { equals: user.id } };
};

/** Site içeriği — herkese açık okuma, editör/yönetici yazma */
export const contentCollectionAccess = {
  read: () => true,
  create: isAdminOrEditor,
  update: isAdminOrEditor,
  delete: isAdminOrEditor,
};

/** Form gelen kutusu — yalnızca panelden okuma/güncelleme */
export const inboxCollectionAccess = {
  read: isAdminOrEditor,
  create: () => false,
  update: isAdminOrEditor,
  delete: isAdmin,
};

/** Kullanıcı yönetimi — yönetici tam yetki; editör yalnızca kendi hesabı */
export const usersCollectionAccess = {
  read: readSelfOrAdmin,
  create: (async ({ req }) => {
    if (hasRole(req.user as AppUser | null, "admin")) return true;
    const existing = await req.payload.count({
      collection: "users",
      overrideAccess: true,
    });
    return existing.totalDocs === 0;
  }) satisfies Access,
  update: updateSelfOrAdmin,
  delete: isAdmin,
};

/** Global — herkese açık okuma */
export const globalReadAccess = {
  read: () => true,
  update: isAdminOrEditor,
};
