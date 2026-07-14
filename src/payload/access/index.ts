import type { Access, AccessArgs } from "payload";

export type AppUserRole = "admin" | "editor" | "inbox";

export type AppUser = {
  id: number | string;
  roles?: AppUserRole[];
};

export function hasRole(
  user: AppUser | null | undefined,
  role: AppUserRole,
): boolean {
  return Boolean(user?.roles?.includes(role));
}

export function hasAnyRole(
  user: AppUser | null | undefined,
  roles: AppUserRole[],
): boolean {
  return roles.some((role) => hasRole(user, role));
}

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const isAdmin: Access = ({ req }) =>
  hasRole(req.user as AppUser | null, "admin");

export const isAdminOrEditor: Access = ({ req }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  return hasRole(user, "admin") || hasRole(user, "editor");
};

/** Yönetici, editör veya gelen kutusu rolü */
export const isAdminOrEditorOrInbox: Access = ({ req }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  return hasAnyRole(user, ["admin", "editor", "inbox"]);
};

/** Yönetici tüm kullanıcıları; diğerleri yalnızca kendi hesabını (boolean — liste/UI gizlensin) */
const readSelfOrAdmin: Access = ({ req, id }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  if (hasRole(user, "admin")) return true;
  // Access Operation / liste: id yok → false (Kullanıcılar menüsü ve sayfası gizlenir)
  if (id == null) return false;
  return String(user.id) === String(id);
};

const updateSelfOrAdmin: Access = ({ req, id }) => {
  const user = req.user as AppUser | null;
  if (!user) return false;
  if (hasRole(user, "admin")) return true;
  if (id == null) return false;
  return String(user.id) === String(id);
};

/**
 * Taslak destekli içerik — anonim yalnızca published; oturumlu tam okuma.
 * Taslak sürümleri yalnızca admin/editör.
 */
export const publishedOrAuthenticatedRead: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};

/** Anında canlı içerik (hero, şube vb.) — herkese açık okuma */
export const publicRead: Access = () => true;

/** Site içeriği (taslaklı) */
export const draftContentCollectionAccess = {
  read: publishedOrAuthenticatedRead,
  create: isAdminOrEditor,
  update: isAdminOrEditor,
  delete: isAdminOrEditor,
  readVersions: isAdminOrEditor,
};

/**
 * Anında canlı site içeriği — herkese açık okuma, editör/yönetici yazma.
 * @deprecated Prefer draftContentCollectionAccess for draft-enabled collections.
 */
export const contentCollectionAccess = {
  read: publicRead,
  create: isAdminOrEditor,
  update: isAdminOrEditor,
  delete: isAdminOrEditor,
  readVersions: isAdminOrEditor,
};

/** Form gelen kutusu — panelden okuma/güncelleme; inbox rolü dahil */
export const inboxCollectionAccess = {
  read: isAdminOrEditorOrInbox,
  create: () => false,
  update: isAdminOrEditorOrInbox,
  delete: isAdmin,
};

/**
 * Kullanıcı yönetimi — yalnızca yönetici liste/ekleme/silme/unlock.
 * Editör/inbox: panelde Kullanıcılar sayfasını görmez; kendi hesabını
 * (/admin/account, findByID) okuyup güncelleyebilir; rollerini değiştiremez.
 */
export const usersCollectionAccess = {
  read: readSelfOrAdmin,
  create: (async ({ req }: AccessArgs) => {
    if (hasRole(req.user as AppUser | null, "admin")) return true;
    // İlk kurulum: henüz kullanıcı yoksa create-first-user
    const existing = await req.payload.count({
      collection: "users",
      overrideAccess: true,
    });
    return existing.totalDocs === 0;
  }) satisfies Access,
  update: updateSelfOrAdmin,
  delete: isAdmin,
  unlock: isAdmin,
};

/** Global — herkese açık okuma; yazma admin veya editör */
export const globalReadAccess = {
  read: publicRead,
  update: isAdminOrEditor,
};

/** Kritik globals — yalnızca yönetici günceller */
export const adminOnlyGlobalAccess = {
  read: publicRead,
  update: isAdmin,
};

/** Audit log — yalnızca yönetici okur; yazma sistem hook'ları ile */
export const auditLogAccess = {
  read: isAdmin,
  create: () => false,
  update: () => false,
  delete: isAdmin,
};
