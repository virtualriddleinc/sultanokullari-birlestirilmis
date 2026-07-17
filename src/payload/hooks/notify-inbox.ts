import type { PayloadRequest } from "payload";

type Args = {
  collectionSlug: string;
  doc: Record<string, unknown>;
  req: PayloadRequest;
};

function buildSubject(collectionSlug: string, doc: Record<string, unknown>): string {
  if (collectionSlug === "ik-applications") {
    return `[Sultan Okulları] Yeni İK başvurusu: ${doc.fullName ?? "—"}`;
  }
  return `[Sultan Okulları] Yeni iletişim mesajı: ${doc.subject ?? "—"}`;
}

function buildBody(collectionSlug: string, doc: Record<string, unknown>): string {
  const lines = [
    `Kaynak: ${collectionSlug}`,
    `Ad: ${doc.name ?? doc.fullName ?? "—"}`,
    `E-posta: ${doc.email ?? "—"}`,
    `Telefon: ${doc.phone ?? "—"}`,
  ];
  if (doc.subject) lines.push(`Konu: ${doc.subject}`);
  if (doc.position) lines.push(`Pozisyon: ${doc.position}`);
  if (doc.message) lines.push(`\nMesaj:\n${doc.message}`);
  if (doc.coverLetter) lines.push(`\nÖn yazı:\n${doc.coverLetter}`);
  lines.push("\n— Sultan Okulları Yönetim Paneli");
  return lines.join("\n");
}

/** Panel-içi bildirim kaydı oluştur (hearing-crm notifications uyarlaması) */
async function createInboxPanelNotification(
  collectionSlug: string,
  doc: Record<string, unknown>,
  req: PayloadRequest,
): Promise<void> {
  const isIk = collectionSlug === "ik-applications";
  const who = String(doc.fullName ?? doc.name ?? "—");
  const title = isIk
    ? `Yeni İK başvurusu: ${who}`
    : `Yeni iletişim mesajı: ${who}`;
  const message = isIk
    ? `${who} — ${doc.position ?? "pozisyon belirtilmedi"}`
    : `${who} — ${doc.subject ?? "konu belirtilmedi"}`;

  try {
    await req.payload.create({
      collection: "notifications",
      data: {
        title,
        message,
        type: "inbox",
        link: `/admin/collections/${collectionSlug}/${doc.id}`,
        isRead: false,
      },
      overrideAccess: true,
      req,
    });
  } catch (error) {
    req.payload.logger.warn({ err: error }, "Panel-içi bildirim oluşturulamadı");
  }
}

/** Yeni form kaydı — panel bildirimi + e-posta (SMTP yapılandırılmışsa) veya konsol */
export async function notifyInboxSubmission({ collectionSlug, doc, req }: Args): Promise<void> {
  // 1) Panel-içi bildirim (SMTP olmasa da her zaman çalışır)
  await createInboxPanelNotification(collectionSlug, doc, req);

  // 2) E-posta bildirimi
  const recipients =
    process.env.INBOX_NOTIFY_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean) ?? [];

  const subject = buildSubject(collectionSlug, doc);
  const body = buildBody(collectionSlug, doc);

  if (recipients.length === 0) {
    req.payload.logger.info({ subject }, "Yeni gelen kutusu kaydı (INBOX_NOTIFY_EMAIL tanımlı değil)");
    return;
  }

  try {
    await req.payload.sendEmail({
      to: recipients,
      subject,
      text: body,
    });
  } catch (error) {
    req.payload.logger.warn({ err: error, subject }, "Gelen kutusu e-posta bildirimi gönderilemedi");
  }
}
