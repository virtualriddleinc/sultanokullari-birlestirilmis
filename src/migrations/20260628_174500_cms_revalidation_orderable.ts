import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "_order" varchar;
    UPDATE "hero_slides" SET "_order" = LPAD(CAST("order" AS text), 10, '0') WHERE "_order" IS NULL;
    ALTER TABLE "hero_slides" ALTER COLUMN "_order" SET NOT NULL;
    CREATE INDEX IF NOT EXISTS "hero_slides__order_idx" ON "hero_slides" USING btree ("_order");
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "order";

    ALTER TABLE "journey_chapters" ADD COLUMN IF NOT EXISTS "_order" varchar;
    UPDATE "journey_chapters" SET "_order" = LPAD(CAST("order" AS text), 10, '0') WHERE "_order" IS NULL;
    ALTER TABLE "journey_chapters" ALTER COLUMN "_order" SET NOT NULL;
    CREATE INDEX IF NOT EXISTS "journey_chapters__order_idx" ON "journey_chapters" USING btree ("_order");
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "order";

    ALTER TABLE "neden_sultan_items" ADD COLUMN IF NOT EXISTS "_order" varchar;
    UPDATE "neden_sultan_items" SET "_order" = LPAD(CAST("order" AS text), 10, '0') WHERE "_order" IS NULL;
    ALTER TABLE "neden_sultan_items" ALTER COLUMN "_order" SET NOT NULL;
    CREATE INDEX IF NOT EXISTS "neden_sultan_items__order_idx" ON "neden_sultan_items" USING btree ("_order");
    ALTER TABLE "neden_sultan_items" DROP COLUMN IF EXISTS "order";

    ALTER TABLE "instagram_posts" ADD COLUMN IF NOT EXISTS "_order" varchar;
    UPDATE "instagram_posts" SET "_order" = LPAD(CAST("order" AS text), 10, '0') WHERE "_order" IS NULL;
    ALTER TABLE "instagram_posts" ALTER COLUMN "_order" SET NOT NULL;
    CREATE INDEX IF NOT EXISTS "instagram_posts__order_idx" ON "instagram_posts" USING btree ("_order");
    ALTER TABLE "instagram_posts" DROP COLUMN IF EXISTS "order";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "instagram_posts" ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0 NOT NULL;
    UPDATE "instagram_posts" SET "order" = COALESCE(NULLIF(regexp_replace("_order", '[^0-9]', '', 'g'), ''), '0')::numeric;
    DROP INDEX IF EXISTS "instagram_posts__order_idx";
    ALTER TABLE "instagram_posts" DROP COLUMN IF EXISTS "_order";

    ALTER TABLE "neden_sultan_items" ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0 NOT NULL;
    UPDATE "neden_sultan_items" SET "order" = COALESCE(NULLIF(regexp_replace("_order", '[^0-9]', '', 'g'), ''), '0')::numeric;
    DROP INDEX IF EXISTS "neden_sultan_items__order_idx";
    ALTER TABLE "neden_sultan_items" DROP COLUMN IF EXISTS "_order";

    ALTER TABLE "journey_chapters" ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0 NOT NULL;
    UPDATE "journey_chapters" SET "order" = COALESCE(NULLIF(regexp_replace("_order", '[^0-9]', '', 'g'), ''), '0')::numeric;
    DROP INDEX IF EXISTS "journey_chapters__order_idx";
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "_order";

    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0 NOT NULL;
    UPDATE "hero_slides" SET "order" = COALESCE(NULLIF(regexp_replace("_order", '[^0-9]', '', 'g'), ''), '0')::numeric;
    DROP INDEX IF EXISTS "hero_slides__order_idx";
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "_order";
  `)
}
