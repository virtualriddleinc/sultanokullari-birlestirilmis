/**
 * Orderable koleksiyonlardaki LPAD `_order` anahtarlarını
 * Payload fractional indexing formatına (a0, a1, ...) çevirir.
 */
import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(fileURLToPath(import.meta.url));

type Row = { id: number; _order: string | null };

const TABLES = [
  "hero_slides",
  "journey_chapters",
  "neden_sultan_items",
  "instagram_posts",
  "staff",
] as const;

function generateNKeysBetween(
  a: string | null,
  b: string | null,
  n: number,
): string[] {
  const { generateNKeysBetween: gen } = require(
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
  return gen(a, b, n);
}

function isBrokenOrderKey(order: string | null): boolean {
  if (!order) return true;
  if (!/^\d+$/.test(order)) return false;
  const head = order[0];
  const expectedLen = 11 - (head.charCodeAt(0) - "0".charCodeAt(0));
  return order.length < expectedLen;
}

function extractRows(result: unknown): Row[] {
  if (Array.isArray(result)) return result as Row[];
  if (
    result &&
    typeof result === "object" &&
    Array.isArray((result as { rows?: unknown }).rows)
  ) {
    return (result as { rows: Row[] }).rows;
  }
  return [];
}

async function fixTable(
  db: MigrateUpArgs["db"],
  table: (typeof TABLES)[number],
): Promise<void> {
  const result = await db.execute(
    sql.raw(
      `SELECT id, "_order" FROM "${table}" ORDER BY "_order" ASC NULLS LAST, id ASC`,
    ),
  );
  const records = extractRows(result);
  if (records.length === 0) return;
  if (!records.some((r) => isBrokenOrderKey(r._order))) return;

  const keys = generateNKeysBetween(null, null, records.length);
  for (let i = 0; i < records.length; i++) {
    const id = Number(records[i].id);
    const key = keys[i].replace(/'/g, "''");
    await db.execute(
      sql.raw(`UPDATE "${table}" SET "_order" = '${key}' WHERE id = ${id}`),
    );
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await fixTable(db, table);
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Fractional → LPAD geri dönüş güvenli değil.
}
