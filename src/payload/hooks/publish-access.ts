import type { CollectionBeforeChangeHook } from "payload";

import { hasRole, type AppUser } from "@/payload/access";

/** Editör yalnızca taslak kaydedebilir; yayın yalnızca yönetici */
export const restrictEditorPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (!data) return data;
  if (hasRole(req.user as AppUser | null, "admin")) return data;
  if (data._status === "published") {
    return { ...data, _status: "draft" };
  }
  return data;
};
