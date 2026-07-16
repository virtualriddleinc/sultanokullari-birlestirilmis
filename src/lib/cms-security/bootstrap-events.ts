import { isProductionLike } from "./bootstrap-env";

export type BootstrapEventName =
  | "cms.bootstrap.first_register_denied_no_secret"
  | "cms.bootstrap.first_register_denied_bad_secret"
  | "cms.bootstrap.first_register_denied_ip"
  | "cms.bootstrap.first_register_secret_ok"
  | "cms.bootstrap.lock_conflict"
  | "cms.bootstrap.anonymous_create_denied"
  | "cms.bootstrap.first_admin_created"
  | "cms.bootstrap.seed_admin_created"
  | "cms.bootstrap.forgot_disabled_no_smtp";

type BootstrapEventPayload = {
  event: BootstrapEventName;
  level: "info" | "warn" | "critical";
  ip?: string;
  email?: string;
  detail?: string;
};

/**
 * Yapılandırılmış bootstrap log + isteğe bağlı e-posta uyarısı.
 */
export async function emitBootstrapEvent(
  payload: BootstrapEventPayload,
): Promise<void> {
  const line = JSON.stringify({
    ...payload,
    ts: new Date().toISOString(),
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  });

  if (payload.level === "critical") {
    console.error(line);
  } else if (payload.level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }

  if (payload.level === "info" && !isProductionLike()) return;

  const notifyTo = process.env.INBOX_NOTIFY_EMAIL?.trim();
  const smtpHost = process.env.SMTP_HOST?.trim();
  if (!notifyTo || !smtpHost) return;
  if (payload.level === "info") return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodemailerMod: any = await import("nodemailer");
    const transporter = nodemailerMod.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
    await transporter.sendMail({
      from:
        process.env.SMTP_FROM?.trim() ||
        "noreply@sultanokullari.com",
      to: notifyTo,
      subject: `[CMS Bootstrap] ${payload.event}`,
      text: line,
    });
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "cms.bootstrap.alert_failed",
        detail: error instanceof Error ? error.message : "unknown",
      }),
    );
  }
}
