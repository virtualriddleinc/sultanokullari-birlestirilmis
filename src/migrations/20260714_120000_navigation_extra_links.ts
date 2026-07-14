import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Ensure navigation nested tables exist (sections, items, extra_links).
 * Earlier security migration could leave a partial schema on fresh DBs.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "navigation_sections" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "key" varchar,
      "label" varchar,
      "description" varchar
    );

    CREATE TABLE IF NOT EXISTS "navigation_sections_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "icon" varchar
    );

    DO $$ BEGIN
      CREATE TYPE "public"."enum_navigation_extra_links_group" AS ENUM (
        'kurumsal', 'egitim', 'akademik', 'rehberlik', 'okullar', 'yasam', 'guncel'
      );
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "navigation_extra_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "icon" varchar,
      "group" "public"."enum_navigation_extra_links_group" DEFAULT 'kurumsal'
    );

    CREATE INDEX IF NOT EXISTS "navigation_sections_order_idx" ON "navigation_sections" ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_sections_parent_id_idx" ON "navigation_sections" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_sections_items_order_idx" ON "navigation_sections_items" ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_sections_items_parent_id_idx" ON "navigation_sections_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_extra_links_order_idx" ON "navigation_extra_links" ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_extra_links_parent_id_idx" ON "navigation_extra_links" ("_parent_id");
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "navigation_sections"
        ADD CONSTRAINT "navigation_sections_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "navigation_sections_items"
        ADD CONSTRAINT "navigation_sections_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "navigation_sections"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "navigation_extra_links"
        ADD CONSTRAINT "navigation_extra_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "navigation_extra_links" CASCADE;
    DROP TABLE IF EXISTS "navigation_sections_items" CASCADE;
    DROP TABLE IF EXISTS "navigation_sections" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_navigation_extra_links_group";
  `);
}
