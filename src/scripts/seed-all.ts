#!/usr/bin/env tsx
import { config } from "dotenv";
import { spawn } from "child_process";

config({ path: ".env.local" });

function run(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", script], {
      stdio: "inherit",
      shell: true,
      env: process.env,
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} çıkış kodu: ${code}`));
    });
  });
}

async function main() {
  console.log("=== seed:all — tüm seed komutları ===\n");
  await run("src/scripts/seed-homepage.ts");
  await run("src/scripts/seed-pages.ts");
  await run("src/scripts/seed-events.ts");
  console.log("\nseed:all tamamlandı.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
