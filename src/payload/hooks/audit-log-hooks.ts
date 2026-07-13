import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

type AuditAction = "create" | "update" | "delete";

async function writeAuditLog(args: {
  req: { payload: { create: Function }; user?: { id?: unknown; email?: string } | null };
  action: AuditAction;
  collection: string;
  documentId?: string;
  summary: string;
  meta?: Record<string, unknown>;
}) {
  const { req, action, collection, documentId, summary, meta } = args;
  if (!req.user) return;

  try {
    await req.payload.create({
      collection: "audit-logs",
      data: {
        summary,
        action,
        collection,
        documentId: documentId ?? "",
        userEmail: req.user.email ?? "",
        userId: String(req.user.id ?? ""),
        meta: meta ?? null,
      },
      overrideAccess: true,
      req,
    });
  } catch (error) {
    console.error("[audit-logs] yazılamadı:", error);
  }
}

export function createAuditAfterChange(
  collectionSlug: string,
): CollectionAfterChangeHook {
  return async ({ doc, operation, req, previousDoc }) => {
    if (!req.user) return doc;
    const title =
      (doc as { title?: string }).title ||
      (doc as { fullName?: string }).fullName ||
      (doc as { tagline?: string }).tagline ||
      (doc as { name?: string }).name ||
      String(doc.id);

    await writeAuditLog({
      req,
      action: operation === "create" ? "create" : "update",
      collection: collectionSlug,
      documentId: String(doc.id),
      summary: `${operation === "create" ? "Oluşturuldu" : "Güncellendi"}: ${title}`,
      meta: {
        _status: (doc as { _status?: string })._status,
        previousStatus: (previousDoc as { _status?: string } | undefined)?._status,
      },
    });
    return doc;
  };
}

export function createAuditAfterDelete(
  collectionSlug: string,
): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    if (!req.user) return doc;
    await writeAuditLog({
      req,
      action: "delete",
      collection: collectionSlug,
      documentId: String(doc.id),
      summary: `Silindi: ${collectionSlug}#${doc.id}`,
    });
    return doc;
  };
}

export function createGlobalAuditAfterChange(
  globalSlug: string,
): GlobalAfterChangeHook {
  return async ({ doc, req }) => {
    if (!req.user) return doc;
    await writeAuditLog({
      req,
      action: "update",
      collection: `global:${globalSlug}`,
      documentId: globalSlug,
      summary: `Global güncellendi: ${globalSlug}`,
    });
    return doc;
  };
}
