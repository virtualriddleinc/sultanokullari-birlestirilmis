#!/usr/bin/env tsx
/**
 * Phase 2a — CMS path scan for Tier B quarantine candidates.
 *
 * Usage:
 *   npx tsx scripts/check-cms-media-paths.ts
 *   npx tsx scripts/check-cms-media-paths.ts --paths /site-media/foo.jpg /site-media/bar.mp4
 *
 * Exit codes:
 *   0 — clear (no CMS hits) or DB unavailable (quarantine skipped)
 *   1 — one or more paths found in CMS (do not quarantine those)
 *   2 — unexpected script error
 */
import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });
config(); // fallback .env

/** Rapordaki 48 kök site-media yetimi + 8 Instagram site-media ikizi */
export const DEFAULT_CANDIDATE_PATHS: readonly string[] = [
  // site-media-root orphans (WA dump)
  "/site-media/IMG-20260428-WA0019.jpg",
  "/site-media/IMG-20260429-WA0035.jpg",
  "/site-media/IMG-20260429-WA0036.jpg",
  "/site-media/IMG-20260429-WA0037.jpg",
  "/site-media/IMG-20260429-WA0039.jpg",
  "/site-media/IMG-20260429-WA0040.jpg",
  "/site-media/IMG-20260429-WA0078.jpg",
  "/site-media/IMG-20260429-WA0081.jpg",
  "/site-media/IMG-20260429-WA0084.jpg",
  "/site-media/IMG-20260429-WA0098.jpg",
  "/site-media/IMG-20260429-WA0100.jpg",
  "/site-media/IMG-20260429-WA0104.jpg",
  "/site-media/IMG-20260429-WA0107.jpg",
  "/site-media/IMG-20260429-WA0108.jpg",
  "/site-media/IMG-20260429-WA0109.jpg",
  "/site-media/IMG-20260429-WA0111.jpg",
  "/site-media/IMG-20260429-WA0116.jpg",
  "/site-media/IMG-20260429-WA0128.jpg",
  "/site-media/IMG-20260429-WA0139.jpg",
  "/site-media/IMG-20260429-WA0140.jpg",
  "/site-media/IMG-20260429-WA0142.jpg",
  "/site-media/IMG-20260429-WA0145.jpg",
  "/site-media/IMG-20260429-WA0158.jpg",
  "/site-media/IMG-20260429-WA0176.jpg",
  "/site-media/VID-20260429-WA0057.mp4",
  "/site-media/VID-20260429-WA0059.mp4",
  "/site-media/VID-20260429-WA0060.mp4",
  "/site-media/VID-20260429-WA0091.mp4",
  "/site-media/VID-20260429-WA0092.mp4",
  "/site-media/VID-20260429-WA0093.mp4",
  "/site-media/VID-20260429-WA0094.mp4",
  "/site-media/VID-20260429-WA0095.mp4",
  "/site-media/VID-20260429-WA0096.mp4",
  "/site-media/VID-20260429-WA0115.mp4",
  "/site-media/VID-20260429-WA0117.mp4",
  "/site-media/VID-20260429-WA0120.mp4",
  "/site-media/VID-20260429-WA0125.mp4",
  "/site-media/VID-20260429-WA0126.mp4",
  "/site-media/VID-20260429-WA0136.mp4",
  "/site-media/VID-20260429-WA0144.mp4",
  "/site-media/VID-20260429-WA0156.mp4",
  "/site-media/VID-20260429-WA0159.mp4",
  "/site-media/VID-20260429-WA0160.mp4",
  "/site-media/VID-20260429-WA0162.mp4",
  "/site-media/VID-20260429-WA0164.mp4",
  "/site-media/VID-20260429-WA0166.mp4",
  "/site-media/VID-20260429-WA0167.mp4",
  "/site-media/VID-20260429-WA0171.mp4",
  // Instagram site-media twins (social-media/ untouched)
  "/site-media/VID-20260429-WA0161.mp4",
  "/site-media/VID-20260429-WA0163.mp4",
  "/site-media/VID-20260429-WA0165.mp4",
  "/site-media/VID-20260429-WA0168.mp4",
  "/site-media/VID-20260429-WA0169.mp4",
  "/site-media/VID-20260429-WA0178.mp4",
  "/site-media/VID-20260429-WA0179.mp4",
  "/site-media/VID-20260429-WA0180.mp4",
];

