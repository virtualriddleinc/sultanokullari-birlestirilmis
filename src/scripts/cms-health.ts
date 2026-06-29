#!/usr/bin/env tsx
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { getCmsHealth } = await import("@/lib/cms-health");
  const health = await getCmsHealth();

  console.log("\n=== CMS Sağlık Raporu ===\n");
  console.log(`Durum: ${health.ok ? "OK" : "SORUN VAR"}\n`);

  if (Object.keys(health.counts).length > 0) {
    console.log("Kayıt sayıları:");
    for (const [key, count] of Object.entries(health.counts)) {
      console.log(`  ${key}: ${count}`);
    }
    console.log("");
  }

  if (health.issues.length === 0) {
    console.log("Uyarı veya hata yok.");
  } else {
    for (const issue of health.issues) {
      console.log(`[${issue.level.toUpperCase()}] ${issue.message}`);
      if (issue.action) console.log(`  → ${issue.action}`);
    }
  }

  process.exit(health.ok ? 0 : 1);
}

main().catch((error) => {
  console.error("cms:health başarısız:", error);
  process.exit(1);
});
