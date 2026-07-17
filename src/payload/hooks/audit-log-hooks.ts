import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

type AuditAction = "create" | "update" | "delete";

/**
 * Diff'te yok sayılan teknik/gürültü alanları (Payload iç alanları, upload türevleri).
 */
const IGNORED_DIFF_FIELDS = new Set<string>([
  "id",
  "updatedAt",
  "createdAt",
  "sizes",
  "url",
  "thumbnailURL",
  "filename",
  "filesize",
  "width",
  "height",
  "mimeType",
  "focalX",
  "focalY",
  "lastEditedBy",
  // Auth iç alanları — denetime yazılmamalı
  "salt",
  "hash",
  "loginAttempts",
  "lockUntil",
  "resetPasswordToken",
  "resetPasswordExpiration",
  "_verified",
  "_verificationToken",
]);

/**
 * KVKK/gizlilik: bu alanların yalnızca "değişti" bilgisi tutulur, eski/yeni
 * değerleri denetim kaydına yazılmaz (kişisel veri sızıntısını önlemek için).
 */
const SENSITIVE_DIFF_FIELDS = new Set<string>([
  "email",
  "phone",
  "message",
  "coverLetter",
  "name",
  "fullName",
  "password",
  "cv",
]);

function stableStringify(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return String(value);
  }
}

/** Denetim kaydına yazmak için değeri kısaltılmış/özet biçime indirger. */
function summarizeValue(value: unknown): unknown {
  if (value == null) return null;
  if (typeof value === "string") {
    return value.length > 200 ? `${value.slice(0, 200)}…` : value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return `[${value.length} öğe]`;
  if (typeof value === "object") return "[nesne]";
  return String(value);
}

export type AuditChange = {
  changedFields: string[];
  changes: Record<string, { from?: unknown; to?: unknown; changed?: true }>;
};

/** İki doküman arasındaki üst düzey alan farklarını hesaplar. */
export function computeChanges(
  previousDoc: Record<string, unknown> | undefined,
  doc: Record<string, unknown>,
): AuditChange {
  const changes: AuditChange["changes"] = {};
  const changedFields: string[] = [];
  const keys = new Set<string>([
    ...Object.keys(previousDoc ?? {}),
    ...Object.keys(doc ?? {}),
  ]);

  for (const key of keys) {
    if (IGNORED_DIFF_FIELDS.has(key)) continue;
    const before = previousDoc?.[key];
    const after = doc?.[key];
    if (stableStringify(before) === stableStringify(after)) continue;

    changedFields.push(key);
    if (SENSITIVE_DIFF_FIELDS.has(key)) {
      changes[key] = { changed: true };
    } else {
      changes[key] = { from: summarizeValue(before), to: summarizeValue(after) };
    }
  }

  return { changedFields, changes };
}

async function writeAuditLog(args: {
  req: PayloadRequest;
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
      (doc as { headline?: string }).headline ||
      (doc as { tagline?: string }).tagline ||
      (doc as { name?: string }).name ||
      (doc as { email?: string }).email ||
      String(doc.id);

    const isUpdate = operation !== "create";
    const diff = isUpdate
      ? computeChanges(
          previousDoc as Record<string, unknown> | undefined,
          doc as Record<string, unknown>,
        )
      : null;

    // Gerçek bir alan değişmediyse güncelleme kaydı yazma (gürültüyü azalt).
    if (isUpdate && diff && diff.changedFields.length === 0) {
      return doc;
    }

    const summarySuffix =
      isUpdate && diff && diff.changedFields.length > 0
        ? ` (${diff.changedFields.length} alan)`
        : "";

    await writeAuditLog({
      req,
      action: isUpdate ? "update" : "create",
      collection: collectionSlug,
      documentId: String(doc.id),
      summary: `${isUpdate ? "Güncellendi" : "Oluşturuldu"}: ${title}${summarySuffix}`,
      meta: {
        _status: (doc as { _status?: string })._status,
        previousStatus: (previousDoc as { _status?: string } | undefined)?._status,
        ...(diff
          ? { changedFields: diff.changedFields, changes: diff.changes }
          : {}),
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
    const title =
      (doc as { title?: string }).title ||
      (doc as { fullName?: string }).fullName ||
      (doc as { headline?: string }).headline ||
      (doc as { name?: string }).name ||
      (doc as { email?: string }).email ||
      `${collectionSlug}#${doc.id}`;
    await writeAuditLog({
      req,
      action: "delete",
      collection: collectionSlug,
      documentId: String(doc.id),
      summary: `Silindi: ${title}`,
    });
    return doc;
  };
}

export function createGlobalAuditAfterChange(
  globalSlug: string,
): GlobalAfterChangeHook {
  return async ({ doc, req, previousDoc }) => {
    if (!req.user) return doc;
    const diff = computeChanges(
      previousDoc as Record<string, unknown> | undefined,
      doc as Record<string, unknown>,
    );
    if (diff.changedFields.length === 0) return doc;
    await writeAuditLog({
      req,
      action: "update",
      collection: `global:${globalSlug}`,
      documentId: globalSlug,
      summary: `Global güncellendi: ${globalSlug} (${diff.changedFields.length} alan)`,
      meta: { changedFields: diff.changedFields, changes: diff.changes },
    });
    return doc;
  };
}
