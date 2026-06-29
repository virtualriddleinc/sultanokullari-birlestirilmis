import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/** Staff koleksiyonu — payload_locked_documents_rels eksik kolon düzeltmesi */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "staff_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk"
      FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_staff_id_idx"
      ON "payload_locked_documents_rels" USING btree ("staff_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_staff_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_staff_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "staff_id";
  `);
}
