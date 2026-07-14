import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Yolculuk bölümü altıgen odak noktası — focalPoint (x/y), mediaScale, mediaAspect.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journey_chapters" ADD COLUMN IF NOT EXISTS "focal_point_x" numeric DEFAULT 50;
    ALTER TABLE "journey_chapters" ADD COLUMN IF NOT EXISTS "focal_point_y" numeric DEFAULT 50;
    ALTER TABLE "journey_chapters" ADD COLUMN IF NOT EXISTS "media_scale" numeric DEFAULT 1;
    ALTER TABLE "journey_chapters" ADD COLUMN IF NOT EXISTS "media_aspect" numeric;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "focal_point_x";
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "focal_point_y";
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "media_scale";
    ALTER TABLE "journey_chapters" DROP COLUMN IF EXISTS "media_aspect";
  `);
}
