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

/** Yeni form kaydı — e-posta (SMTP yapılandırılmışsa) veya konsol */
export async function notifyInboxSubmission({ collectionSlug, doc, req }: Args): Promise<void> {
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
