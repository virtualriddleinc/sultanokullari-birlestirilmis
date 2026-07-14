import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * Local/cloud smoke DBs can have earlier migrations marked applied while nested
 * Payload tables from later CMS fields are missing. Keep this patch idempotent.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_news_kind" AS ENUM ('haber', 'duyuru');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_path_prefix" AS ENUM ('kurumsal', 'egitim', 'rehberlik', 'akademik', 'yasam', 'root');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_template" AS ENUM ('kurumsal-blok', 'overlay-story', 'egitim-segment', 'rehberlik', 'yasal');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_hero_media_kind" AS ENUM ('image', 'video');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_media_tags" AS ENUM ('hero', 'branch', 'news', 'event', 'corporate', 'video');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_ana_sayfa_yemekhane_section_media_kind" AS ENUM ('image', 'video');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_staff_department" ADD VALUE IF NOT EXISTS 'egitim_danisma';
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TYPE "public"."enum_staff_branch_slug" ADD VALUE IF NOT EXISTS 'mevlana';
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
  `);

  await db.execute(sql`
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "kind" "public"."enum_news_kind" DEFAULT 'haber';
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "seo_description" varchar;
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false;
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "geo_citation_summary" varchar;

    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_kind" "public"."enum_news_kind" DEFAULT 'haber';
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_publish_at" timestamp(3) with time zone;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_og_image_id" integer;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_no_index" boolean DEFAULT false;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_geo_citation_summary" varchar;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_last_edited_by_id" integer;

    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "seo_description" varchar;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "geo_citation_summary" varchar;

    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "seo_description" varchar;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false;
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "geo_citation_summary" varchar;

    ALTER TABLE "media_items" ADD COLUMN IF NOT EXISTS "last_edited_by_id" integer;

    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_og_image_id" integer;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_no_index" boolean DEFAULT false;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_geo_citation_summary" varchar;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_last_edited_by_id" integer;

    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_title" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_slug" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_intro" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "path_prefix" "public"."enum_pages_path_prefix" DEFAULT 'kurumsal';
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "template" "public"."enum_pages_template" DEFAULT 'kurumsal-blok';
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "story_eyebrow" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "story_motto" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "gallery_title" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "gallery_description" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_media_kind" "public"."enum_pages_hero_media_kind" DEFAULT 'image';
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_media_media_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_media_src" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_media_alt" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_media_poster" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_description" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "og_image_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "geo_citation_summary" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "_status" "public"."enum_pages_status" DEFAULT 'draft';

    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_path_prefix" "public"."enum_pages_path_prefix" DEFAULT 'kurumsal';
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_template" "public"."enum_pages_template" DEFAULT 'kurumsal-blok';
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_story_eyebrow" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_story_motto" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_gallery_title" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_gallery_description" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_media_kind" "public"."enum_pages_hero_media_kind" DEFAULT 'image';
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_media_media_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_media_src" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_media_alt" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_media_poster" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_og_image_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_no_index" boolean DEFAULT false;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_geo_citation_summary" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_last_edited_by_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version__status" "public"."enum__pages_v_version_status" DEFAULT 'draft';
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "latest" boolean;

    ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "academic_title" varchar;
    ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "education" varchar;
    ALTER TABLE "staff" DROP CONSTRAINT IF EXISTS "staff_photo_id_media_id_fk";
    ALTER TABLE "staff" DROP COLUMN IF EXISTS "photo_id";

    ALTER TABLE "site_ayarlari" ADD COLUMN IF NOT EXISTS "default_og_image_id" integer;

    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_url" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_width" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_height" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filename" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_url" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_width" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_height" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_filename" varchar;

    ALTER TABLE "ana_sayfa" ADD COLUMN IF NOT EXISTS "yemekhane_section_media_kind" "public"."enum_ana_sayfa_yemekhane_section_media_kind" DEFAULT 'image';
    ALTER TABLE "ana_sayfa" ADD COLUMN IF NOT EXISTS "yemekhane_section_media_media_id" integer;
    ALTER TABLE "ana_sayfa" ADD COLUMN IF NOT EXISTS "yemekhane_section_media_src" varchar;
    ALTER TABLE "ana_sayfa" ADD COLUMN IF NOT EXISTS "yemekhane_section_media_alt" varchar;
    ALTER TABLE "ana_sayfa" ADD COLUMN IF NOT EXISTS "yemekhane_section_media_poster" varchar;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "application_files_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_items_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "audit_logs_id" integer;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "staff" ALTER COLUMN "_order" TYPE varchar USING "_order"::varchar;
    EXCEPTION WHEN datatype_mismatch THEN NULL; END $$;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "news_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "events_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "pages_story_rows" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "text" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "pages_story_rows_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "pages_gallery_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item_kind" "public"."enum_pages_hero_media_kind" DEFAULT 'image',
      "item_media_id" integer,
      "item_src" varchar,
      "item_alt" varchar,
      "item_poster" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL
    );

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

    CREATE TABLE IF NOT EXISTS "media_tags" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "public"."enum_media_tags",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "ana_sayfa_yemekhane_section_paragraphs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_news_v_version_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_events_v_version_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_version_story_rows" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "text" varchar NOT NULL,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_version_story_rows_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_version_gallery_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item_kind" "public"."enum_pages_hero_media_kind" DEFAULT 'image',
      "item_media_id" integer,
      "item_src" varchar,
      "item_alt" varchar,
      "item_poster" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_version_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar NOT NULL,
      "answer" varchar NOT NULL,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "news_faq_items_order_idx" ON "news_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "news_faq_items_parent_id_idx" ON "news_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "events_faq_items_order_idx" ON "events_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "events_faq_items_parent_id_idx" ON "events_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_story_rows_order_idx" ON "pages_story_rows" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_story_rows_parent_id_idx" ON "pages_story_rows" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_story_rows_highlights_order_idx" ON "pages_story_rows_highlights" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_story_rows_highlights_parent_id_idx" ON "pages_story_rows_highlights" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_gallery_items_order_idx" ON "pages_gallery_items" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_gallery_items_parent_id_idx" ON "pages_gallery_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_faq_items_order_idx" ON "pages_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_faq_items_parent_id_idx" ON "pages_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "branches_faq_items_order_idx" ON "branches_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "branches_faq_items_parent_id_idx" ON "branches_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "media_items_tags_order_idx" ON "media_items_tags" ("_order");
    CREATE INDEX IF NOT EXISTS "media_items_tags_parent_id_idx" ON "media_items_tags" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "media_tags_order_idx" ON "media_tags" ("order");
    CREATE INDEX IF NOT EXISTS "media_tags_parent_id_idx" ON "media_tags" ("parent_id");
    CREATE INDEX IF NOT EXISTS "ana_sayfa_yemekhane_section_paragraphs_order_idx" ON "ana_sayfa_yemekhane_section_paragraphs" ("_order");
    CREATE INDEX IF NOT EXISTS "ana_sayfa_yemekhane_section_paragraphs_parent_id_idx" ON "ana_sayfa_yemekhane_section_paragraphs" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_news_v_version_faq_items_order_idx" ON "_news_v_version_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "_news_v_version_faq_items_parent_id_idx" ON "_news_v_version_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_events_v_version_faq_items_order_idx" ON "_events_v_version_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "_events_v_version_faq_items_parent_id_idx" ON "_events_v_version_faq_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_story_rows_order_idx" ON "_pages_v_version_story_rows" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_story_rows_parent_id_idx" ON "_pages_v_version_story_rows" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_story_rows_highlights_order_idx" ON "_pages_v_version_story_rows_highlights" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_story_rows_highlights_parent_id_idx" ON "_pages_v_version_story_rows_highlights" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_gallery_items_order_idx" ON "_pages_v_version_gallery_items" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_gallery_items_parent_id_idx" ON "_pages_v_version_gallery_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_faq_items_order_idx" ON "_pages_v_version_faq_items" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_faq_items_parent_id_idx" ON "_pages_v_version_faq_items" ("_parent_id");
  `);

  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'media'
          AND column_name = 'tags'
      ) THEN
        INSERT INTO "media_tags" ("order", "parent_id", "value")
        SELECT tag_item.ordinality - 1, "media"."id", tag_item.value
        FROM "media"
        CROSS JOIN LATERAL unnest("media"."tags") WITH ORDINALITY AS tag_item(value, ordinality)
        ON CONFLICT DO NOTHING;

        ALTER TABLE "media" DROP COLUMN "tags";
      END IF;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "news_faq_items"
        ADD CONSTRAINT "news_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "news"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "events_faq_items"
        ADD CONSTRAINT "events_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_story_rows"
        ADD CONSTRAINT "pages_story_rows_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_story_rows_highlights"
        ADD CONSTRAINT "pages_story_rows_highlights_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages_story_rows"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_gallery_items"
        ADD CONSTRAINT "pages_gallery_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_faq_items"
        ADD CONSTRAINT "pages_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "media_tags"
        ADD CONSTRAINT "media_tags_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

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
      ALTER TABLE "ana_sayfa_yemekhane_section_paragraphs"
        ADD CONSTRAINT "ana_sayfa_yemekhane_section_paragraphs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "ana_sayfa"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_news_v_version_faq_items"
        ADD CONSTRAINT "_news_v_version_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_news_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_events_v_version_faq_items"
        ADD CONSTRAINT "_events_v_version_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_events_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_version_story_rows"
        ADD CONSTRAINT "_pages_v_version_story_rows_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_version_story_rows_highlights"
        ADD CONSTRAINT "_pages_v_version_story_rows_highlights_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v_version_story_rows"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_version_gallery_items"
        ADD CONSTRAINT "_pages_v_version_gallery_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_version_faq_items"
        ADD CONSTRAINT "_pages_v_version_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "news"
        ADD CONSTRAINT "news_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "events"
        ADD CONSTRAINT "events_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages"
        ADD CONSTRAINT "pages_og_image_id_media_id_fk"
        FOREIGN KEY ("og_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

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

    DO $$ BEGIN
      ALTER TABLE "pages"
        ADD CONSTRAINT "pages_hero_media_media_id_media_id_fk"
        FOREIGN KEY ("hero_media_media_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_ayarlari"
        ADD CONSTRAINT "site_ayarlari_default_og_image_id_media_id_fk"
        FOREIGN KEY ("default_og_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "ana_sayfa"
        ADD CONSTRAINT "ana_sayfa_yemekhane_section_media_media_id_media_id_fk"
        FOREIGN KEY ("yemekhane_section_media_media_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_application_files_fk"
        FOREIGN KEY ("application_files_id") REFERENCES "application_files"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_media_items_fk"
        FOREIGN KEY ("media_items_id") REFERENCES "media_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk"
        FOREIGN KEY ("audit_logs_id") REFERENCES "audit_logs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_application_files_id_idx"
      ON "payload_locked_documents_rels" ("application_files_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_items_id_idx"
      ON "payload_locked_documents_rels" ("media_items_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_audit_logs_id_idx"
      ON "payload_locked_documents_rels" ("audit_logs_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_version_faq_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_version_gallery_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_version_story_rows_highlights" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_version_story_rows" CASCADE;
    DROP TABLE IF EXISTS "_events_v_version_faq_items" CASCADE;
    DROP TABLE IF EXISTS "_news_v_version_faq_items" CASCADE;
    DROP TABLE IF EXISTS "ana_sayfa_yemekhane_section_paragraphs" CASCADE;
    DROP TABLE IF EXISTS "media_tags" CASCADE;
    DROP TABLE IF EXISTS "pages_faq_items" CASCADE;
    DROP TABLE IF EXISTS "pages_gallery_items" CASCADE;
    DROP TABLE IF EXISTS "pages_story_rows_highlights" CASCADE;
    DROP TABLE IF EXISTS "pages_story_rows" CASCADE;
    DROP TABLE IF EXISTS "events_faq_items" CASCADE;
    DROP TABLE IF EXISTS "news_faq_items" CASCADE;
  `);
}
