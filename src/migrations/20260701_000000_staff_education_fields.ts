import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * İdari Kadro yeniden tasarımı — fotoğraf alanı kaldırıldı, yerine
 * "Unvan" (academic_title) ve "En Yüksek Eğitim Derecesi" (education)
 * opsiyonel metin alanları eklendi.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "academic_title" varchar;
    ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "education" varchar;

    ALTER TABLE "staff" DROP CONSTRAINT IF EXISTS "staff_photo_id_media_id_fk";
    DROP INDEX IF EXISTS "staff_photo_idx";
    ALTER TABLE "staff" DROP COLUMN IF EXISTS "photo_id";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "photo_id" integer;
    ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk"
      FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "staff_photo_idx" ON "staff" USING btree ("photo_id");

    ALTER TABLE "staff" DROP COLUMN IF EXISTS "academic_title";
    ALTER TABLE "staff" DROP COLUMN IF EXISTS "education";
  `);
}
