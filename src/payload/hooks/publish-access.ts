import type { CollectionBeforeChangeHook } from "payload";

import { hasRole, type AppUser } from "@/payload/access";

/** Editör yalnızca taslak kaydedebilir; yayın yalnızca yönetici. Seed/CLI (user yok) serbest. */
export const restrictEditorPublish: CollectionBeforeChangeHook = ({
  data,
  req,
}) => {
  if (!data) return data;
  if (!req.user) return data;
  if (hasRole(req.user as AppUser | null, "admin")) return data;
  if (data._status === "published") {
    return { ...data, _status: "draft" };
  }
  return data;
};

/**
 * Zamanlanmış yayın: publishAt gelecekteyse taslakta tut.
 * Cron /api/cron/publish-scheduled zamanı gelince yayınlar.
 */
export const applyScheduledPublish: CollectionBeforeChangeHook = ({
  data,
  req,
}) => {
  if (!data) return data;
  const publishAt = data.publishAt as string | Date | null | undefined;
  if (!publishAt) return data;

  const when = publishAt instanceof Date ? publishAt : new Date(publishAt);
  if (Number.isNaN(when.getTime())) return data;

  if (when.getTime() > Date.now()) {
    // Gelecek tarih → taslak; yalnızca admin zamanlayabilir
    if (req.user && !hasRole(req.user as AppUser | null, "admin")) {
      return { ...data, _status: "draft", publishAt: null };
    }
    return { ...data, _status: "draft" };
  }

  return data;
};
