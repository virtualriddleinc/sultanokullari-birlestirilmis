import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Bootstrap TOCTOU kilidi + paylaşılan Postgres rate-limit kovaları.
 * Mevcut kullanıcı varsa lock satırı backfill edilir (yeniden açılmayı önler).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "cms_bootstrap_lock" (
      "id" integer PRIMARY KEY,
      "claimed_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
      "claimed_by_email" varchar
    );

    CREATE TABLE IF NOT EXISTS "cms_rate_limit_buckets" (
      "key" varchar PRIMARY KEY NOT NULL,
      "count" integer NOT NULL DEFAULT 0,
      "reset_at" timestamp(3) with time zone NOT NULL
    );

    -- Mevcut kurulum: kullanıcı varken lock'u claim et (public bootstrap kapanır)
    INSERT INTO "cms_bootstrap_lock" ("id", "claimed_at", "claimed_by_email")
    SELECT
      1,
      now(),
      (SELECT "email" FROM "users" ORDER BY "created_at" ASC NULLS LAST, "id" ASC LIMIT 1)
    WHERE EXISTS (SELECT 1 FROM "users" LIMIT 1)
    ON CONFLICT ("id") DO NOTHING;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "cms_rate_limit_buckets";
    DROP TABLE IF EXISTS "cms_bootstrap_lock";
  `);
}
