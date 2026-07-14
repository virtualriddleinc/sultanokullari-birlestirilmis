import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Gâyemiz global — petek + bilgi kartı (sol menü öğesi).
 * push:false ortamında tablo yoksa admin /admin/globals/gayemiz 404 verir.
 * Varsayılan bilgi kartı sütunları 20260714_200000 ile kaldırılır.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_gayemiz_decor_cells_slot" AS ENUM (
        'top-left',
        'top-right',
        'right',
        'bottom'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_gayemiz_decor_cells_media_kind" AS ENUM (
        'image',
        'video'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "gayemiz" (
      "id" serial PRIMARY KEY NOT NULL,
      "tagline" varchar NOT NULL,
      "title_line1" varchar NOT NULL,
      "title_line2" varchar NOT NULL,
      "title_line3" varchar,
      "description" varchar NOT NULL,
      "cta_label" varchar NOT NULL,
      "cta_href" varchar NOT NULL,
      "secondary_description" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "gayemiz_decor_cells" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "slot" "enum_gayemiz_decor_cells_slot" NOT NULL,
      "tagline" varchar NOT NULL,
      "title_line1" varchar NOT NULL,
      "title_line2" varchar NOT NULL,
      "title_line3" varchar NOT NULL,
      "description" varchar NOT NULL,
      "button_text" varchar NOT NULL,
      "button_link" varchar NOT NULL,
      "media_kind" "enum_gayemiz_decor_cells_media_kind" DEFAULT 'image',
      "media_media_id" integer,
      "media_src" varchar,
      "media_alt" varchar NOT NULL,
      "media_poster" varchar,
      "focal_point_x" numeric DEFAULT 50,
      "focal_point_y" numeric DEFAULT 50,
      "media_scale" numeric DEFAULT 1,
      "media_aspect" numeric
    );

    CREATE TABLE IF NOT EXISTS "gayemiz_levels" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "description" varchar NOT NULL,
      "href" varchar NOT NULL,
      "cta_label" varchar
    );

    CREATE INDEX IF NOT EXISTS "gayemiz_decor_cells_order_idx"
      ON "gayemiz_decor_cells" ("_order");
    CREATE INDEX IF NOT EXISTS "gayemiz_decor_cells_parent_id_idx"
      ON "gayemiz_decor_cells" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "gayemiz_decor_cells_media_media_idx"
      ON "gayemiz_decor_cells" ("media_media_id");

    CREATE INDEX IF NOT EXISTS "gayemiz_levels_order_idx"
      ON "gayemiz_levels" ("_order");
    CREATE INDEX IF NOT EXISTS "gayemiz_levels_parent_id_idx"
      ON "gayemiz_levels" ("_parent_id");
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "gayemiz_decor_cells"
        ADD CONSTRAINT "gayemiz_decor_cells_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "gayemiz"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "gayemiz_decor_cells"
        ADD CONSTRAINT "gayemiz_decor_cells_media_media_id_media_id_fk"
        FOREIGN KEY ("media_media_id") REFERENCES "media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "gayemiz_levels"
        ADD CONSTRAINT "gayemiz_levels_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "gayemiz"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    INSERT INTO "gayemiz" (
      "tagline",
      "title_line1",
      "title_line2",
      "title_line3",
      "description",
      "cta_label",
      "cta_href",
      "updated_at",
      "created_at"
    )
    SELECT
      'Gâyemiz · Ufkumuz',
      'Değer merkezli eğitim,',
      'güçlü bir gelecek vizyonu ile birleşiyor.',
      '',
      'Peygamber Efendimizin (s.a.s) izinde, üsve-i hasene olmayı hedefleyen; ilim, hikmet ve ahlâkla bütünleşmiş nesiller yetiştiriyoruz.',
      'Kademeleri Keşfet',
      '/egitim/kademeler',
      NOW(),
      NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "gayemiz" LIMIT 1);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "gayemiz_decor_cells" CASCADE;
    DROP TABLE IF EXISTS "gayemiz_levels" CASCADE;
    DROP TABLE IF EXISTS "gayemiz" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_gayemiz_decor_cells_slot";
    DROP TYPE IF EXISTS "public"."enum_gayemiz_decor_cells_media_kind";
  `);
}
