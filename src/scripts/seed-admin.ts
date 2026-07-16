/**
 * Güvenli production/break-glass admin seed.
 *
 * Kullanım:
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD='...' \
 *   ALLOW_PROD_SEED=true \
 *   npx tsx src/scripts/seed-admin.ts
 *
 * Production'da ALLOW_PROD_SEED=true zorunlu.
 * Şifre en az 16 karakter; zayıf değerler reddedilir.
 */
import { getPayload } from "payload";

import config from "../payload.config";
import {
  emitBootstrapEvent,
  isBootstrapLockClaimed,
  isProductionLike,
  touchBootstrapLockForSeed,
  tryClaimBootstrapLock,
} from "../lib/cms-security";

const WEAK_PASSWORDS = new Set([
  "admin123",
  "password",
  "password123",
  "12345678",
  "changeme",
  "sultan123",
]);

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "";
  const allowProd = process.env.ALLOW_PROD_SEED?.trim() === "true";

  if (!email || !email.includes("@")) {
    throw new Error("SEED_ADMIN_EMAIL geçerli bir e-posta olmalıdır.");
  }
  if (password.length < 16 || WEAK_PASSWORDS.has(password.toLowerCase())) {
    throw new Error(
      "SEED_ADMIN_PASSWORD en az 16 karakter olmalı ve zayıf olmamalıdır.",
    );
  }
  if (isProductionLike() && !allowProd) {
    throw new Error(
      "Production/preview ortamında seed için ALLOW_PROD_SEED=true gerekir.",
    );
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: { password, roles: ["admin"] },
      overrideAccess: true,
      context: { skipBootstrapLock: true },
    });
    await touchBootstrapLockForSeed(email);
    console.log("admin updated", email);
    return;
  }

  const locked = await isBootstrapLockClaimed();
  if (locked) {
    await touchBootstrapLockForSeed(email);
  } else {
    const claim = await tryClaimBootstrapLock(email);
    if (claim === "already_claimed") {
      await touchBootstrapLockForSeed(email);
    }
  }

  await payload.create({
    collection: "users",
    data: { email, password, roles: ["admin"] },
    overrideAccess: true,
    context: { skipBootstrapLock: true },
  });

  void emitBootstrapEvent({
    event: "cms.bootstrap.seed_admin_created",
    level: "critical",
    email,
  });
  console.log("admin created", email);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
