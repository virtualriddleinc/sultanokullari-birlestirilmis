import type { CollectionBeforeChangeHook } from "payload";

/** Son düzenleyen kullanıcıyı kaydet */
export const trackLastEditedBy: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === "create" || operation === "update") {
    if (req.user?.id) {
      return { ...data, lastEditedBy: req.user.id };
    }
  }
  return data;
};