type ColumnRef = {
  tableSchema: string;
  tableName: string;
  columnName: string;
  dataType: string;
};

type PathHit = {
  path: string;
  table: string;
  column: string;
  sample: string;
};

function parseArgs(argv: string[]): string[] {
  const idx = argv.indexOf("--paths");
  if (idx === -1) return [...DEFAULT_CANDIDATE_PATHS];
  const paths = argv.slice(idx + 1).filter((a) => !a.startsWith("--"));
  return paths.length > 0 ? paths : [...DEFAULT_CANDIDATE_PATHS];
}

function quoteIdent(ident: string): string {
  return `"${ident.replace(/"/g, '""')}"`;
}

async function listSearchableColumns(client: Client): Promise<ColumnRef[]> {
  const { rows } = await client.query<{
    table_schema: string;
    table_name: string;
    column_name: string;
    data_type: string;
  }>(`
    SELECT table_schema, table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      AND data_type IN (
        'text',
        'character varying',
        'character',
        'json',
        'jsonb'
      )
    ORDER BY table_schema, table_name, column_name
  `);

  return rows.map((r) => ({
    tableSchema: r.table_schema,
    tableName: r.table_name,
    columnName: r.column_name,
    dataType: r.data_type,
  }));
}

async function findPathHits(
  client: Client,
  columns: ColumnRef[],
  paths: string[],
): Promise<PathHit[]> {
  const normalized = paths.map((p) => (p.startsWith("/") ? p : `/${p}`));
  // Full public path only — bare filename would false-positive Instagram
  // /social-media/ twins that share the same basename.
  const likePatterns = normalized.map((n) => `%${n}%`);

  const hits: PathHit[] = [];
  const seen = new Set<string>(); // path|table|column

  for (const col of columns) {
    const fqTable = `${quoteIdent(col.tableSchema)}.${quoteIdent(col.tableName)}`;
    const fqCol = quoteIdent(col.columnName);
    const expr =
      col.dataType === "json" || col.dataType === "jsonb"
        ? `${fqCol}::text`
        : fqCol;

    try {
      const { rows } = await client.query<{ sample: string }>(
        `
        SELECT LEFT(${expr}, 200) AS sample
        FROM ${fqTable}
        WHERE ${expr} LIKE ANY($1::text[])
        LIMIT 20
        `,
        [likePatterns],
      );

      for (const row of rows) {
        const sample = row.sample ?? "";
        for (const path of normalized) {
          if (!sample.includes(path)) continue;
          const key = `${path}|${col.tableSchema}.${col.tableName}|${col.columnName}`;
          if (seen.has(key)) continue;
          seen.add(key);
          hits.push({
            path,
            table: `${col.tableSchema}.${col.tableName}`,
            column: col.columnName,
            sample,
          });
        }
      }
    } catch {
      // Skip columns that fail (permissions, views, etc.)
    }
  }

  return hits;
}

async function main() {
  const paths = parseArgs(process.argv.slice(2));
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    console.log("DB unavailable — quarantine skipped");
    process.exit(0);
  }

  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("DB unavailable — quarantine skipped");
    console.error(`(connect failed: ${msg})`);
    process.exit(0);
  }

  try {
    console.log(`Scanning ${paths.length} candidate path(s) in CMS…`);
    const columns = await listSearchableColumns(client);
    console.log(`Searchable text/json columns: ${columns.length}`);

    const hits = await findPathHits(client, columns, paths);

    if (hits.length === 0) {
      console.log("clear");
      process.exit(0);
    }

    console.log(`\nCMS hits (${hits.length}):`);
    const hitPaths = new Set<string>();
    for (const hit of hits) {
      hitPaths.add(hit.path);
      console.log(
        `  MATCH  ${hit.path}  →  ${hit.table}.${hit.column}  sample=${JSON.stringify(hit.sample)}`,
      );
    }
    console.log(`\nUnique paths in CMS: ${hitPaths.size}`);
    console.log("Do NOT quarantine matched paths.");
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

main().catch((err) => {
  console.error("check-cms-media-paths failed:", err);
  process.exit(2);
});
