/**
 * CMS / runtime ortam doğrulaması.
 * Runtime'da PAYLOAD_SECRET veya DATABASE_URL eksikse süreç durur.
 * `next build` (page data collect) sırasında eksik secret'lar modül
 * yüklenmesini engellemez; sitemap ve diğer route'lar statik fallback'e düşer.
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

/** Next.js production build (`next build`) sırasında true. */
function isNextProductionBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim() ?? "";
  if (!value) {
    throw new Error(
      `[env] ${name} tanımlı değil. .env.local dosyasını kontrol edin.`,
    );
  }
  return value;
}

const BUILD_PLACEHOLDER_SECRET =
  "BUILD_TIME_PLACEHOLDER_PAYLOAD_SECRET_32CHARS";
const BUILD_PLACEHOLDER_DATABASE_URL =
  "postgres://build:build@127.0.0.1:5432/payload_build";

export function assertCmsEnv(): {
  payloadSecret: string;
  databaseUrl: string;
  previewSecret: string;
} {
  const payloadSecretRaw = process.env.PAYLOAD_SECRET?.trim() ?? "";
  const databaseUrlRaw = process.env.DATABASE_URL?.trim() ?? "";
  const previewSecret = process.env.PREVIEW_SECRET?.trim() ?? "";
  const isProd = process.env.NODE_ENV === "production";
  const isBuild = isNextProductionBuild();

  // Build fazında secret yoksa placeholder ile devam et.
  // Aksi halde /sitemap.xml collect, import-time throw ile tüm build'i düşürür.
  if (isBuild && (!payloadSecretRaw || !databaseUrlRaw)) {
    return {
      payloadSecret: payloadSecretRaw || BUILD_PLACEHOLDER_SECRET,
      databaseUrl: databaseUrlRaw || BUILD_PLACEHOLDER_DATABASE_URL,
      previewSecret,
    };
  }

  const payloadSecret = requireEnv("PAYLOAD_SECRET");
  const databaseUrl = requireEnv("DATABASE_URL");

  if (payloadSecret.length < 16) {
    throw new Error(
      "[env] PAYLOAD_SECRET en az 16 karakter olmalıdır (üretimde 32+ önerilir).",
    );
  }

  // Yerel production smoke / TestSprite için: ALLOW_LOCAL_PRODUCTION=true
  const allowLocalProduction =
    process.env.ALLOW_LOCAL_PRODUCTION?.trim() === "true";

  // Runtime production kontrolleri (build collect sırasında atlanır —
  // Vercel build anında PREVIEW_SECRET henüz yoksa bile derleme tamamlanır;
  // canlı isteklerde yine zorunludur).
  if (isProd && !allowLocalProduction && !isBuild) {
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
