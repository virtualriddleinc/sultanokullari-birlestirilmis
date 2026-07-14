import type { AppUser, AppUserRole } from "@/payload/access";
import { hasAnyRole, hasRole } from "@/payload/access";

type HiddenArgs = { user?: AppUser | null };

/** İçerik koleksiyonları — inbox-only kullanıcıya sidebar'da gizle */
export function hideFromInboxOnly({ user }: HiddenArgs): boolean {
  if (!user) return false;
  if (hasRole(user, "admin") || hasRole(user, "editor")) return false;
  return hasRole(user, "inbox");
}

/** Yalnızca admin görür (audit, site ayarları, navigasyon, kullanıcı listesi) */
export function hideUnlessAdmin({ user }: HiddenArgs): boolean {
  if (!user) return true;
  return !hasRole(user, "admin");
}

/** Inbox rolü Users listesini görmesin; hesap için /admin/account kullanır */
export function hideUsersFromInbox({ user }: HiddenArgs): boolean {
  return hideUnlessAdmin({ user });
}

export function userPrimaryRole(user: AppUser | null | undefined): AppUserRole | null {
  if (!user?.roles?.length) return null;
  if (hasRole(user, "admin")) return "admin";
  if (hasRole(user, "editor")) return "editor";
  if (hasRole(user, "inbox")) return "inbox";
  return null;
}

export function isInboxOnly(user: AppUser | null | undefined): boolean {
  return Boolean(user && hasRole(user, "inbox") && !hasAnyRole(user, ["admin", "editor"]));
}
