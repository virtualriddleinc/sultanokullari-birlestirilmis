import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Add nested tables/columns needed by branch and media archive REST reads. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "seo_description" varchar;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "geo_citation_summary" varchar;

    ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "last_edited_by_id" integer;

    CREATE TABLE IF NOT EXISTS "branches_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "media_items_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tag" varchar NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "branches_faq_items_order_idx" ON "branches_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "branches_faq_items_parent_id_idx" ON "branches_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "media_items_tags_order_idx" ON "media_items_tags" ("_order");
    CREATE INDEX IF NOT EXISTS "media_items_tags_parent_id_idx" ON "media_items_tags" ("_parent_id");

    DO $$ BEGIN
      ALTER TABLE "branches_faq_items"
        ADD CONSTRAINT "branches_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "branches"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "media_items_tags"
        ADD CONSTRAINT "media_items_tags_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "media_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "branches"
        ADD CONSTRAINT "branches_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "media_items"
        ADD CONSTRAINT "media_items_last_edited_by_id_users_id_fk"
        FOREIGN KEY ("last_edited_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Non-destructive: keep data-bearing CMS fields/tables.
}
