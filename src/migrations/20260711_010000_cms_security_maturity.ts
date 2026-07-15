import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * CMS güvenlik / olgunluk: audit-logs, application-files, publishAt,
 * inbox rolü, navigasyon CMS menüsü, İK CV ilişkisi.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Kullanıcı: inbox rolü enum'a eklenir (varsa atlanır)
    DO $$ BEGIN
      ALTER TYPE "enum_users_roles" ADD VALUE IF NOT EXISTS 'inbox';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
      WHEN undefined_object THEN NULL;
    END $$;

    -- _pages_v versiyonlama tablosu — ilk migration'da eksikse oluştur
    CREATE TABLE IF NOT EXISTS "_pages_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );

    -- navigation global tablosu — ilk migration'da eksikse oluştur
    CREATE TABLE IF NOT EXISTS "navigation" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Zamanlanmış yayın
    ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "publish_at" timestamp(3) with time zone;
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "publish_at" timestamp(3) with time zone;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "publish_at" timestamp(3) with time zone;
    ALTER TABLE "_news_v" ADD COLUMN IF NOT EXISTS "version_publish_at" timestamp(3) with time zone;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_publish_at" timestamp(3) with time zone;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_publish_at" timestamp(3) with time zone;

    -- Navigasyon: tam CMS menü
    ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "use_cms_menu" boolean DEFAULT false;

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

    -- Başvuru dosyaları (İK CV)
    CREATE TABLE IF NOT EXISTS "application_files" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );

    CREATE INDEX IF NOT EXISTS "application_files_created_at_idx" ON "application_files" ("created_at");
    CREATE INDEX IF NOT EXISTS "application_files_filename_idx" ON "application_files" ("filename");
    CREATE UNIQUE INDEX IF NOT EXISTS "application_files_filename_unique" ON "application_files" ("filename");

    ALTER TABLE "ik_applications" ADD COLUMN IF NOT EXISTS "cv_id" integer;

    -- Şube / kadro yayın bayrağı
    ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;
    ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "is_published" boolean DEFAULT true;

    -- Denetim kayıtları
    CREATE TABLE IF NOT EXISTS "audit_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "summary" varchar NOT NULL,
      "action" varchar NOT NULL,
      "collection" varchar NOT NULL,
      "document_id" varchar,
      "user_email" varchar,
      "user_id" varchar,
      "meta" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" ("created_at");
    CREATE INDEX IF NOT EXISTS "audit_logs_collection_idx" ON "audit_logs" ("collection");

    -- Payload kilit ilişkileri — yeni koleksiyonlar
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "application_files_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "audit_logs_id" integer;
  `);

  // FK'ler ayrı — tablo yoksa sessizce geç
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
      ALTER TABLE "ik_applications"
        ADD CONSTRAINT "ik_applications_cv_id_application_files_id_fk"
        FOREIGN KEY ("cv_id") REFERENCES "application_files"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_application_files_fk"
        FOREIGN KEY ("application_files_id") REFERENCES "application_files"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk"
        FOREIGN KEY ("audit_logs_id") REFERENCES "audit_logs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_application_files_id_idx"
      ON "payload_locked_documents_rels" ("application_files_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_audit_logs_id_idx"
      ON "payload_locked_documents_rels" ("audit_logs_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ik_applications" DROP CONSTRAINT IF EXISTS "ik_applications_cv_id_application_files_id_fk";
    ALTER TABLE "ik_applications" DROP COLUMN IF EXISTS "cv_id";
    ALTER TABLE "branches" DROP COLUMN IF EXISTS "is_published";
    ALTER TABLE "staff" DROP COLUMN IF EXISTS "is_published";
    DROP TABLE IF EXISTS "audit_logs" CASCADE;
    DROP TABLE IF EXISTS "application_files" CASCADE;
    DROP TABLE IF EXISTS "navigation_sections_items" CASCADE;
    DROP TABLE IF EXISTS "navigation_sections" CASCADE;
    ALTER TABLE "navigation" DROP COLUMN IF EXISTS "use_cms_menu";
    ALTER TABLE "news" DROP COLUMN IF EXISTS "publish_at";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "publish_at";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "publish_at";
    ALTER TABLE "_news_v" DROP COLUMN IF EXISTS "version_publish_at";
    ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_publish_at";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_publish_at";
  `);
}
