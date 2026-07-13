/**
 * CMS / runtime ortam doğrulaması.
 * PAYLOAD_SECRET veya DATABASE_URL eksikse süreç durur.
 */

import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

const WEAK_SECRETS = new Set([
  "",
  "CHANGE_ME_TO_A_SECURE_RANDOM_STRING_32_CHARS_MIN",
  "CHANGE_ME_PREVIEW_SECRET",
  "secret",
  "payload",
  "test",
]);

function requireEnv(name: string): string {
  const value = process.env[name]?.trim() ?? "";
  if (!value) {
    throw new Error(
      `[env] ${name} tanımlı değil. .env.local dosyasını kontrol edin.`,
    );
  }
  return value;
}

export function assertCmsEnv(): {
  payloadSecret: string;
  databaseUrl: string;
  previewSecret: string;
} {
  const payloadSecret = requireEnv("PAYLOAD_SECRET");
  const databaseUrl = requireEnv("DATABASE_URL");
  const isProd = process.env.NODE_ENV === "production";
  const previewSecret = process.env.PREVIEW_SECRET?.trim() ?? "";

  if (payloadSecret.length < 16) {
    throw new Error(
      "[env] PAYLOAD_SECRET en az 16 karakter olmalıdır (üretimde 32+ önerilir).",
    );
  }

  if (isProd) {
    if (!previewSecret) {
      throw new Error("[env] Üretimde PREVIEW_SECRET zorunludur.");
    }
    if (WEAK_SECRETS.has(payloadSecret) || payloadSecret.length < 32) {
      throw new Error(
        "[env] Üretimde PAYLOAD_SECRET en az 32 karakterlik rastgele bir değer olmalıdır.",
      );
    }
    if (WEAK_SECRETS.has(previewSecret) || previewSecret.length < 16) {
      throw new Error(
        "[env] Üretimde PREVIEW_SECRET en az 16 karakterlik rastgele bir değer olmalıdır.",
      );
    }
    if (
      databaseUrl.includes("payload:payload@") ||
      databaseUrl.includes("@127.0.0.1") ||
      databaseUrl.includes("@localhost")
    ) {
      throw new Error(
        "[env] Üretimde varsayılan/yerel DATABASE_URL kullanılamaz.",
      );
    }
  }

  return { payloadSecret, databaseUrl, previewSecret };
}
