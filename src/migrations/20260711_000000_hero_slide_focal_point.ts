import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Hero slayt altıgen odak noktası — focalPoint (x/y), mediaScale, mediaAspect.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "focal_point_x" numeric DEFAULT 50;
    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "focal_point_y" numeric DEFAULT 50;
    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "media_scale" numeric DEFAULT 1;
    ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "media_aspect" numeric;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "focal_point_x";
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "focal_point_y";
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "media_scale";
    ALTER TABLE "hero_slides" DROP COLUMN IF EXISTS "media_aspect";
  `);
}
