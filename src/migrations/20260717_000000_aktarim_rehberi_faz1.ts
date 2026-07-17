import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * Aktarım rehberi Faz 1:
 *  - `notifications` koleksiyonu (panel-içi bildirim merkezi)
 *  - `users.is_active` (aktif/pasif kullanıcı)
 *  - `payload_locked_documents_rels.notifications_id` (admin doküman kilidi ilişkisi)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_notifications_type" AS ENUM('info', 'inbox', 'content', 'system');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "notifications" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "message" varchar,
      "type" "enum_notifications_type" DEFAULT 'info' NOT NULL,
      "link" varchar,
      "is_read" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications" USING btree ("created_at");

    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "notifications_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk"
        FOREIGN KEY ("notifications_id") REFERENCES "notifications"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_column THEN NULL; WHEN undefined_table THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_notifications_id_idx"
      ON "payload_locked_documents_rels" ("notifications_id");
  `);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Geri alma non-destructive: veri taşıyan alanlar/tablolar korunur.
}
