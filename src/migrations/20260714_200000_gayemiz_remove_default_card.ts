import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Gâyemiz: varsayılan bilgi kartı alanlarını kaldır.
 * Bilgi kartları yalnızca decorCells (petek hücreleri) üzerinden yönetilir; hepsi silinebilir.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "tagline";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "title_line1";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "title_line2";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "title_line3";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "cta_label";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "cta_href";
    ALTER TABLE "gayemiz" DROP COLUMN IF EXISTS "secondary_description";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "tagline" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "title_line1" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "title_line2" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "title_line3" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "description" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "cta_label" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "cta_href" varchar;
    ALTER TABLE "gayemiz" ADD COLUMN IF NOT EXISTS "secondary_description" varchar;

    UPDATE "gayemiz" SET
      "tagline" = COALESCE("tagline", 'Gâyemiz · Ufkumuz'),
      "title_line1" = COALESCE("title_line1", 'Değer merkezli eğitim,'),
      "title_line2" = COALESCE("title_line2", 'güçlü bir gelecek vizyonu ile birleşiyor.'),
      "title_line3" = COALESCE("title_line3", ''),
      "description" = COALESCE(
        "description",
        'Peygamber Efendimizin (s.a.s) izinde, üsve-i hasene olmayı hedefleyen; ilim, hikmet ve ahlâkla bütünleşmiş nesiller yetiştiriyoruz.'
      ),
      "cta_label" = COALESCE("cta_label", 'Kademeleri Keşfet'),
      "cta_href" = COALESCE("cta_href", '/egitim/kademeler')
    WHERE "id" IS NOT NULL;

    ALTER TABLE "gayemiz" ALTER COLUMN "tagline" SET NOT NULL;
    ALTER TABLE "gayemiz" ALTER COLUMN "title_line1" SET NOT NULL;
    ALTER TABLE "gayemiz" ALTER COLUMN "title_line2" SET NOT NULL;
    ALTER TABLE "gayemiz" ALTER COLUMN "description" SET NOT NULL;
    ALTER TABLE "gayemiz" ALTER COLUMN "cta_label" SET NOT NULL;
    ALTER TABLE "gayemiz" ALTER COLUMN "cta_href" SET NOT NULL;
  `);
}
