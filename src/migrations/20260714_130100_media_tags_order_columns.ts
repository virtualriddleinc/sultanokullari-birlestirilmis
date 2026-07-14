import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Align hasMany select storage with Payload's parent_id/order query shape. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media_tags" ADD COLUMN IF NOT EXISTS "order" integer;
    ALTER TABLE "media_tags" ADD COLUMN IF NOT EXISTS "parent_id" integer;

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'media_tags'
          AND column_name = '_order'
      ) THEN
        EXECUTE 'UPDATE "media_tags" SET "order" = COALESCE("order", "_order"), "parent_id" = COALESCE("parent_id", "_parent_id")';
      END IF;
    END $$;

    ALTER TABLE "media_tags" ALTER COLUMN "order" SET NOT NULL;
    ALTER TABLE "media_tags" ALTER COLUMN "parent_id" SET NOT NULL;

    CREATE INDEX IF NOT EXISTS "media_tags_order_idx" ON "media_tags" ("order");
    CREATE INDEX IF NOT EXISTS "media_tags_parent_id_idx" ON "media_tags" ("parent_id");

    DO $$ BEGIN
      ALTER TABLE "media_tags"
        ADD CONSTRAINT "media_tags_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Keep data-bearing compatibility columns in place.
}
