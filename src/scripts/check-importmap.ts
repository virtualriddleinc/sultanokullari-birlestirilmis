#!/usr/bin/env tsx
/**
 * Özel admin bileşenlerinin importMap.js içinde kayıtlı olduğunu doğrular.
 * CI: npm run check:importmap
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const importMapPath = path.join(root, "src/app/(payload)/admin/importMap.js");

const requiredPaths = [
  "@/components/payload/admin/DashboardWelcome",
  "@/components/payload/admin/AdminLoginBackdrop",
  "@/components/payload/admin/InboxNavLinks",
  "@/components/payload/admin/InboxBulkActions",
  "@/components/payload/admin/AdminHint",
  "@/components/payload/admin/HexFocalPointPicker",
  "@/components/payload/admin/InboxActionWrappers",
  "@/components/payload/admin/InboxStatusCell",
];

function main() {
  if (!fs.existsSync(importMapPath)) {
    console.error("importMap.js bulunamadı. Önce npm run generate:importmap çalıştırın.");
    process.exit(1);
  }

  const content = fs.readFileSync(importMapPath, "utf8");
  const missing = requiredPaths.filter((p) => !content.includes(p));

  if (missing.length > 0) {
    console.error("importMap eksik bileşenler:");
    missing.forEach((p) => console.error(`  - ${p}`));
    console.error("\nÇözüm: npm run generate:importmap");
    process.exit(1);
  }

  console.log("importMap doğrulaması başarılı.");
}

main();
