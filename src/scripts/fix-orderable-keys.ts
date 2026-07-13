/**
 * Acil düzeltme: orderable koleksiyon `_order` anahtarlarını
 * fractional indexing formatına çevir (migration ile aynı mantık).
 */
import { config } from "dotenv";

config({ path: ".env.local" });

import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import payloadConfig from "../payload.config";
import { appendFileSync } from "fs";

const require = createRequire(fileURLToPath(import.meta.url));
const { generateNKeysBetween } = require(
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../node_modules/payload/dist/config/orderable/fractional-indexing.js",
  ),
) as {
  generateNKeysBetween: (
    a: string | null,
    b: string | null,
    n: number,
  ) => string[];
};

const LOG =
  "/Users/virtualriddle/Desktop/Sultan Okulları Resmî Web Sitesi/birlestirme/.cursor/debug-9ca975.log";

function log(message: string, data: Record<string, unknown>) {
  appendFileSync(
    LOG,
    JSON.stringify({
      sessionId: "9ca975",
      runId: "fix-apply",
      hypothesisId: "A",
      location: "fix-orderable-keys.ts",
      message,
      data,
      timestamp: Date.now(),
    }) + "\n",
  );
}

function isBrokenOrderKey(order: string | null | undefined): boolean {
  if (!order) return true;
  if (!/^\d+$/.test(order)) return false;
  const head = order[0];
  const expectedLen = 11 - (head.charCodeAt(0) - "0".charCodeAt(0));
  return order.length < expectedLen;
}

const COLLECTIONS = [
  "hero-slides",
  "journey-chapters",
  "neden-sultan-items",
  "instagram-posts",
  "staff",
] as const;

async function main() {
  const payload = await getPayload({ config: payloadConfig });

  for (const collection of COLLECTIONS) {
    const found = await payload.find({
      collection,
      depth: 0,
      limit: 1000,
      pagination: false,
      sort: "_order",
      overrideAccess: true,
    });

    const docs = found.docs as Array<{ id: number | string; _order?: string | null }>;
    if (docs.length === 0) {
      log(`skip empty ${collection}`, {});
      continue;
    }

    const needsFix = docs.some((d) => isBrokenOrderKey(d._order));
    if (!needsFix) {
      log(`ok already ${collection}`, {
        sample: docs.slice(0, 3).map((d) => d._order),
      });
      continue;
    }

    const keys = generateNKeysBetween(null, null, docs.length);
    const before = docs.map((d) => ({ id: d.id, _order: d._order }));

    for (let i = 0; i < docs.length; i++) {
      await payload.db.updateOne({
        collection,
        id: docs[i].id,
        data: { _order: keys[i] },
        returning: false,
      });
    }

    const after = await payload.find({
      collection,
      depth: 0,
      limit: 20,
      sort: "_order",
      overrideAccess: true,
    });

    log(`fixed ${collection}`, {
      before,
      after: after.docs.map((d) => ({
        id: d.id,
        _order: (d as { _order?: string })._order,
      })),
      keys,
    });
    console.log(`fixed ${collection}:`, keys);
  }

  // Verify create works
  try {
    const created = await payload.create({
      collection: "hero-slides",
      data: {
        tagline: "ORDER FIX PROBE",
        titleLine1: "Line 1",
        titleLine2: "Line 2",
        titleLine3: "Line 3",
        description: "order key fix verification",
        buttonText: "Test",
        buttonLink: "/",
        slideMedia: { kind: "image", alt: "probe", src: "/site-media/test.jpg" },
        focalPoint: { x: 50, y: 50 },
        mediaScale: 1,
        displayDuration: 6,
      },
      overrideAccess: true,
    });
    log("create after fix SUCCEEDED", {
      id: created.id,
      _order: (created as { _order?: string })._order,
    });
    console.log("CREATE OK", created.id, (created as { _order?: string })._order);

    await payload.delete({
      collection: "hero-slides",
      id: created.id,
      overrideAccess: true,
    });
    log("cleanup probe slide deleted", { id: created.id });
  } catch (e) {
    log("create after fix FAILED", {
      error: e instanceof Error ? e.message : String(e),
    });
    console.error("CREATE FAILED", e);
    process.exit(1);
  }

  process.exit(0);
}

void main();
