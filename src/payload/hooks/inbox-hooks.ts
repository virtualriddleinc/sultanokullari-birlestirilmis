import type { CollectionAfterChangeHook } from "payload";

import { notifyInboxSubmission } from "./notify-inbox";

/** Yeni gelen kutusu kaydı bildirimi */
export const inboxNotifyAfterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  collection,
}) => {
  if (operation === "create" && doc.status === "new") {
    await notifyInboxSubmission({
      collectionSlug: collection?.slug ?? "contact-messages",
      doc: doc as Record<string, unknown>,
      req,
    });
  }
};
