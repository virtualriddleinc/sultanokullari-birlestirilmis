import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Add lock relationship columns for collections introduced after the initial DB. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "application_files_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_items_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "audit_logs_id" integer;

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

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Non-destructive: lock relation columns are harmless when unused.
}
