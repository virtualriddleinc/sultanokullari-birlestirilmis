import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_staff_department" AS ENUM('yonetim', 'egitim', 'idari');
    CREATE TYPE "public"."enum_staff_branch_slug" AS ENUM('sancaktepe', 'basiskele', 'serdivan', 'sincan');
    CREATE TYPE "public"."enum_media_tags" AS ENUM('hero', 'branch', 'news', 'event', 'corporate', 'video');

    CREATE TABLE "staff" (
      "id" serial PRIMARY KEY NOT NULL,
      "_order" integer,
      "full_name" varchar NOT NULL,
      "title" varchar NOT NULL,
      "department" "enum_staff_department" NOT NULL,
      "branch_slug" "enum_staff_branch_slug",
      "photo_id" integer,
      "last_edited_by_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "site_ayarlari" (
      "id" serial PRIMARY KEY NOT NULL,
      "instagram_handle" varchar DEFAULT 'sultanokullari',
      "instagram_url" varchar,
      "footer_email" varchar,
      "footer_phone" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "site_ayarlari_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL
    );

    ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "staff" ADD CONSTRAINT "staff_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "site_ayarlari_social_links" ADD CONSTRAINT "site_ayarlari_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "staff_order_idx" ON "staff" USING btree ("_order");
    CREATE INDEX "staff_photo_idx" ON "staff" USING btree ("photo_id");
    CREATE INDEX "staff_last_edited_by_idx" ON "staff" USING btree ("last_edited_by_id");
    CREATE INDEX "site_ayarlari_social_links_order_idx" ON "site_ayarlari_social_links" USING btree ("_order");
    CREATE INDEX "site_ayarlari_social_links_parent_id_idx" ON "site_ayarlari_social_links" USING btree ("_parent_id");

    ALTER TABLE "media" ADD COLUMN "tags" "enum_media_tags"[];
    ALTER TABLE "events" ADD COLUMN "body" jsonb;
    ALTER TABLE "_events_v" ADD COLUMN "version_body" jsonb;

    ALTER TABLE "pages" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "branches" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "news" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "events" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "hero_slides" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "journey_chapters" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "neden_sultan_items" ADD COLUMN "last_edited_by_id" integer;
    ALTER TABLE "instagram_posts" ADD COLUMN "last_edited_by_id" integer;

    ALTER TABLE "pages" ADD CONSTRAINT "pages_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "branches" ADD CONSTRAINT "branches_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "news" ADD CONSTRAINT "news_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "events" ADD CONSTRAINT "events_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "journey_chapters" ADD CONSTRAINT "journey_chapters_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "neden_sultan_items" ADD CONSTRAINT "neden_sultan_items_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "instagram_posts" ADD CONSTRAINT "instagram_posts_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "pages_last_edited_by_idx" ON "pages" USING btree ("last_edited_by_id");
    CREATE INDEX "branches_last_edited_by_idx" ON "branches" USING btree ("last_edited_by_id");
    CREATE INDEX "news_last_edited_by_idx" ON "news" USING btree ("last_edited_by_id");
    CREATE INDEX "events_last_edited_by_idx" ON "events" USING btree ("last_edited_by_id");

    INSERT INTO "site_ayarlari" ("instagram_handle", "instagram_url", "footer_email")
    SELECT 'sultanokullari', 'https://www.instagram.com/sultanokullari/', 'info@sultanokullari.com'
    WHERE NOT EXISTS (SELECT 1 FROM "site_ayarlari" LIMIT 1);

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "staff_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk"
      FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_staff_id_idx"
      ON "payload_locked_documents_rels" USING btree ("staff_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "instagram_posts" DROP CONSTRAINT IF EXISTS "instagram_posts_last_edited_by_id_users_id_fk";
    ALTER TABLE "neden_sultan_items" DROP CONSTRAINT IF EXISTS "neden_sultan_items_last_edited_by_id_users_id_fk";
    ALTER TABLE "journey_chapters" DROP CONSTRAINT IF EXISTS "journey_chapters_last_edited_by_id_users_id_fk";
    ALTER TABLE "hero_slides" DROP CONSTRAINT IF EXISTS "hero_slides_last_edited_by_id_users_id_fk";
    ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_last_edited_by_id_users_id_fk";
    ALTER TABLE "news" DROP CONSTRAINT IF EXISTS "news_last_edited_by_id_users_id_fk";
    ALTER TABLE "branches" DROP CONSTRAINT IF EXISTS "branches_last_edited_by_id_users_id_fk";
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_last_edited_by_id_users_id_fk";

    ALTER TABLE "instagram_posts" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "neden_sultan_items" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "body";
    ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_body";
    ALTER TABLE "news" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "branches" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "last_edited_by_id";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "tags";

    DROP TABLE IF EXISTS "site_ayarlari_social_links" CASCADE;
    DROP TABLE IF EXISTS "site_ayarlari" CASCADE;
    DROP TABLE IF EXISTS "staff" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_media_tags";
    DROP TYPE IF EXISTS "public"."enum_staff_branch_slug";
    DROP TYPE IF EXISTS "public"."enum_staff_department";

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_staff_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_staff_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "staff_id";
  `);
}
